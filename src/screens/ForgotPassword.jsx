import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Platform,
    Dimensions,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import auth from "@react-native-firebase/auth";
import RentEasyModal from "../components/RentEasyModal";

const { width } = Dimensions.get("window");

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [modalContent, setModalContent] = useState({ title: "", message: "" });

    const showModal = (title, message) => {
        setModalContent({ title, message });
        setModalVisible(true);
    };

    // Mask email for privacy
    const maskEmail = (email) => {
        const [name, domain] = email.split("@");
        return `${name[0]}***@${domain}`;
    };

/** EMAIL RESET LINK **/
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
    } catch (error) {
        console.log("Email reset error:", error);
        let msg = "Failed to send password reset email.";
        if (error.code === "auth/user-not-found") {
            msg = "No account found with this email.";
        }
        showModal("Error", msg);
    }
};



    /** SMS OTP RESET **/
const sendSMSOTP = async () => {
    if (!phone.trim()) {
        showModal("Error", "Please enter your registered phone number.");
        return;
    }

    let formattedPhone = phone.trim();
    if (!formattedPhone.startsWith("+")) {
        formattedPhone = "+91" + formattedPhone.replace(/^0+/, "");
    }

    if (!/^\+\d{10,15}$/.test(formattedPhone)) {
        showModal("Error", "Phone number must be in international format (e.g. +1234567890).");
        return;
    }

    try {
        const confirmation = await auth().signInWithPhoneNumber(formattedPhone);
        navigation.navigate("OTPVerification", {
            confirmation,
            method: "sms",
            phone: formattedPhone
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
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.title}>FORGOT PASSWORD</Text>
            <Text style={styles.subtitle}>Reset via Email or SMS</Text>

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

            <Text style={styles.orText}>OR</Text>

            {/* Phone OTP Reset */}
            <TextInput
                style={styles.input}
                placeholder="Enter your Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.button} onPress={sendSMSOTP}>
                <Text style={styles.buttonText}>Send OTP via SMS</Text>
            </TouchableOpacity>

            {/* Back Button */}
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
    logo: {
        width: width * 0.25,
        height: width * 0.25,
        resizeMode: "contain",
        marginBottom: 20,
        borderRadius: 50,
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
