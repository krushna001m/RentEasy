import React, { useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

const Login = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/logo.png")} style={styles.logo} />
      <Text style={styles.maintitle}>WELCOME BACK</Text>
      <Text style={styles.subtitle}>LOGIN</Text>

      <View style={styles.inputContainer}>
        <FontAwesome5 name="user" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          placeholderTextColor="#666"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#666"
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome5
            name={showPassword ? "eye" : "eye-slash"}
            size={20}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.forgotContainer} onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.forgot}>FORGOT PASSWORD ?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Home")}>
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

      <View style={{ flexDirection: "row" }}>
        <Text style={styles.signText}>DON'T HAVE AN ACCOUNT ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.signText1}>SIGN UP</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6F0FA",
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
    borderRadius: 20,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,

    elevation: 10,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  maintitle: {
    fontSize: 40,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    width: "80%",
    borderColor: "black",
    borderWidth: 2,
    marginTop: 20,
    marginBottom: 10,
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
    paddingRight: 10,
  },
  forgotContainer: {
    width: "100%",
    alignItems: "flex-end",
    paddingRight: 50,
  },
  forgot: {
    fontSize: 14,
    color: "blue",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  loginButton: {
    alignSelf: "center",
    marginTop: 30,
    backgroundColor: "#0461cc",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "40%",
  },
  loginText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
  },
  googleButton: {
    alignSelf: "center",
    backgroundColor: "#DB4437",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    width: "80%",
  },
  googleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  signText: {
    fontSize: 16,
    color: "black",
    fontWeight: "600",
    marginTop: 20,
    marginRight: 5,
  },
  signText1: {
    fontSize: 16,
    color: "blue",
    fontWeight: "600",
    marginTop: 20,
    textDecorationLine: "underline",
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    marginRight: 10,
  },
  loginButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  loginIcon: {
    marginRight: 10,
  },
});
