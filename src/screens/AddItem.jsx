import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Platform,
    Alert,
    Modal
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import axios from 'axios';
import { uploadImageToFirebase } from '../firebaseService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { categories } from '../../constants/categories';
import Loader from '../components/Loader';
import RentEasyModal from "../components/RentEasyModal";

const AddItem = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "" });
    const [pendingDeleteKey, setPendingDeleteKey] = useState(null);

    const showModal = (title, message, onConfirm = null) => {
        setModalContent({ title, message, onConfirm });
        setModalVisible(true);
    };

    const confirmDelete = (itemKey) => {
        setPendingDeleteKey(itemKey);
        showModal("Delete History?", "Are you sure you want to delete this item?", handleDeleteConfirmed);
    };

    const route = useRoute();
    const activeColor = '#007AFF'; // iOS blue
    const inactiveColor = '#444';  // gray


    const categories = [
        { id: "electronics", label: "Electronics" },
        { id: "furniture", label: "Furniture" },
        { id: "books", label: "Books" },
        { id: "vehicles", label: "Vehicles" },
        { id: "tools", label: "Tools" },
        { id: "others", label: "Others" }
    ];

    const [selectedCategory, setSelectedCategory] = useState("");


    const [itemData, setItemData] = useState({
        title: "",
        description: "",
        fullDescription: "",
        included: "",
        category: selectedCategory || "others",
        pricePerDay: "",
        price3Days: "",
        priceWeek: "",
        securityDeposit: "",
        location: "",
        ownerName: "",
        ownerAddress: "",
        contactNumber: "",
        email: "",
        customTerms: "",
    });

    const [terms, setTerms] = useState({
        idProof: true,
        handleWithCare: true,
        lateCharges: true,
    });

    const [availability, setAvailability] = useState({
        request: false,
        booking: false,
        notAvailable: false,
    });

    const [imageUris, setImageUris] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);

    const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

    const pickImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
            selectionLimit: 5 - imageUris?.length, // Allow only remaining slots
        };

        launchImageLibrary(options, async (response) => {
            if (response.didCancel || response.errorCode) return;

            const selectedAssets = response.assets || [];

            if (selectedAssets.length + imageUris?.length > 5) {
                showModal("Limit Reached", "You can upload a maximum of 5 images.");
                return;
            }

            const newUris = selectedAssets?.map(asset => asset.uri);
            setImageUris(prev => [...prev, ...newUris]);
        });
    };



    const handleSubmit = async () => {

        if (!itemData.title || !itemData.pricePerDay || !itemData.location || imageUris?.length === 0) {
            showModal("Error", "Please fill Title, Price, Location and upload at least 1 image.");
            return;
        }

        try {
            setLoading(true);

            const loggedInUserData = await AsyncStorage.getItem("loggedInUser");
            if (!loggedInUserData) {
                showModal("Error", "User not logged in!");
                return;
            }

            const currentUser = JSON.parse(loggedInUserData);
            const userId = "-OWW6H-fnjJwLOpeZ1zZ"; // Replace this with dynamic user ID if needed

            // 🔼 Upload multiple images to Firebase Storage
            const uploadedImageUrls = [];
            for (let uri of imageUris) {
                const url = await uploadImageToFirebase(uri);
                if (url) uploadedImageUrls.push(url);
            }

            if (uploadedImageUrls.length === 0) {
                showModal("Error", "Failed to upload any image.");
                return;
            }

            // 🔁 Generate item key
            const response = await axios.get(`${URL}/items/${userId}.json`);
            const existingItems = response.data || {};
            const nextItemKey = `item${Object.keys(existingItems).length + 1}`;

            // 📤 Prepare item data
            const finalData = {
                ...itemData,
                images: uploadedImageUrls, // 📌 Store all image URLs in an array
                createdAt: new Date().toISOString(),
                terms,
                availability,
                categories: selectedCategory || "others",
                owner: currentUser.username,
                ownerEmail: currentUser.email,
                ownerPhone: currentUser.phone,
                purchaseCount: 0, // ✅ Initialize count to 0
            };

            // ✅ Upload to Firebase Realtime DB
            await axios.put(`${URL}/items/${userId}/${nextItemKey}.json`, finalData);

            // 📥 History log
            const historyData = {
                title: finalData.title,
                categories: finalData.categories,
                owner: finalData.owner,
                price: finalData.pricePerDay,
                date: finalData.createdAt,
                status: "Posted",
                images: uploadedImageUrls[0],
            };
            await axios.post(`${URL}/history/${currentUser.username}.json`, historyData);

            // 👤 Update user roles
            const res = await axios.get(`${URL}/users.json`);
            const users = res.data || {};
            const userKey = Object.keys(users).find(
                key => users[key].username === currentUser.username
            );
            if (userKey) {
                const updatedRoles = Array.from(new Set([...(users[userKey].roles || []), "Owner"]));
                await axios.patch(`${URL}/users/${userKey}.json`, { roles: updatedRoles });

                const updatedUser = { ...currentUser, roles: updatedRoles };
                await AsyncStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
            }

            showModal("Success", "Item has been added successfully!");
            handleReset();
            navigation.navigate("History");
        } catch (error) {
            console.error("Error storing data:", error);
            showModal("Error", "Failed to store data in Realtime Database.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setItemData({
            title: "",
            description: "",
            fullDescription: "",
            included: "",
            category: selectedCategory || "others",
            pricePerDay: "",
            price3Days: "",
            priceWeek: "",
            securityDeposit: "",
            location: "",
            ownerName: "",
            ownerAddress: "",
            contactNumber: "",
            email: "",
            customTerms: "",
        });
        setImageUris([]);
        setAvailability({ request: false, booking: false, notAvailable: false });
        setTerms({ idProof: true, handleWithCare: true, lateCharges: true });
    };


    return (
        <View style={styles.container}>
            {/* ✅ Header */}
            <View style={styles.topBar}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../../assets/logo.png')} style={styles.logo} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate("ChatList")}>
                        <Entypo name="chat" size={36} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View>
                    <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                    <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>
                </View>

                {/* ✅ Combined Picker and Preview Area */}
                <View style={styles.imagePickerContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {/* Add Image Button */}
                        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
                            <FontAwesome name="plus" size={30} color="#001F54" />
                            <Text style={styles.pickImageText}>Upload Image</Text>
                        </TouchableOpacity>

                        {/* Display All Selected Images */}
                        {imageUris.map((uri, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri }} style={styles.imagePreview} />
                            </View>
                        ))}
                    </ScrollView>
                </View>



                {/* ✅ Item Details */}
                <View flexDirection="row">
                    <Ionicons name="document" size={25} color="#001F54" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> ITEM DETAILS</Text>
                </View>
                <View style={styles.SubContent}>
                    <TextInput
                        placeholder="📝 Item Title"
                        style={styles.input}
                        value={itemData.title}
                        onChangeText={(text) => setItemData({ ...itemData, title: text })}
                    />
                    <TextInput
                        placeholder="🧾 Short Description / Features"
                        style={styles.input}
                        value={itemData.description}
                        onChangeText={(text) => setItemData({ ...itemData, description: text })}
                    />
                    <TextInput
                        placeholder="📋 Full Description"
                        style={[styles.input, { height: 100 }]}
                        multiline
                        value={itemData.fullDescription}
                        onChangeText={(text) => setItemData({ ...itemData, fullDescription: text })}
                    />
                    <TextInput
                        placeholder="📦 What's Included"
                        style={[styles.input, { height: 80 }]}
                        multiline
                        value={itemData.included}
                        onChangeText={(text) => setItemData({ ...itemData, included: text })}
                    />
                </View>
                <View style={styles.categoryContainer}>
                    <View flexDirection="row">
                        <FontAwesome5 name="tags" size={25} color="#001F54" style={styles.TitleIcon} />
                        <Text style={styles.sectionTitle}> Select Category</Text>
                    </View>

                    <View style={styles.chipsContainer}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.chip,
                                    selectedCategory === cat.id && styles.chipSelected
                                ]}
                                onPress={() => setSelectedCategory(cat.id)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        selectedCategory === cat.id && styles.chipTextSelected
                                    ]}
                                >
                                    {cat.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>


                {/* ✅ Rental Price */}
                <View flexDirection="row">
                    <FontAwesome5 name="rupee-sign" size={25} color="#001F54" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> RENTAL PRICE</Text>
                </View>
                <View style={styles.SubContent}>
                    <TextInput
                        placeholder="Price Per Day (₹)"
                        style={styles.input}
                        keyboardType="numeric"
                        value={itemData.pricePerDay}
                        onChangeText={(text) => setItemData({ ...itemData, pricePerDay: text })}
                    />
                    <TextInput
                        placeholder="Price for 3 Days (₹)"
                        style={styles.input}
                        keyboardType="numeric"
                        value={itemData.price3Days}
                        onChangeText={(text) => setItemData({ ...itemData, price3Days: text })}
                    />
                    <TextInput
                        placeholder="Price per Week (₹)"
                        style={styles.input}
                        keyboardType="numeric"
                        value={itemData.priceWeek}
                        onChangeText={(text) => setItemData({ ...itemData, priceWeek: text })}
                    />
                    <Text style={styles.sectionTitle}>🔐 Security Deposit</Text>
                    <TextInput
                        placeholder="Security Deposit (₹)"
                        style={styles.input}
                        keyboardType="numeric"
                        value={itemData.securityDeposit}
                        onChangeText={(text) => setItemData({ ...itemData, securityDeposit: text })}
                    />
                </View>

                {/* ✅ Location */}
                <View flexDirection="row">
                    <Entypo name="location" size={25} color="#001F54" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> LOCATION</Text>
                </View>
                <View style={styles.SubContent}>
                    <TextInput
                        placeholder="Location"
                        style={styles.input}
                        value={itemData.location}
                        onChangeText={(text) => setItemData({ ...itemData, location: text })}
                    />
                </View>

                {/* ✅ Availability */}
                <View flexDirection="row">
                    <FontAwesome name="calendar" size={25} color="#001F54" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> AVAILABILITY STATUS</Text>
                </View>
                <View style={styles.SubContent}>
                    <View style={styles.checkboxGroup}>
                        <TouchableOpacity
                            style={styles.checkboxItem}
                            onPress={() => setAvailability(prev => ({ ...prev, request: !prev.request }))}
                        >
                            <Ionicons name={availability.request ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>Available on Request</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.checkboxItem}
                            onPress={() => setAvailability(prev => ({ ...prev, booking: !prev.booking }))}
                        >
                            <Ionicons name={availability.booking ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>Available for Booking</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.checkboxItem}
                            onPress={() => setAvailability(prev => ({ ...prev, notAvailable: !prev.notAvailable }))}
                        >
                            <Ionicons name={availability.notAvailable ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>Not Available</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ✅ Owner Details */}
                <View flexDirection="row">
                    <FontAwesome name="user" size={25} color="#001F54" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> OWNER DETAILS</Text>
                </View>
                <View style={styles.SubContent}>
                    <TextInput
                        placeholder="👤 Owner Name"
                        style={styles.input}
                        value={itemData.ownerName}
                        onChangeText={(text) => setItemData({ ...itemData, ownerName: text })}
                    />
                    <TextInput
                        placeholder="🏠 Owner Address"
                        style={styles.input}
                        value={itemData.ownerAddress}
                        onChangeText={(text) => setItemData({ ...itemData, ownerAddress: text })}
                    />
                    <TextInput
                        placeholder="📞 Contact Number"
                        style={styles.input}
                        keyboardType="phone-pad"
                        value={itemData.contactNumber}
                        onChangeText={(text) => setItemData({ ...itemData, contactNumber: text })}
                    />
                    <TextInput
                        placeholder="📧 Email Address"
                        style={styles.input}
                        keyboardType="email-address"
                        value={itemData.email}
                        onChangeText={(text) => setItemData({ ...itemData, email: text })}
                    />
                </View>

                {/* ✅ Terms and Conditions */}
                <View flexDirection="row">
                    <FontAwesome name="check-square-o" size={25} color="#001F54" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> TERMS AND CONDITIONS</Text>
                </View>
                <View style={styles.SubContent}>
                    <View style={styles.checkboxGroup}>
                        <TouchableOpacity
                            style={styles.checkboxItem}
                            onPress={() => setTerms(prev => ({ ...prev, idProof: !prev.idProof }))}
                        >
                            <Ionicons name={terms.idProof ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>ID Proof Required</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.checkboxItem}
                            onPress={() => setTerms(prev => ({ ...prev, handleWithCare: !prev.handleWithCare }))}
                        >
                            <Ionicons name={terms.handleWithCare ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>Strictly Handle with Care</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.checkboxItem}
                            onPress={() => setTerms(prev => ({ ...prev, lateCharges: !prev.lateCharges }))}
                        >
                            <Ionicons name={terms.lateCharges ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>Late Return Charges Applicable</Text>
                        </TouchableOpacity>
                    </View>

                    <TextInput
                        placeholder="Add any custom terms..."
                        style={[styles.input, { height: 100 }]}
                        multiline
                        value={itemData.customTerms}
                        onChangeText={(text) => setItemData({ ...itemData, customTerms: text })}
                    />
                </View>

                {/* ✅ Preview + Save Buttons */}
                <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 25 }}>
                    <TouchableOpacity
                        style={[styles.submitButton, { flex: 0.48, backgroundColor: '#ff9800' }]}
                        onPress={() => setPreviewVisible(true)}
                    >
                        <Ionicons name="eye" size={24} color="#fff" />
                        <Text style={styles.submitText}>PREVIEW</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.submitButton, { flex: 0.48 }]} onPress={handleSubmit}>
                        <Ionicons name="checkmark-done-circle" size={24} color="#fff" />
                        <Text style={styles.submitText}>SAVE & POST</Text>
                    </TouchableOpacity>
                </View>

                {/* ✅ Footer Buttons */}
                <View style={styles.footerButtons}>
                    <TouchableOpacity style={styles.secondaryBtn} onPress={handleReset}>
                        <Entypo name="cycle" size={18} color="#fff" />
                        <Text style={styles.secondaryBtnText}>RESET FORM</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={28} />
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("BrowseItems")}>
                    <MaterialIcons name="explore" size={28} />
                    <Text style={styles.navLabel}>Explore</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("AddItem")}>
                    <Entypo name="plus" size={28} color={route.name === "AddItem" ? activeColor : inactiveColor} />
                    <Text style={[styles.navLabel, { color: route.name === "AddItem" ? activeColor : inactiveColor }]}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("History")}>
                    <Ionicons name="document-text" size={28} />
                    <Text style={styles.navLabel}>History</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
                    <Ionicons name="person" size={28} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>

            {/* ✅ Preview Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={previewVisible}
                onRequestClose={() => setPreviewVisible(false)}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 15,
                        width: '85%',
                        padding: 20,
                        alignItems: 'center',
                    }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 10 }}>
                            {/* If images are picked */}
                            {imageUris.length > 0 ? (
                                imageUris.map((uri, index) => (
                                    <Image
                                        key={index}
                                        source={{ uri }}
                                        style={{
                                            width: 180,
                                            height: 180,
                                            borderRadius: 10,
                                            marginRight: 10,
                                        }}
                                    />
                                ))
                            ) : (
                                // Fallback placeholder
                                <Image
                                    source={require('../../assets/placeholder.jpg')}
                                    style={{
                                        width: 180,
                                        height: 180,
                                        borderRadius: 10,
                                        marginRight: 10,
                                    }}
                                />
                            )}
                        </ScrollView>

                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#001F54' }}>{itemData.title || "No Title"}</Text>
                        <Text style={{ fontSize: 14, color: '#333', marginVertical: 5 }}>{itemData.description || "No Description"}</Text>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#001F54', marginVertical: 5 }}>₹ {itemData.pricePerDay || "0"} / day</Text>
                        <Text style={{ fontSize: 14, color: '#666', marginVertical: 2 }}>📍 {itemData.location || "No Location"}</Text>
                        <Text style={{ fontSize: 14, color: '#666', marginVertical: 2 }}>👤 {itemData.ownerName || "No Owner"}</Text>

                        <View style={{ flexDirection: 'row', marginTop: 15 }}>
                            <TouchableOpacity
                                style={[styles.secondaryBtn, { backgroundColor: '#aaa', marginRight: 10 }]}
                                onPress={() => setPreviewVisible(false)}
                            >
                                <Entypo name="cross" size={18} color="#fff" />
                                <Text style={styles.secondaryBtnText}>CLOSE</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.submitButton, { backgroundColor: '#001F54' }]}
                                onPress={() => {
                                    setPreviewVisible(false);
                                    handleSubmit();
                                }}
                            >
                                <Ionicons name="checkmark-done-circle" size={18} color="#fff" />
                                <Text style={styles.submitText}>CONFIRM POST</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <Loader visible={loading} />
            <RentEasyModal
                visible={modalVisible}
                title={modalContent.title}
                message={modalContent.message}
                onClose={() => setModalVisible(false)}
                onConfirm={modalContent.onConfirm}
            />

        </View >
    );
};

