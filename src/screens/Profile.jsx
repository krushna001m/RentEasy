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
    useColorScheme
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';

const Profile = ({ navigation }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const [profile, setProfile] = useState({
        name: 'Krushna Mengal',
        email: 'krushnamengal46@gmail.com',
        phone: '+91 9699050043',
        image: null,
        listings: ['Camera - ₹500/day', 'Tent - ₹300/day'],
        rentals: ['Bike - ₹200/day']
    });

    const [editMode, setEditMode] = useState(false);
    const [tempProfile, setTempProfile] = useState({ ...profile });

    const handleChange = (key, value) => {
        setTempProfile({ ...tempProfile, [key]: value });
    };

    const saveProfile = () => {
        setProfile({ ...tempProfile });
        setEditMode(false);
    };

    const pickImage = () => {
        launchImageLibrary(
            { mediaType: 'photo', maxWidth: 300, maxHeight: 300, quality: 1 },
            response => {
                if (!response.didCancel && !response.errorCode) {
                    const uri = response.assets[0].uri;
                    handleChange('image', uri);
                }
            }
        );
    };

    const themeStyles = isDark ? darkStyles : lightStyles;

    return (
        <View style={[styles.container, themeStyles.container]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Entypo name="chat" size={36} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={[styles.title, themeStyles.text]}>WELCOME TO RENTEASY</Text>
            <Text style={[styles.subtitle, themeStyles.text]}>RENT IT, USE IT, RETURN IT!</Text>
            <View>
            <TouchableOpacity style={styles.chatLabel}>
                <Text style={styles.chatText}>PROFILE</Text>
                <FontAwesome name="user-circle" size={18} color="#fff" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate("Settings")}>
                <Ionicons name="settings" size={33} color="#001F54" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            </View>

            {/* Profile Image */}
            <TouchableOpacity onPress={pickImage}>
                <Image
                    source={tempProfile.image ? { uri: tempProfile.image } : require('../../assets/user-icon.png')}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateBtn} onPress={pickImage}>
                <Text style={styles.updateText}>UPDATE PROFILE PICTURE</Text>
            </TouchableOpacity>

            {/* Form */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.inputGroup}>
                    <FontAwesome name="user" size={25} color="#001F54" style={styles.icon} />
                    <TextInput
                        style={[styles.inputField, themeStyles.inputField]}
                        editable={editMode}
                        value={tempProfile.name}
                        onChangeText={text => handleChange('name', text)}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <MaterialIcons name="email" size={25} color="#001F54" style={styles.icon} />
                    <TextInput
                        style={[styles.inputField, themeStyles.inputField]}
                        editable={editMode}
                        value={tempProfile.email}
                        onChangeText={text => handleChange('email', text)}
                    />
                </View>
                <View style={styles.inputGroup}>
                    <FontAwesome name="phone" size={25} color="#001F54" style={styles.icon} />
                    <TextInput
                        style={[styles.inputField, themeStyles.inputField]}
                        editable={editMode}
                        value={tempProfile.phone}
                        onChangeText={text => handleChange('phone', text)}
                    />
                </View>

                <Text style={[styles.sectionText, themeStyles.text]}>📦 MY LISTINGS (IF OWNER)</Text>
                {profile.listings.map((item, idx) => (
                    <Text key={idx} style={[styles.listText, themeStyles.text]}>• {item}</Text>
                ))}

                <Text style={[styles.sectionText, themeStyles.text]}>📑 MY RENTALS (IF BORROWER)</Text>
                {profile.rentals.map((item, idx) => (
                    <Text key={idx} style={[styles.listText, themeStyles.text]}>• {item}</Text>
                ))}
            </ScrollView>

            {/* Buttons */}
            <TouchableOpacity style={styles.editButton} onPress={() => setEditMode(!editMode)}>
                <Text style={styles.btnText}>EDIT PROFILE</Text>
                <FontAwesome name="edit" size={18} color="#fff" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
                <Text style={styles.btnText}>SAVE CHANGES</Text>
                <Entypo name="save" size={18} color="#fff" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            {/* Bottom Navigation */}
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
    chatLabel: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#001F54',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
        alignSelf: 'center',
        marginBottom: 12,
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
        marginRight:10
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
    updateBtn: {
        alignSelf: 'center',
        marginBottom: 10,
        backgroundColor: '#001F54',
        height:40,
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
            ios:{
                height:30,
                paddingVertical: 0,
            },
            android:{
                height: 40,
                paddingVertical: 0,

            }
        })
    },
    sectionText: {
        marginTop: 16,
        marginBottom: 4,
        fontWeight: 'bold',
        fontSize: 17,
    },
    listText: {
        fontSize: 15,
        marginLeft: 10,
        marginBottom: 2,
    },
    editButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#001F54',
        padding: 12,
        borderRadius: 25,
        marginTop: 10,
        marginHorizontal: 16,
    },
    saveButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2E8B57',
        padding: 12,
        borderRadius: 25,
        marginTop: 10,
        marginHorizontal: 16,
        marginBottom: 80,
    },
    btnText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
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
