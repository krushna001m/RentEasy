import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";

const ForgotPassword = ({ navigation }) => {
    const [email, setEmail] = useState("");

    const handleResetLink = () => {
        if (email.trim() === "") {
            Alert.alert("Error", "Please enter your email or username.");
        } else {
            Alert.alert("Success", "Password reset link sent to your email.");
            setEmail("");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.title}>FORGOT PASSWORD</Text>
            <Text style={styles.subtitle}>Reset your password here</Text>

            <View style={styles.inputContainer}>
                <FontAwesome5 name="envelope" size={20} color="#333" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email or username"
                    placeholderTextColor="#666"
                    value={email}
                    onChangeText={setEmail}
                />
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={handleResetLink}>
                <View style={styles.resetButtonContent}>
                    <AntDesign name="arrowright" size={20} color="white" style={styles.resetIcon} />
                    <Text style={styles.resetText}>SEND RESET LINK</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Login")}>
                <View style={styles.backButtonContent}>
                    <AntDesign name="arrowleft" size={20} color="white" style={styles.backIcon} />
                    <Text style={styles.backText}>BACK TO LOGIN</Text>
                </View>
            </TouchableOpacity>

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
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginBottom: 10,
        borderRadius: 20,
        elevation: 10,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#e0e0e0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "black",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 18,
        color: "#333",
        marginBottom: 30,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        width: "80%",
        borderColor: "black",
        borderWidth: 2,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
        justifyContent: "space-between",
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#000",
    },
    resetButton: {
        backgroundColor: "#0461cc",
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
        width: "80%",
    },
    resetButtonContent: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    resetText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    resetIcon: {
        marginRight: 10,
    },
    backToLogin: {
        marginTop: 25,
        fontSize: 16,
        color: "blue",
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
    backButton: {
        backgroundColor: "#DB4437", // grey-ish button
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 20,
        width: "80%",
    },
    backButtonContent: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    backText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    backIcon: {
        marginRight: 10,
    },

});