export default AddItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F0FA',
        paddingTop: 30,
        ...Platform.select({
            ios: {
                flex: 1,
                marginTop: 10
            }
        })
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 1,
    },
    logo: {
        width: 70,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 35, // half of width/height
    },

    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 6,
        color: '#1E1E1E',
        textShadowColor: 'rgba(0, 0, 0, 0.25)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 4,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        color: '#3a3a3a',
        fontStyle: 'italic',
        fontWeight: '500',
        letterSpacing: 0.5,
        opacity: 0.9,
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 120,
    },
    input: {
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 10,
        marginTop: 12,
        fontSize: 15,
        borderColor: '#ccc',
        borderWidth: 1,
    },
    sectionTitle: {
        marginTop: 25,
        fontSize: 17,
        fontWeight: 'bold',
        color: '#1E1E1E'
    },
    fieldLabel: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#1E1E1E',
        marginBottom: 4,
        marginLeft: 5
    },

    imagePickerContainer: {
        marginVertical: 10,
        padding: 5,
        backgroundColor: '#f2f2f2',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#ccc',
        height: 170
    },

    uploadButton: {
        width: 100,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6e6e6',
        borderRadius: 10,
        marginRight: 10,
    },

    pickImageText: {
        marginTop: 5,
        fontSize: 12,
        color: '#001F54',
        fontWeight: '600',
    },

    imageWrapper: {
        marginRight: 10,
        position: 'relative',
    },

    imagePreview: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    TitleIcon: {
        flexDirection: 'row',
        margin: 2,
        marginTop: 20,
        marginRight: 1,
    },
    SubContent: {
        marginLeft: 20,
    },
    checkboxGroup: {
        marginTop: 10,
    },
    checkboxItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6,
    },
    checkboxLabel: {
        marginLeft: 10,
        fontSize: 15,
        color: '#1E1E1E',
        fontWeight: '500',
    },

    submitButton: {
        flexDirection: 'row',
        backgroundColor: '#001F54',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    submitText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    footerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 2,
        alignSelf: 'center',
    },
    secondaryBtn: {
        flexDirection: 'row',
        backgroundColor: '#ff0000ff',
        borderRadius: 10,
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 25,
    },
    secondaryBtnText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        ...Platform.select({
            ios: {
                padding: 2
            },
            android: {
                padding: 5.5
            }
        })
    },
    categoryContainer: {
        marginVertical: 10,
    },
    chipsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 6,
    },
    chip: {
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    chipSelected: {
        backgroundColor: "#001F54",
        borderColor: "#001F54",
    },
    chipText: {
        fontSize: 14,
        color: "#333",
    },
    chipTextSelected: {
        color: "#fff",
        fontWeight: "bold",
    },

    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#eee',
        paddingVertical: 12,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 65,
        marginBottom: 7,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        zIndex: 1,
        paddingHorizontal: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 2,
        borderTopColor: '#ccc',
        marginTop: 10,
        borderRadius: 10,
    },
    navItem: {
        alignItems: 'center',
        marginTop: 5
    },

    navLabel: {
        fontSize: 12,
        color: 'black',
        fontWeight: '400',
        marginTop: 4,
        marginBottom: 10,
    },
});