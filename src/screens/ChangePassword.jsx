import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    Alert
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";

const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

const ChangePassword = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async () => {
        if (!username || !currentPassword || !newPassword || !confirmPassword) {
            Alert.alert("Error", "Please fill all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            Alert.alert("Error", "New passwords do not match.");
            return;
        }

        try {
            const res = await axios.get(`${URL}/users/${username}.json`);
            const userData = res.data;

            if (!userData || userData.password !== currentPassword) {
                Alert.alert("Error", "Invalid username or current password.");
                return;
            }

            await axios.patch(`${URL}/users/${username}.json`, {
                password: newPassword,
            });

            Alert.alert("Success", "Password changed successfully!", [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={require("../../assets/logo.png")} style={styles.logo} />
            <Text style={styles.title}>CHANGE PASSWORD</Text>
            <Text style={styles.subtitle}>Update your password securely</Text>

            {/* Username */}
            <View style={styles.inputContainer}>
                <FontAwesome5 name="user" size={20} color="#333" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter Username"
                    value={username}
                    onChangeText={setUsername}
                />
            </View>

            {/* Current Password */}
            <View style={styles.inputContainer}>
                <FontAwesome5 name="lock" size={20} color="#333" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Current Password"
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                />
            </View>

            {/* New Password */}
            <View style={styles.inputContainer}>
                <FontAwesome5 name="key" size={20} color="#333" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="New Password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
                <FontAwesome5 name="check" size={20} color="#333" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm New Password"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
            </View>

            <TouchableOpacity style={styles.resetButton} onPress={handleChangePassword}>
                <View style={styles.buttonContent}>
                    <AntDesign name="checkcircle" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>CHANGE PASSWORD</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <View style={styles.buttonContent}>
                    <AntDesign name="arrowleft" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>BACK</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E6F0FA",
        paddingHorizontal: 20,
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: "contain",
        marginBottom: 10,
        borderRadius: 50,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#e0e0e0",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#001F54",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: "#333",
        marginBottom: 30,
        textAlign: "center",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: 50,
        width: "85%",
        borderColor: "#001F54",
        borderWidth: 2,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 8,
        backgroundColor: "#fff",
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
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 10,
        width: "85%",
    },
    backButton: {
        backgroundColor: "#DB4437",
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 15,
        width: "85%",
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
