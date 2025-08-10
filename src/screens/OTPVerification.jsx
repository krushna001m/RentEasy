import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import RentEasyModal from "../components/RentEasyModal";

const OTPVerification = ({ route, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "" });

    const showModal = (title, message, onConfirm = null) => {
        setModalContent({ title, message, onConfirm });
        setModalVisible(true);
    };

    // Extract values from route params safely
    const {
        generatedOTP = "",
        confirmation = null,
        method = "",
        email = "",
        phone = ""
    } = route.params || {};

    const [otp, setOtp] = useState("");

    const verifyOTP = async () => {
        if (!otp.trim()) {
            showModal("Error", "Please enter OTP");
            return;
        }

        if (method === "email") {
            if (otp.trim() === generatedOTP) {
                showModal("Success", "OTP Verified Successfully", () => {
                    navigation.navigate("ResetPassword", { method, email });
                });
            } else {
                showModal("Error", "Invalid OTP");
            }
        } else if (method === "sms") {
            try {
                await confirmation.confirm(otp.trim());
                showModal("Success", "OTP Verified Successfully", () => {
                    navigation.navigate("ResetPassword", { method, phone });
                });
            } catch (error) {
                console.log("SMS OTP verification error:", error);
                showModal("Error", "Invalid OTP");
            }
        }
    };

    const resendOTP = () => {
        if (method === "email") {
            showModal("Info", `Resend OTP feature for email not implemented yet`);
        } else if (method === "sms") {
            showModal("Info", `Resend OTP feature for SMS not implemented yet`);
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.title}>OTP VERIFICATION</Text>
            <Text style={styles.subtitle}>
                Enter the OTP sent to your {method === "email" ? email : phone}
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Enter OTP"
                keyboardType="number-pad"
                value={otp}
                onChangeText={setOtp}
                maxLength={6}
            />

            <TouchableOpacity style={styles.button} onPress={verifyOTP}>
                <Text style={styles.buttonText}>VERIFY OTP</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendButton} onPress={resendOTP}>
                <Text style={styles.resendText}>Resend OTP</Text>
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

export default OTPVerification;

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
        textAlign: "center",
    },
    input: {
        width: "80%",
        borderWidth: 1,
        borderColor: "#999",
        borderRadius: 8,
        padding: 10,
        marginVertical: 8,
        backgroundColor: "#fff",
        fontSize: 18,
        textAlign: "center",
        letterSpacing: 4,
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
    resendButton: {
        marginTop: 15,
    },
    resendText: {
        color: "#0461cc",
        fontSize: 15,
        fontWeight: "600",
    },
});
