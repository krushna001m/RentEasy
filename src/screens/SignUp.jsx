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
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import RentEasyModal from '../components/RentEasyModal';
import app from '../firebaseConfig';
import axios from "axios";

const { width, height } = Dimensions.get("window");

const SignUp = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [pendingDeleteKey, setPendingDeleteKey] = useState(null);

  const showModal = (title, message, onConfirm = null) => {
    setModalContent({ title, message, onConfirm });
    setModalVisible(true);
  };

  const confirmDelete = (itemKey) => {
    setPendingDeleteKey(itemKey);
    showModal("Delete History?", "Are you sure you want to delete this item?", handleDeleteConfirmed);
  };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    isOwner: true,
    isBorrower: true,
    agreed: false,
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateInputs = () => {
    let valid = true;
    let newErrors = { username: "", password: "", confirmPassword: "" };

    if (!formData.username.trim()) {
      newErrors.username = "Username or Email is required";
      valid = false;
    } else if (formData.username.includes(" ")) {
      newErrors.username = "Username should not contain spaces";
      valid = false;
    } else if (
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.username) &&
      formData.username.length < 3
    ) {
      newErrors.username = "Enter valid email or min 3 characters";
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm your password";
      valid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;

    const { username, password, isOwner, isBorrower, agreed } = formData;

    if (!agreed) {
      showModal("Error", "You must agree to the terms!");
      return;
    }

    const roles = [];
    if (isOwner) roles.push("Owner");
    if (isBorrower) roles.push("Borrower");

    const auth = getAuth(app);
    const db = getDatabase(app);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, username, password);
      const { user } = userCredential;

      const newUser = {
        uid: user.uid,
        email: user.email,
        username,
        roles,
        agreed,
        createdAt: new Date().toISOString(),
      };

      await set(ref(db, `users/${user.uid}`), newUser);

      await AsyncStorage.setItem("username", username);
      await AsyncStorage.setItem("loggedInUser", JSON.stringify(newUser));

      showModal("Success", "Account created successfully!");
      setFormData({ username: "", password: "", confirmPassword: "", isOwner: true, isBorrower: true, agreed: false });
      navigation.navigate("Home");
    } catch (error) {
      showModal("Error", error.message);
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
              onChangeText={(text) => {
                setFormData({ ...formData, username: text });
                setErrors((prev) => ({ ...prev, username: "" }));
              }}
            />
          </View>
          {errors.username ? (
            <Text style={styles.errorText}>{errors.username}</Text>
          ) : null}

          {/* Password */}
          <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={20} color="#333" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#666"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => {
                setFormData({ ...formData, password: text });
                setErrors((prev) => ({ ...prev, password: "" }));
              }}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <FontAwesome5
                name={showPassword ? "eye" : "eye-slash"}
                size={20}
                color="#333"
              />
            </TouchableOpacity>
          </View>
          {errors.password ? (
            <Text style={styles.errorText}>{errors.password}</Text>
          ) : null}

          {/* Confirm Password */}
          <View style={styles.inputContainer}>
            <FontAwesome5 name="lock" size={20} color="#333" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#666"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(text) => {
                setFormData({ ...formData, confirmPassword: text });
                setErrors((prev) => ({ ...prev, confirmPassword: "" }));
              }}
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
          {errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}

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
              <AntDesign name="login" size={20} color="white" style={styles.loginIcon} />
              <Text style={styles.loginText}>SIGN UP</Text>
            </View>
          </TouchableOpacity>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton}>
            <View style={styles.googleButtonContent}>
              <FontAwesome5 name="google" size={20} color="white" style={styles.googleIcon} />
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
      <RentEasyModal
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        onClose={() => setModalVisible(false)}
        onConfirm={modalContent.onConfirm}
      />
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
      flex: 1,
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
    fontSize: height * 0.035,
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: height * 0.022,
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
  errorText: {
    width: width * 0.85,
    color: "red",
    fontSize: 13,
    marginTop: 3,
    marginLeft: 5,
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
    ...Platform.select({
      ios: { marginRight: 34 },
      android: { marginRight: 20 },
    }),
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
