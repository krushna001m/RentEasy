import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Platform
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

const AddItem = ({ navigation }) => {
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

    const [imageUri, setImageUri] = useState(null);

    const pickImage = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Permission to access camera roll is required!');
            return;
        }
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.topBar}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                        <Image source={require('../../assets/logo.png')} style={styles.logo} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("Chat")}>
                        <Entypo name="chat" size={36} />
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

                <View>
                    <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                    <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>
                </View>

                {/* Image Preview */}
                {imageUri && (
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                    </View>
                )}

                <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                    {!imageUri && (
                        <>
                            <FontAwesome name="image" size={50} color="#999" />
                            <Text style={styles.pickImageText}>UPLOAD ITEM IMAGE</Text>
                        </>
                    )}
                </TouchableOpacity>
                <View flexDirection="row">
                    <Ionicons name="document" size={25} color="#007bff" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> ITEM DETAILS</Text>
                </View>
                <View style={styles.SubContent}>
                    <TextInput placeholder="📝 Item Title" style={styles.input} />
                    <TextInput placeholder="🧾 Short Description / Features" style={styles.input} />
                    <TextInput placeholder="📋 Full Description" style={[styles.input, { height: 100 }]} multiline />
                    <TextInput placeholder="📦 What's Included (Checklist or Multiline)" style={[styles.input, { height: 80 }]} multiline />
                </View>
                <View flexDirection="row">
                    <FontAwesome5 name="rupee-sign" size={25} color="#007bff" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> RENTAL PRICE</Text>
                </View>
                <View style={styles.SubContent}>
                    <TextInput placeholder="Price Per Day (₹)" style={styles.input} keyboardType="numeric" />
                    <TextInput placeholder="Price for 3 Days (₹)" style={styles.input} keyboardType="numeric" />
                    <TextInput placeholder="Price per Week (₹)" style={styles.input} keyboardType="numeric" />
                    <Text style={styles.sectionTitle}>🔐 Security Deposit</Text>
                    <TextInput placeholder="🔐 Security Deposit (₹)" style={styles.input} keyboardType="numeric" />
                </View>

                <View flexDirection="row">
                    <Entypo name="location" size={25} color="#007bff" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> LOCATION</Text>
                </View>
                <View style={styles.SubContent}>
                    <TextInput placeholder="Location" style={styles.input} />
                </View>
                <View flexDirection="row">
                    <FontAwesome name="calendar" size={25} color="#007bff" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> AVAILABILITY STATUS</Text>
                </View>
                <View style={styles.SubContent}>
                    <View style={styles.checkboxGroup}>
                        <TouchableOpacity style={styles.checkboxItem} onPress={() =>
                            setAvailability(prev => ({ ...prev, request: !prev.request }))
                        }>
                            <Ionicons name={availability.request ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>Available on Request</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.checkboxItem} onPress={() =>
                            setAvailability(prev => ({ ...prev, booking: !prev.booking }))
                        }>
                            <Ionicons name={availability.booking ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>Available for Booking</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.checkboxItem} onPress={() =>
                            setAvailability(prev => ({ ...prev, notAvailable: !prev.notAvailable }))
                        }>
                            <Ionicons name={availability.notAvailable ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>Not Available</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View flexDirection="row">
                    <FontAwesome name="user" size={25} color="#007bff" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> OWNER DETAILS</Text>
                </View>
                <View style={styles.SubContent}>
                    <Text style={styles.fieldLabel}>👤 Owner Name</Text>
                    <TextInput placeholder="Enter Owner's Name" style={styles.input} />

                    <Text style={styles.fieldLabel}>🏠 Owner Address</Text>
                    <TextInput placeholder="Enter Full Address" style={styles.input} />

                    <Text style={styles.fieldLabel}>📞 Contact Number</Text>
                    <TextInput placeholder="Enter Contact Number" style={styles.input} keyboardType="phone-pad" />

                    <Text style={styles.fieldLabel}>📧 Email Address</Text>
                    <TextInput placeholder="Enter Email Address" style={styles.input} keyboardType="email-address" />
                </View>
                <View flexDirection="row">
                    <FontAwesome name="check-square-o" size={25} color="#007bff" style={styles.TitleIcon} />
                    <Text style={styles.sectionTitle}> TERMS AND CONDITIONS</Text>
                </View>
                <View style={styles.SubContent}>
                    <View style={styles.checkboxGroup}>
                        <TouchableOpacity style={styles.checkboxItem} onPress={() => setTerms(prev => ({ ...prev, idProof: !prev.idProof }))}>
                            <Ionicons name={terms.idProof ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>ID Proof Required</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.checkboxItem} onPress={() => setTerms(prev => ({ ...prev, handleWithCare: !prev.handleWithCare }))}>
                            <Ionicons name={terms.handleWithCare ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>Strictly Handle with Care</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.checkboxItem} onPress={() => setTerms(prev => ({ ...prev, lateCharges: !prev.lateCharges }))}>
                            <Ionicons name={terms.lateCharges ? "checkbox" : "square-outline"} size={22} color="#001F54" />
                            <Text style={styles.checkboxLabel}>Late Return Charges Applicable</Text>
                        </TouchableOpacity>
                    </View>


                    <TextInput
                        placeholder="Add any custom terms..."
                        style={[styles.input, { height: 100 }]}
                        multiline
                    />
                </View>

                <TouchableOpacity style={styles.submitButton}>
                    <Ionicons name="checkmark-done-circle" size={24} color="#fff" />
                    <Text style={styles.submitText}>SAVE & POST</Text>
                </TouchableOpacity>

                <View style={styles.footerButtons}>
                    <TouchableOpacity style={styles.secondaryBtn}>
                        <Entypo name="cycle" size={18} color="#001F54" />
                        <Text style={styles.secondaryBtnText}>RESET FORM</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryBtn}>
                        <Ionicons name="save" size={18} color="#001F54" />
                        <Text style={styles.secondaryBtnText}>SAVE AS DRAFT</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryBtn}>
                        <Ionicons name="eye" size={18} color="#001F54" />
                        <Text style={styles.secondaryBtnText}>PREVIEW</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            {/*  Fixed Bottom Navigation */}
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
                    <Entypo name="plus" size={28} />
                    <Text style={styles.navLabel}>Add</Text>
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
        </View>
    );
};

export default AddItem;

const styles = StyleSheet.create({
container: {
            flex: 1,
            backgroundColor: '#E6F0FA',
            paddingTop: 30,
            ...Platform.select({
                ios:{
                    flex:1,
                    marginTop:10
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
        width: 60,
        height: 70,
        resizeMode: 'contain',
         borderRadius:16,
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

    imagePicker: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: 250,
        marginBottom: 20
    },
    pickImageText: {
        marginTop: 10,
        color: '#333',
        fontSize: 15,
        fontWeight: 'bold',
    },
    previewContainer: {
        paddingHorizontal: 16,
        marginTop: 20,
    },
    imagePreview: {
        width: '100%',
        height: 500,
        borderRadius: 12,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: '#ccc',
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
        marginTop: 20,
    },
    secondaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#001F54',
        flex: 1,
        marginHorizontal: 4,
        marginBottom: 40
    },
    secondaryBtnText: {
        marginLeft: 6,
        color: '#001F54',
        fontWeight: 'bold',
        fontSize: 13,
        ...Platform.select({
            ios: {
                padding: 2
            },
            android: {
                padding: 5.5
            }
        })
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