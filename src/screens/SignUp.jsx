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
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const SignUp = ({ navigation }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    isOwner: true,
    isBorrower: true,
    agreed: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const URL = "https://renteasy-bbce5-default-rtdb.firebaseio.com";

  const handleSignUp = async () => {
    const { username, password, confirmPassword, isOwner, isBorrower, agreed } = formData;

    if (!username || !password || !confirmPassword) {
      Alert.alert("Error", "All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match!");
      return;
    }

    if (!agreed) {
      Alert.alert("Error", "You must agree to the terms!");
      return;
    }

    const roles = [];
    if (formData.isOwner) roles.push("Owner");
    if (formData.isBorrower) roles.push("Borrower");

    try {
      // ✅ Check if username already exists
      const existingUsers = await axios.get(`${URL}/users.json`);
      const usersData = existingUsers.data || {};

      const userExists = Object.values(usersData).some(
        (user) => user.username === username
      );

      if (userExists) {
        Alert.alert("Error", "Username already exists.");
        return;
      }

      // ✅ Save new user
      const response = await axios.post(`${URL}/users.json`, {
        username,
        password,
        roles,
        agreed,
      });

      if (response.status === 200) {
        // Alert.alert("Success", "Account created successfully!");
        navigation.navigate("Home");
      } else {
        Alert.alert("Error", "Something went wrong. Try again.");
      }
    } catch (error) {
      console.error("SignUp Error:", error.message);
      Alert.alert("Error", "Network issue or invalid data.");
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
          <Text style={styles.maintitle}>WELCOME</Text>
          <Text style={styles.subtitle}>SIGN UP</Text>

          {/* Username */}
          <View style={styles.inputContainer}>
            <FontAwesome5 name="user" size={20} color="#333" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Username or Email"
              placeholderTextColor="#666"
              value={formData.username}
              onChangeText={(text) =>
                setFormData({ ...formData, username: text })
              }
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={20} color="#333" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) =>
                setFormData({ ...formData, password: text })
              }
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome5
                name={showPassword ? "eye" : "eye-slash"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={20} color="#333" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(text) =>
                setFormData({ ...formData, confirmPassword: text })
              }
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <FontAwesome5
                name={showConfirmPassword ? "eye" : "eye-slash"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>

          {/* Roles */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={styles.roleCheckbox}
              onPress={() =>
                setFormData({ ...formData, isOwner: !formData.isOwner })
              }
            >
              <FontAwesome
                name={formData.isOwner ? "check-square" : "square-o"}
                size={24}
                color={formData.isOwner ? "#4CAF50" : "#777"}
              />
              <Text style={styles.label}>Owner (Lender)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roleCheckbox}
              onPress={() =>
                setFormData({ ...formData, isBorrower: !formData.isBorrower })
              }
            >
              <FontAwesome
                name={formData.isBorrower ? "check-square" : "square-o"}
                size={24}
                color={formData.isBorrower ? "#4CAF50" : "#777"}
              />
              <Text style={styles.label}>Borrower</Text>
            </TouchableOpacity>
          </View>

          {/* Terms Agreement */}
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() =>
              setFormData({ ...formData, agreed: !formData.agreed })
            }
          >
            <FontAwesome
              name={formData.agreed ? "check-square" : "square-o"}
              size={24}
              color={formData.agreed ? "#4CAF50" : "#777"}
            />
            <Text style={styles.label}>I agree to the Terms and Conditions</Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.loginButton} onPress={handleSignUp}>
            <View style={styles.loginButtonContent}>
              <AntDesign
                name="login"
                size={20}
                color="white"
                style={styles.loginIcon}
              />
              <Text style={styles.loginText}>SIGN UP</Text>
            </View>
          </TouchableOpacity>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton}>
            <View style={styles.googleButtonContent}>
              <FontAwesome5
                name="google"
                size={20}
                color="white"
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>SIGN UP WITH GOOGLE</Text>
            </View>
          </TouchableOpacity>

          {/* Navigation Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signText}>ALREADY HAVE AN ACCOUNT ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.signText1}>LOGIN</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SignUp;


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E6F0FA",
  },
  container: Platform.select({
    ios: {
      flex: 1
    },
    android: {
      flex: 1,
      marginTop: 60
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
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: height * 0.032,
    fontWeight: "bold",
    color: "black",
    marginBottom: 15,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 0,
    alignSelf: "flex-start",
    marginLeft: 40,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: 40,
  },
  roleCheckbox: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 0,
    ...Platform.select({
      ios: {
        marginRight: 34
      },
      android: {
        marginRight: 44
      }
    })
  },
  label: {
    marginLeft: 10,
    fontSize: 17,
    color: "#333",
    fontWeight: "500",
  },
  loginButton: {
    marginTop: 30,
    backgroundColor: "#0461cc",
    paddingVertical: 12,
    borderRadius: 8,
    width: width * 0.6,
  },
  loginButtonContent: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
