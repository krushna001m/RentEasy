import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import RentEasyModal from '../components/RentEasyModal';

const URL = "https://your-firebase-db-url"; // Replace with your Firebase or API URL

const ResetPassword = ({ route, navigation }) => {

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

    const { method, email, phone } = route.params;
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handlePasswordReset = async () => {
        if (!newPassword || !confirmPassword) {
            showModal("Error", "Please fill all fields");
            return;
        }
        if (newPassword !== confirmPassword) {
            showModal("Error", "Passwords do not match");
            return;
        }

        try {
            // Update Password in your backend or Firebase Database
            await axios.patch(`${URL}/users.json`, {
                ...(method === "email" ? { email } : { phone }),
                password: newPassword,
            });

            showModal("Success", "Password Reset Successfully");
            navigation.navigate("Login");
        } catch (error) {
            showModal("Error", "Failed to update password");
            console.log(error);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.title}>RESET PASSWORD</Text>
            <Text style={styles.subtitle}>Enter your new password</Text>

            <TextInput
                style={styles.input}
                placeholder="Enter New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>RESET PASSWORD</Text>
            </TouchableOpacity>
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

export default ResetPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6F0FA",
        padding: 20,
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "black",
    },
    subtitle: {
        fontSize: 16,
        color: "#555",
        marginBottom: 20,
    },
    input: {
        width: "80%",
        borderWidth: 1,
        borderColor: "#999",
        borderRadius: 8,
        padding: 10,
        marginVertical: 8,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#0461cc",
        padding: 12,
        borderRadius: 8,
        width: "80%",
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
