import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Switch,
    Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Settings = ({ navigation }) => {
    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Entypo name="chat" size={36} />
                </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Title */}
                <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>

                <TouchableOpacity style={styles.settingsBtn}>
                    <Text style={styles.settingsText}>SETTINGS</Text>
                    <Ionicons name="settings-sharp" size={18} color="#fff" style={{ marginLeft: 6 }} />
                </TouchableOpacity>



                {/* Profile Section */}
                <Section title="👤 Edit Profile" onPress={() => navigation.navigate('Profile')} />

                {/* Preferences */}
                <Section title="🌐 Preferences" />
                <ToggleRow label="Dark Mode" value={darkMode} onValueChange={() => setDarkMode(!darkMode)} icon="moon" />
                <ToggleRow label="Notification" value={notifications} onValueChange={() => setNotifications(!notifications)} icon="bell" />
                <TouchableOpacity style={styles.languageRow}>
                    <Section title="🌐 Language" />
                    <Entypo name="chevron-down" size={18} style={{alignSelf:'right',marginTop:27,marginLeft:180}}/>
                </TouchableOpacity>

                {/* Security */}
                <Section title="🔐 Security" />
                <Text style={styles.rowLabel}>🔒 Change Password</Text>
                <Text style={styles.subLabel}>↳ Current Password</Text>
                <Text style={styles.subLabel}>↳ New Password</Text>
                <Text style={styles.subLabel}>↳ Confirm Password</Text>
                <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
                    <Text style={styles.rowLabel}>🧠 Forgot Password</Text>
                </TouchableOpacity>

                {/* Payments */}
                <Section title="💳 Payment & Payouts" />
                <Text style={styles.rowLabel}>💳 Saved Cards</Text>
                <Text style={styles.rowLabel}>🏦 Add Bank Account (for Owners)</Text>
                <Text style={styles.rowLabel}>💰 Transaction History</Text>
                <Text style={styles.rowLabel}>📁 UPI ID Management</Text>

                {/* Support */}
                <Section title="❓ Help & Support" />
                <Text style={styles.rowLabel}>📘 FAQs</Text>
                <Text style={styles.rowLabel}>📞 Contact Support</Text>
                <Text style={styles.rowLabel}>📬 Submit a Complaint or Suggestion</Text>

                {/* Account */}
                <Section title="📑 Account" />
                <Text style={styles.rowLabel}>❌ Deactivate Account</Text>
                <Text style={styles.rowLabel}>🧹 Clear App Cache</Text>
                <Text style={styles.rowLabel}>⏻ Logout</Text>
            </ScrollView>

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

                <TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Profile")}>
                    <Ionicons name="person" size={28} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Settings;

// Reusable Components

const Section = ({ title, onPress }) => (
    <TouchableOpacity style={styles.section} onPress={onPress}>
        <Text style={styles.sectionText}>{title}</Text>
    </TouchableOpacity>
);

const ToggleRow = ({ label, value, onValueChange, icon }) => (
    <View style={styles.toggleRow}>
        <Text style={styles.rowIcon}>{icon === "moon" ? "🌙" : "🔔"}</Text>
        <Text style={styles.rowLabel}>{label}</Text>
        <Switch value={value} onValueChange={onValueChange} />
    </View>
);

const NavItem = ({ icon, label, onPress, material }) => {
    const Icon = material ? MaterialIcons : Ionicons;
    return (
        <TouchableOpacity style={styles.navItem} onPress={onPress}>
            <Icon name={icon} size={28} />
            <Text style={styles.navLabel}>{label}</Text>
        </TouchableOpacity>
    );
};

// Styles

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
        width: 60,
        height: 70,
        resizeMode: 'contain',
        borderRadius: 16,
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
    settingsBtn: {
        flexDirection: 'row',
        backgroundColor: '#001F54',
        paddingVertical: 6,
        paddingHorizontal: 14,
        alignSelf: 'center',
        borderRadius: 14,
        alignItems: 'center',
        marginBottom: 20,
        marginTop: 10,
    },
    settingsText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 17,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    section: {
        backgroundColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginVertical: 10,
        height: 66,
        justifyContent: 'center',
    },
    sectionText: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginVertical: 10,
    },
    rowLabel: {
        fontSize: 17,
        color: '#222',
        marginVertical: 4,
        marginLeft: 20,
    },
    subLabel: {
        fontSize: 15,
        color: '#444',
        marginLeft: 20,
        marginBottom: 3,
        marginLeft: 50
    },
    languageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ccc',
        paddingVertical: 0,
        paddingHorizontal: 0,
        borderRadius: 10,
        marginVertical: 10,
        height: 66
    },
    rowIcon: {
        fontSize: 16,
        marginRight: 10,
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
