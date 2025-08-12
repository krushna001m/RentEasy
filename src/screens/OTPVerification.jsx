import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Platform } from "react-native";
import RentEasyModal from "../components/RentEasyModal";
import auth from "@react-native-firebase/auth";

const OTPVerification = ({ route, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "", onConfirm: null });
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const { generatedOTP = "", confirmation = null, method = "", email = "", phone = "" } = route.params || {};

    const showModal = (title, message, onConfirm = null) => {
        setModalContent({ title, message, onConfirm });
        setModalVisible(true);
    };

    const verifyOTP = async () => {
        if (!otp.trim()) {
            showModal("Error", "Please enter OTP");
            return;
        }

        try {
            if (method === "email") {
                if (otp.trim() === generatedOTP) {
                    showModal("Success", "OTP Verified Successfully", () => {
                        navigation.replace("ResetPassword", { method, email });
                    });
                } else {
                    showModal("Error", "Invalid OTP");
                }
            } else if (method === "sms") {
                setLoading(true);
                await confirmation.confirm(otp.trim());
                showModal("Success", "OTP Verified Successfully", () => {
                    navigation.replace("ResetPassword", { method, phone });
                });
            }
        } catch (error) {
            console.error("OTP verification error:", error);
            showModal("Error", "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const resendOTP = async () => {
        try {
            if (method === "email") {
                // Ideally call your backend here to resend the OTP
                showModal("Info", `A new OTP has been sent to ${email}`);
            } else if (method === "sms") {
                setLoading(true);
                let formattedPhone = phone;
                if (!formattedPhone.startsWith("+")) {
                    formattedPhone = "+91" + formattedPhone.replace(/^0+/, "");
                }
                const newConfirmation = await auth().signInWithPhoneNumber(formattedPhone);
                route.params.confirmation = newConfirmation;
                showModal("Info", `A new OTP has been sent to ${formattedPhone}`);
            }
        } catch (error) {
            console.error("Resend OTP error:", error);
            showModal("Error", "Failed to resend OTP. Try again later.");
        } finally {
            setLoading(false);
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

            <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={verifyOTP}
                disabled={loading}
            >
                <Text style={styles.buttonText}>{loading ? "VERIFYING..." : "VERIFY OTP"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendButton} onPress={resendOTP} disabled={loading}>
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
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#e0e0e0",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 10,
            },
        }),
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
