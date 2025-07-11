// ✅ UserProfileScreen.js - Final with listings rendering, image picker, state update, dark mode
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
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+91 9876543210',
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
        const options = {
            mediaType: 'photo',
            maxWidth: 300,
            maxHeight: 300,
            quality: 1,
        };

        launchImageLibrary(options, response => {
            if (!response.didCancel && !response.errorCode) {
                const uri = response.assets[0].uri;
                handleChange('image', uri);
            }
        });
    };

    const themeStyles = isDark ? darkStyles : lightStyles;

    return (
        <View style={[styles.container, themeStyles.container]}>
            {/* Header */}
            <View style={styles.header}> 
                <TouchableOpacity onPress={() => navigation.goBack()}> 
                    <Ionicons name="arrow-back-circle" size={36} color={isDark ? '#fff' : '#000'} /> 
                </TouchableOpacity>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                <TouchableOpacity onPress={() => navigation.navigate('Chat')}> 
                    <Entypo name="chat" size={30} color={isDark ? '#fff' : '#000'} /> 
                </TouchableOpacity>
            </View>

            {/* Title */}
            <Text style={[styles.title, themeStyles.text]}>WELCOME TO RENTEASY</Text>
            <Text style={[styles.subtitle, themeStyles.text]}>RENT IT, USE IT, RETURN IT!</Text>
            <TouchableOpacity style={styles.chatLabel}> 
                <Text style={styles.chatText}>PROFILE</Text>
                <FontAwesome name="user-circle" size={18} color="#fff" style={{ marginLeft: 4 }} />
            </TouchableOpacity>

            <TouchableOpacity onPress={pickImage}> 
                <Image
                    source={tempProfile.image ? { uri: tempProfile.image } : require('../../assets/user-icon.png')}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateBtn} onPress={pickImage}> 
                <Text style={styles.updateText}>UPDATE PROFILE PICTURE</Text>
            </TouchableOpacity>

            {/* Form Fields */}
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.inputGroup}> 
                    <FontAwesome name="user" size={20} color="maroon" style={styles.icon} />
                    <TextInput
                        style={[styles.inputField, themeStyles.inputField]}
                        editable={editMode}
                        value={tempProfile.name}
                        onChangeText={text => handleChange('name', text)}
                    />
                </View>
                <View style={styles.inputGroup}> 
                    <MaterialIcons name="email" size={20} color="maroon" style={styles.icon} />
                    <TextInput
                        style={[styles.inputField, themeStyles.inputField]}
                        editable={editMode}
                        value={tempProfile.email}
                        onChangeText={text => handleChange('email', text)}
                    />
                </View>
                <View style={styles.inputGroup}> 
                    <FontAwesome name="phone" size={20} color="maroon" style={styles.icon} />
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

            {/* Bottom Nav */}
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
