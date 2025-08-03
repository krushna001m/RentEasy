import React, { useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
} from "react-native";
import emailjs from "@emailjs/browser";
import AntDesign from "react-native-vector-icons/AntDesign";

import auth from '@react-native-firebase/auth';
import RentEasyModal from '../components/RentEasyModal';


const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [generatedOTP, setGeneratedOTP] = useState("");
    const [method, setMethod] = useState(""); // "email" or "sms"

    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "" });

    const showModal = (title, message) => {
        setModalContent({ title, message });
        setModalVisible(true);
    };

    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    const sendEmailOTP = async () => {
        if (!email.trim()) {
            showModal("Error", "Enter your registered email.");
            return;
        }

        if (!/^\S+@\S+\.\S+$/.test(email)) {
            showModal("Error", "Please enter a valid email address.");
            return;
        }

        const otp = generateOTP();
        setGeneratedOTP(otp);

        try {
            await emailjs.send(
                "service_oajvkpf",
                "template_gbu3eoi",
                { to_email: email, otp_code: otp },
                "PTi9Iuo1Yj94r00Ha"
            );

            await AsyncStorage.setItem("recoveryEmail", email); // optional
            setMethod("email");

            showModal("Success", `OTP sent to ${maskEmail(email)}`);
            navigation.navigate("OTPVerification", { generatedOTP: otp, method: "email" });

        } catch (error) {
            showModal("Error", "Failed to send OTP via Email.");
            console.log("Email OTP error:", error);
        }
    };

    const maskEmail = (email) => {
        const [name, domain] = email.split("@");
        return `${name[0]}***@${domain}`;
    };

    const sendSMSOTP = async () => {
        if (!phone.trim()) {
            showModal("Error", "Enter your registered phone number.");
            return;
        }

        try {
            const confirmation = await auth().signInWithPhoneNumber(phone);
            showModal("Success", `OTP sent to ${phone}`);
            navigation.navigate("OTPVerification", { confirmation, method: "sms" });

        } catch (error) {
            console.log("SMS OTP Error:", error.message);
            showModal("Error", "Failed to send OTP via SMS.");
        }
    };


    return (
        <View style={styles.container}>

            <Text style={styles.title}>FORGOT PASSWORD</Text>
            <Text style={styles.subtitle}>Reset your password via OTP</Text>

            {/* Email Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter your Email"
                value={email}
                onChangeText={setEmail}
            />
            <TouchableOpacity style={styles.button} onPress={sendEmailOTP}>
                <Text style={styles.buttonText}>Send OTP via Email</Text>
            </TouchableOpacity>

            <Text style={styles.orText}>────────── OR ──────────</Text>

            {/* Phone Input */}
            <TextInput
                style={styles.input}
                placeholder="Enter your Phone (+91...)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <TouchableOpacity style={[styles.button, { backgroundColor: "#34A853" }]} onPress={sendSMSOTP}>
                <Text style={styles.buttonText}>Send OTP via SMS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <View style={styles.buttonContent}>
                    <AntDesign name="arrowleft" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>BACK</Text>
                </View>
            </TouchableOpacity>
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
    buttonText: {
        color: "white",
        fontSize: 17,
        fontWeight: "bold",
    },
    buttonIcon: {
        marginRight: 10,
    },
});
