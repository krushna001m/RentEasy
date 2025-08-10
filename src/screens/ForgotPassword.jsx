import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import auth from "@react-native-firebase/auth";
import RentEasyModal from "../components/RentEasyModal";

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "" });

    const showModal = (title, message) => {
        setModalContent({ title, message });
        setModalVisible(true);
    };

    // Mask email for privacy in success messages
    const maskEmail = (email) => {
        const [name, domain] = email.split("@");
        return `${name[0]}***@${domain}`;
    };

    // Send password reset email
    const sendEmailReset = async () => {
        if (!email.trim()) {
            showModal("Error", "Please enter your registered email.");
            return;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showModal("Error", "Please enter a valid email address.");
            return;
        }
        try {
            await auth().sendPasswordResetEmail(email);
            showModal("Success", `Password reset link sent to ${maskEmail(email)}`);
            setEmail("");
        } catch (error) {
            console.log("Email reset error:", error);
            let msg = "Failed to send password reset email.";
            if (error.code === "auth/user-not-found") {
                msg = "No account found with that email.";
            }
            showModal("Error", msg);
        }
    };

    // Send OTP to phone number
    const sendSMSOTP = async () => {
        if (!phone.trim()) {
            showModal("Error", "Please enter your registered phone number.");
            return;
        }
        if (!/^\+\d{10,15}$/.test(phone)) {
            showModal("Error", "Phone number must be in international format (e.g. +1234567890).");
            return;
        }
        try {
            const confirmation = await auth().signInWithPhoneNumber(phone);
            showModal("Success", `OTP sent to ${phone}`);
            setPhone("");
            // Navigate to OTP verification screen
            navigation.navigate("OTPVerification", {
                confirmation,
                method: "sms",
                phone
            });
        } catch (error) {
            console.log("SMS OTP Error:", error);
            let msg = "Failed to send OTP via SMS.";
            if (error.code === "auth/too-many-requests") {
                msg = "Too many requests. Please try again later.";
            }
            if (error.code === "auth/invalid-phone-number") {
                msg = "Invalid phone number format.";
            }
            showModal("Error", msg);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>FORGOT PASSWORD</Text>
            <Text style={styles.subtitle}>Reset your password via Firebase</Text>

            {/* Email Reset */}
            <TextInput
                style={styles.input}
                placeholder="Enter your Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.button} onPress={sendEmailReset}>
                <Text style={styles.buttonText}>Send Reset Link via Email</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>────────── OR ──────────</Text>

            {/* Phone OTP */}
            <TextInput
                style={styles.input}
                placeholder="Enter your Phone (+91...)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <TouchableOpacity
                style={[styles.button, { backgroundColor: "#34A853" }]}
                onPress={sendSMSOTP}
            >
                <Text style={styles.buttonText}>Send OTP via SMS</Text>
            </TouchableOpacity>

            {/* Back */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <View style={styles.buttonContent}>
                    <AntDesign
                        name="arrowleft"
                        size={20}
                        color="white"
                        style={styles.buttonIcon}
                    />
                    <Text style={styles.buttonText}>BACK</Text>
                </View>
            </TouchableOpacity>

            {/* Modal */}
            <RentEasyModal
                visible={modalVisible}
                title={modalContent.title}
                message={modalContent.message}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6F0FA",
        padding: 20,
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
        marginTop: 5,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    orText: {
        marginVertical: 10,
        color: "#333",
        fontWeight: "600",
    },
    backButton: {
        backgroundColor: "#DB4437",
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
        width: "80%",
    },
    buttonContent: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonIcon: {
        marginRight: 10,
    },
});
