import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Switch,
    Alert,
    Modal,
    Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import RentEasyModal from '../components/RentEasyModal';

const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

const Settings = ({ navigation }) => {

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

    const [darkMode, setDarkMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [helpModalVisible, setHelpModalVisible] = useState(false);

    // ✅ Logout Functionality
    const handleLogout = async () => {
        showModal("Logout", "Are you sure you want to logout?", async () => {
            await AsyncStorage.removeItem("username");
            navigation.replace("Login");
        });
    };


    // ✅ Deactivate Account
    const handleDeactivateAccount = async () => {
        showModal("Deactivate Account", "This will permanently delete your account. Continue?", async () => {
            try {
                const username = await AsyncStorage.getItem("username");
                if (!username) {
                    showModal("Error", "No account found.");
                    return;
                }
                await axios.delete(`${URL}/users/${username}.json`);
                await AsyncStorage.removeItem("username");
                showModal("Account Deleted", "Your account has been deactivated.");
                navigation.replace("Login");
            } catch (err) {
                console.error("Error deleting account:", err);
                showModal("Error", "Could not deactivate account.");
            }
        });
    };

    //Clear cache
    const handleClearCache = async () => {
        showModal("Clear Cache", "Are you sure you want to clear app cache?", async () => {
            await AsyncStorage.clear();
            showModal("Cache Cleared", "App cache has been cleared.");
        });
    };

    // ✅ Language Selection
    const handleLanguageChange = () => {
        const nextLanguage = selectedLanguage === "English"
            ? "Marathi"
            : selectedLanguage === "Marathi"
                ? "Hindi"
                : "English";
        setSelectedLanguage(nextLanguage);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../../assets/logo.png')} style={styles.logo} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Entypo name="chat" size={36} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>WELCOME TO RENTEASY</Text>
                <Text style={styles.subtitle}>RENT IT, USE IT, RETURN IT!</Text>

                {/* ✅ Edit Profile */}
                <Section title="Edit Profile" icon={<Ionicons name="person" size={20} />} onPress={() => navigation.navigate("Profile")} />

                {/* ✅ Preferences */}
                <Section title="Preferences" icon={<Ionicons name="options" size={20} />} />
                <ToggleRow label="Dark Mode" value={darkMode} onValueChange={() => setDarkMode(!darkMode)} icon={<Ionicons name="moon" size={20} />} />
                <ToggleRow label="Notifications" value={notifications} onValueChange={() => setNotifications(!notifications)} icon={<Ionicons name="notifications" size={20} />} />
                <TouchableOpacity style={styles.row} onPress={handleLanguageChange}>
                    <Ionicons name="language" size={20} style={styles.rowIcon} />
                    <Text style={styles.rowLabel}>Language: {selectedLanguage}</Text>
                </TouchableOpacity>

                {/* ✅ Security */}
                <Section title="Security" icon={<Ionicons name="lock-closed" size={20} />} />
                <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("ChangePassword")}>
                    <MaterialIcons name="vpn-key" size={20} style={styles.rowIcon} />
                    <Text style={styles.rowLabel}>Change Password</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("ForgotPassword")}>
                    <Ionicons name="help-circle" size={20} style={styles.rowIcon} />
                    <Text style={styles.rowLabel}>Forgot Password</Text>
                </TouchableOpacity>

                {/* ✅ Payment & Payouts */}
                <Section title="Payment & Payouts" icon={<MaterialIcons name="payment" size={20} />} />
                <TouchableOpacity style={styles.row}>
                    <FontAwesome name="credit-card" size={20} style={styles.rowIcon} />
                    <Text style={styles.rowLabel}>Saved Cards</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <MaterialIcons name="account-balance" size={20} style={styles.rowIcon} />
                    <Text style={styles.rowLabel}>Add Bank Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row}>
                    <MaterialIcons name="currency-rupee" size={20} style={styles.rowIcon} />
                    <Text style={styles.rowLabel}>UPI ID Management</Text>
                </TouchableOpacity>

                {/* ✅ Help & Support (Modal) */}
                <Section title="Help & Support" icon={<Ionicons name="help-buoy" size={20} />} onPress={() => setHelpModalVisible(true)} />

                {/* ✅ Account */}
                <Section title="Account" icon={<Ionicons name="person-circle" size={20} />} />
                <TouchableOpacity style={styles.row} onPress={handleDeactivateAccount}>
                    <MaterialIcons name="delete-forever" size={20} style={[styles.rowIcon, { color: "red" }]} />
                    <Text style={[styles.rowLabel, { color: "red" }]}>Deactivate Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row} onPress={handleClearCache}>
                    <MaterialIcons name="cleaning-services" size={20} style={styles.rowIcon} />
                    <Text style={styles.rowLabel}>Clear App Cache</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.row} onPress={handleLogout}>
                    <Ionicons name="log-out" size={20} style={[styles.rowIcon, { color: "#001F54" }]} />
                    <Text style={[styles.rowLabel, { color: "#001F54" }]}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>

            {/* ✅ Help Modal */}
            <Modal visible={helpModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Help & Support</Text>
                        <TouchableOpacity style={styles.row}>
                            <Ionicons name="book" size={20} style={styles.rowIcon} />
                            <Text style={styles.rowLabel}>FAQs</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.row}>
                            <Ionicons name="call" size={20} style={styles.rowIcon} />
                            <Text style={styles.rowLabel}>Contact Support</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.row}>
                            <Ionicons name="chatbubbles" size={20} style={styles.rowIcon} />
                            <Text style={styles.rowLabel}>Submit a Complaint / Suggestion</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("About")}>
                            <Entypo name="info-with-circle" size={20} style={styles.rowIcon} />
                            <Text style={styles.rowLabel}>About</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.payButton, { marginTop: 20 }]}
                            onPress={() => setHelpModalVisible(false)}
                        >
                            <Text style={styles.payText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <RentEasyModal
                visible={modalVisible}
                title={modalContent.title}
                message={modalContent.message}
                onClose={() => setModalVisible(false)}
                onConfirm={modalContent.onConfirm}
            />
        </View>
    );
};

export default Settings;

// ✅ Reusable Components
const Section = ({ title, icon, onPress }) => (
    <TouchableOpacity style={styles.section} onPress={onPress}>
        {icon}
        <Text style={styles.sectionText}> {title}</Text>
    </TouchableOpacity>
);

const ToggleRow = ({ label, value, onValueChange, icon }) => (
    <View style={styles.toggleRow}>
        {icon}
        <Text style={styles.rowLabel}>{label}</Text>
        <Switch value={value} onValueChange={onValueChange} />
    </View>
);

// ✅ Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E6F0FA',
        paddingTop: 30,
        ...Platform.select({
            ios: { marginTop: 10 }
        })
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    logo: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 6,
        color: '#1E1E1E',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
        color: '#3a3a3a',
        fontStyle: 'italic',
        fontWeight: '500',
    },
    scrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    section: {
        backgroundColor: '#ccc',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionText: {
        fontWeight: 'bold',
        fontSize: 17,
        marginLeft: 10
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ddd',
        borderRadius: 10,
        padding: 10,
        marginVertical: 6,
        marginLeft: 20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        marginLeft: 20
    },
    rowIcon: {
        marginRight: 10,
        color: '#333'
    },
    rowLabel: {
        fontSize: 16,
        color: '#222',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        width: '85%',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    payButton: {
        backgroundColor: "#001F54",
        borderRadius: 8,
        paddingVertical: 10,
        alignItems: "center",
    },
    payText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    }
});
