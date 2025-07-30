import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image,
    Platform, useColorScheme,
    Alert
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native'; // ✅ Auto-refresh when navigating back

import Loader from '../components/Loader';

const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

const Profile = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const isFocused = useIsFocused(); // ✅ Re-fetch when screen focused
    const [loading, setLoading] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        image: null,
        listings: [],
        rentals: [],
        roles: []
    });

    const [editMode, setEditMode] = useState(false);
    const [tempProfile, setTempProfile] = useState({ ...profile });

    const handleChange = (key, value) => {
        setTempProfile({ ...tempProfile, [key]: value });
    };

    // ✅ Fetch User Listings (Owner Role)
    const fetchUserListings = async (username) => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/items.json`);
            const items = response.data || {};

            return Object.entries(items)
                .filter(([key, item]) => item.owner === username)
                .map(([key, item]) => ({
                    id: key,
                    title: item.title,
                    price: item.pricePerDay || item.price || "N/A",
                    image: item.image,
                    status: item.availability?.notAvailable ? "Not Available" : "Available",
                }));
        } catch (error) {
            console.error("Error fetching listings:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };


    // ✅ Fetch User Rentals (Borrower Role)
    const fetchUserRentals = async (username) => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/history/${username}.json`);
            const history = response.data || {};
            return Object.entries(history).map(([key, rental]) => ({
                id: key,
                itemName: rental.title || "Unknown",
                price: rental.pricePerDay || rental.price || "N/A",
                status: rental.status || "Completed",
                date: rental.date ? new Date(rental.date).toLocaleDateString() : "N/A",
            }));
        } catch (error) {
            console.error("Error fetching rentals:", error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const loggedInUserData = await AsyncStorage.getItem("loggedInUser");
            if (!loggedInUserData) return;

            const currentUser = JSON.parse(loggedInUserData);

            const userListings = await fetchUserListings(currentUser.username);
            const userRentals = await fetchUserRentals(currentUser.username);

            // ✅ Dynamically determine roles
            const roles = [];
            if (userListings.length > 0) roles.push("Owner");
            if (userRentals.length > 0) roles.push("Borrower");

            const updatedProfile = {
                name: currentUser.username,
                email: currentUser.email || "",
                phone: currentUser.phone || "",
                image: currentUser.image || null,
                listings: userListings,
                rentals: userRentals,
                roles: roles,
            };

            setProfile(updatedProfile);
            setTempProfile(updatedProfile);
        } catch (error) {
            console.error("Profile Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFocused) {
            fetchUserProfile(); // ✅ Refresh profile when screen is focused
        }
    }, [isFocused]);

    // ✅ Save Updated Profile
    const saveProfile = async () => {
        try {
            setLoading(true);
            const loggedInUserData = await AsyncStorage.getItem("loggedInUser");
            if (!loggedInUserData) return;

            const currentUser = JSON.parse(loggedInUserData);

            setProfile({ ...profile, ...tempProfile });
            setEditMode(false);

            const response = await axios.get(`${URL}/users.json`);
            const users = response.data || {};
            const userKey = Object.keys(users).find(
                (key) => users[key].username === currentUser.username
            );

            if (userKey) {
                await axios.patch(`${URL}/users/${userKey}.json`, {
                    username: tempProfile.name,
                    email: tempProfile.email,
                    phone: tempProfile.phone,
                    image: tempProfile.image,
                });

                const updatedUser = { ...currentUser, ...tempProfile };
                await AsyncStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
                Alert.alert('✅ Profile Updated', "Profile Updated Successfully!");
            }
        } catch (error) {
            Alert.alert("Profile Update Error:", error);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Pick Profile Image & Update Firebase
    const pickImage = () => {
        launchImageLibrary(
            { mediaType: 'photo', maxWidth: 300, maxHeight: 300, quality: 1 },
            async (response) => {
                if (!response.didCancel && !response.errorCode) {
                    const uri = response.assets[0].uri;
                    handleChange("image", uri);

                    try {
                        const loggedInUserData = await AsyncStorage.getItem("loggedInUser");
                        const currentUser = JSON.parse(loggedInUserData);

                        const res = await axios.get(`${URL}/users.json`);
                        const users = res.data || {};
                        const userKey = Object.keys(users).find(
                            (key) => users[key].username === currentUser.username
                        );
                        if (userKey) {
                            await axios.patch(`${URL}/users/${userKey}.json`, { image: uri });

                            const updatedUser = { ...currentUser, image: uri };
                            await AsyncStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

                            // ✅ Instant update after selecting image
                            setProfile((prev) => ({ ...prev, image: uri }));
                            setTempProfile((prev) => ({ ...prev, image: uri }));
                        }
                    } catch (error) {
                        console.error("Image Update Error:", error);
                    }
                }
            }
        );
    };

    const themeStyles = isDark ? darkStyles : lightStyles;

    return (
        <View style={[styles.container, themeStyles.container]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require("../../assets/logo.png")} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Entypo name="chat" size={36} color={isDark ? "#fff" : "#000"} />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Title */}
                <Text style={[styles.title, themeStyles.text]}>WELCOME TO RENTEASY</Text>
                <Text style={[styles.subtitle, themeStyles.text]}>RENT IT, USE IT, RETURN IT!</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 1 }}>
                    <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate("Settings")}>
                        <Ionicons name="settings-sharp" size={27} color="#001F54" style={{ marginLeft: 300 }} />
                    </TouchableOpacity>
                </View>


                {/* Profile Image */}
                <TouchableOpacity onPress={pickImage}>
                    <Image
                        source={tempProfile.image ? { uri: tempProfile.image } : require("../../assets/user-icon.png")}
                        style={styles.profileImage}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.updateBtn} onPress={pickImage}>
                    <Text style={styles.updateText}>UPDATE PROFILE PICTURE</Text>
                </TouchableOpacity>

                {/* Editable Profile Fields */}

                <View style={styles.inputGroup}>
                    <FontAwesome name="user" size={25} color="#001F54" style={styles.icon} />
                    <TextInput
                        style={[styles.inputField, themeStyles.inputField]}
                        editable={editMode}
                        value={tempProfile.name}
                        onChangeText={(text) => handleChange("name", text)}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <MaterialIcons name="email" size={25} color="#001F54" style={styles.icon} />
                    <TextInput
                        style={[styles.inputField, themeStyles.inputField]}
                        editable={editMode}
                        value={tempProfile.email}
                        onChangeText={(text) => handleChange("email", text)}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <FontAwesome name="phone" size={25} color="#001F54" style={styles.icon} />
                    <TextInput
                        style={[styles.inputField, themeStyles.inputField]}
                        editable={editMode}
                        value={tempProfile.phone}
                        onChangeText={(text) => handleChange("phone", text)}
                    />
                </View>

                {/* ✅ Dynamic Listings in Card */}
                {profile.roles.includes("Owner") && (
                    <View style={styles.card}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                            <Entypo
                                name="shop"
                                size={23}
                                color={themeStyles.text.color || "#000"}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[styles.sectionText, themeStyles.text]}>MY LISTINGS</Text>
                        </View>

                        {profile.listings.length > 0 ? (
                            profile.listings.map((item, idx) => (
                                <View key={idx} style={styles.cardItem}>
                                    <Text style={[styles.listText, themeStyles.text]}>
                                        • {item.title} - {item.price} ({item.status})
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={[styles.listText, themeStyles.text]}>• No listings yet</Text>
                        )}
                    </View>
                )}

                {/* ✅ Dynamic Rentals in Card */}
                {profile.roles.includes("Borrower") && (
                    <View style={styles.card}>
                        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
                            <Entypo
                                name="shopping-cart"
                                size={23}
                                color={themeStyles.text.color || "#000"}
                                style={{ marginRight: 6 }}
                            />
                            <Text style={[styles.sectionText, themeStyles.text]}>MY RENTALS</Text>
                        </View>

                        {profile.rentals.length > 0 ? (
                            profile.rentals.map((item, idx) => (
                                <View key={idx} style={styles.cardItem}>
                                    <Text style={[styles.listText, themeStyles.text]}>
                                        • {item.itemName} - {item.price} ({item.status})
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={[styles.listText, themeStyles.text]}>• No rentals yet</Text>
                        )}
                    </View>
                )}


            </ScrollView>

            {/* Edit / Save Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.editButton, { flex: 1, marginRight: 5 }]}
                    onPress={() => setEditMode(!editMode)}
                >
                    <Text style={styles.btnText}>EDIT PROFILE</Text>
                    <FontAwesome name="edit" size={18} color="#fff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.saveButton, { flex: 1, marginLeft: 5 }]}
                    onPress={saveProfile}
                >
                    <Text style={styles.btnText}>SAVE CHANGES</Text>
                    <Entypo name="save" size={18} color="#fff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>
            </View>

            {/* Bottom Nav (Unchanged) */}
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
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="person" size={28} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
            <Loader visible={loading} />
        </View>
    );
};

export default Profile;


const lightStyles = StyleSheet.create({
    container: {
        backgroundColor: '#E6F0FA',
    },
    text: {
        color: '#111'
    },
    inputField: {
        color: '#000'
    }
});

const darkStyles = StyleSheet.create({
    container: {
        backgroundColor: '#121212',
    },
    text: {
        color: '#fff'
    },
    inputField: {
        color: '#fff'
    }
});

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
        borderRadius: 35,
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
    chatLabel: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#001F54',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignSelf: 'center',
        marginBottom: 20,
    },
    chatText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },
    settingsButton: {
        position: 'absolute',
        right: 16,
        top: 0,
        padding: 1,
        borderRadius: 20,
        shadowColor: '#000',
        marginRight: 10
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignSelf: 'center',
        marginVertical: 10,
        borderWidth: 2,
        borderColor: '#001F54',
    },
    settingsBtn: {
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 14,
        alignSelf: 'center',
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 5,
        marginLeft: 10,
    },
    settingsText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
    },
    updateBtn: {
        alignSelf: 'center',
        marginBottom: 10,
        backgroundColor: '#001F54',
        height: 30,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
    },
    updateText: {
        color: '#ffffffff',
        fontSize: 15,
        fontWeight: '600',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f2f2f2',
        borderRadius: 10,
        marginBottom: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderColor: '#ccc',
        borderWidth: 0.5,
    },
    icon: {
        marginRight: 8,
    },
    inputField: {
        flex: 1,
        fontSize: 16,
        ...Platform.select({
            ios: {
                height: 30,
                paddingVertical: 0,
            },
            android: {
                height: 40,
                paddingVertical: 0,
            }
        })
    },
    sectionText: {
        marginTop: 7,
        marginBottom: 8,
        fontWeight: 'bold',
        fontSize: 17,
        marginLeft: 5,
    },
    listText: {
        fontSize: 15,
        marginLeft: 10,
        marginBottom: 2,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 15,
        marginBottom: 80,
        margin: 15
    },
    editButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#ff9800",
        padding: 10,
        borderRadius: 8,
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#001F54",
        padding: 10,
        borderRadius: 8,
    },
    btnText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },

    card: {
        backgroundColor: "#fff", // or themeStyles.background
        padding: 15,
        marginVertical: 10,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4, // Android shadow
        borderWidth: 0.5,
        borderColor: "#ccc",
    },
    cardItem: {
        backgroundColor: "#f8f8f8",
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
    },

    listText: {
        fontSize: 15,
        color: "#555",
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