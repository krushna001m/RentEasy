import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import axios from "axios";
import RentEasyModal from '../components/RentEasyModal';

const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com"; // Your Firebase Realtime DB users path

const ResetPassword = ({ route, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "" });

    const showModal = (title, message, onConfirm = null) => {
        setModalContent({ title, message, onConfirm });
        setModalVisible(true);
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
            // Step 1: Fetch all users
            const res = await axios.get(URL);
            const users = res.data;

            // Step 2: Find matching user
            let foundUID = null;
            for (let uid in users) {
                if (
                    (method === "email" && users[uid].email === email) ||
                    (method === "sms" && users[uid].phone === phone)
                ) {
                    foundUID = uid;
                    break;
                }
            }

            if (!foundUID) {
                showModal("Error", "User not found");
                return;
            }

            // Step 3: Update password for found UID
            await axios.patch(`${URL}/users/${foundUID}.json`, {
                password: newPassword,
            });

            showModal("Success", "Password reset successfully", () => {
                navigation.navigate("Login");
            });
        } catch (error) {
            showModal("Error", "Failed to update password");
            console.error(error);
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
