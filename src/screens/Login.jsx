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
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const Login = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    showPassword: false,
  });

  const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setFormData((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  };

  const handleLogin = async () => {
    const { username, password } = formData;

    if (!username || !password) {
      Alert.alert("Error", "Username and password are required!");
      return;
    }

    try {
      const response = await axios.get(`${URL}/users.json`);
      const usersData = response.data || {};

      const matchedUser = Object.values(usersData).find(
        (users) => users.username === username && users.password === password
      );

      if (matchedUser) {
        // Store both username and complete user data for dynamic access
        await AsyncStorage.setItem("username", matchedUser.username);
        await AsyncStorage.setItem("loggedInUser", JSON.stringify(matchedUser));

        console.log("✅ Logged in user:", matchedUser.username);
        Alert.alert("Success", `Welcome back, ${matchedUser.username}!`);
        navigation.navigate("Home");
      } else {
        Alert.alert("Login Failed", "Invalid username or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      Alert.alert("Error", "Something went wrong. Try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Image source={require("../../assets/logo.png")} style={styles.logo} />
          <Text style={styles.maintitle}>WELCOME BACK</Text>
          <Text style={styles.subtitle}>LOGIN</Text>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="user" size={20} color="#333" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username or Email"
              placeholderTextColor="#666"
              value={formData.username}
              onChangeText={(text) => handleInputChange("username", text)}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={20} color="#333" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!formData.showPassword}
              value={formData.password}
              onChangeText={(text) => handleInputChange("password", text)}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <FontAwesome5
                name={formData.showPassword ? "eye" : "eye-slash"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotContainer}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.forgot}>FORGOT PASSWORD ?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <View style={styles.loginButtonContent}>
              <AntDesign name="login" size={20} color="white" style={styles.loginIcon} />
              <Text style={styles.loginText}>LOGIN</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.googleButton}>
            <View style={styles.googleButtonContent}>
              <FontAwesome5 name="google" size={20} color="white" style={styles.googleIcon} />
              <Text style={styles.googleText}>SIGN IN WITH GOOGLE</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signText}>DON'T HAVE AN ACCOUNT ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.signText1}>SIGN UP</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E6F0FA",
  },
  container: Platform.select({
    ios: {
      flex: 1,
      marginTop: 40,
    },
    android: {
      flex: 1,
      marginTop: 60,
    },
  }),
  scrollContent: {
    alignItems: "center",
    paddingVertical: 40,
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
  maintitle: {
    fontSize: height * 0.045,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: height * 0.032,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    width: width * 0.85,
    borderColor: "black",
    borderWidth: 2,
    marginTop: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
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
    paddingRight: 10,
  },
  forgotContainer: {
    width: "85%",
    alignItems: "flex-end",
    marginTop: 10,
  },
  forgot: {
    fontSize: 15,
    color: "blue",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  loginButton: {
    marginTop: 30,
    backgroundColor: "#0461cc",
    paddingVertical: 12,
    borderRadius: 8,
    width: width * 0.45,
  },
  loginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginIcon: {
    marginRight: 10,
  },
  loginText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "#DB4437",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    width: width * 0.85,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    marginRight: 10,
  },
  googleText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 25,
  },
  signText: {
    fontSize: 16,
    color: "black",
    fontWeight: "600",
    marginRight: 5,
  },
  signText1: {
    fontSize: 16,
    color: "blue",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});