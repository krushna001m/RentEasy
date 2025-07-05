import React, { useState } from "react";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image
} from "react-native";

const SignUp = ({ navigation }) => {
  const [isOwner, setIsOwner] = useState(false);
  const [isBorrower, setIsBorrower] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
      <Text style={styles.maintitle}>WELCOME</Text>
      <Text style={styles.subtitle}>SIGN UP</Text>

      <View style={styles.inputContainer}>
        <FontAwesome5 name="user" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Username or Email"
          placeholderTextColor="#666"
        />
      </View>



      {/* Password Field */}
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
            name={showPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="#333"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password Field */}
      <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" size={20} color="#333" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#666"
          secureTextEntry={!showConfirmPassword}
        />
        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
          <FontAwesome5
            name={showConfirmPassword ? 'eye' : 'eye-slash'}
            size={20}
            color="#333"
          />
        </TouchableOpacity>
      </View>


      <View style={styles.roleContainer}>
        {/* Owner Checkbox */}
        <TouchableOpacity style={styles.roleCheckbox} onPress={() => setIsOwner(!isOwner)}>
          <FontAwesome
            name={isOwner ? 'check-square' : 'square-o'}
            size={24}
            color={isOwner ? '#4CAF50' : '#777'}
          />
          <Text style={styles.label}>Owner (Lender)</Text>
        </TouchableOpacity>

        {/* Borrower Checkbox */}
        <TouchableOpacity style={styles.roleCheckbox} onPress={() => setIsBorrower(!isBorrower)}>
          <FontAwesome
            name={isBorrower ? 'check-square' : 'square-o'}
            size={24}
            color={isBorrower ? '#4CAF50' : '#777'}
          />
          <Text style={styles.label}>Borrower</Text>
        </TouchableOpacity>
      </View>


      {/* Agree Checkbox */}
      <TouchableOpacity style={styles.checkboxContainer} onPress={() => setAgreed(!agreed)}>
        <FontAwesome
          name={agreed ? 'check-square' : 'square-o'}
          size={24}
          color={agreed ? '#4CAF50' : '#777'}
        />
        <Text style={styles.label}>I agree to the Terms and Conditions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate("Home")}>
        <View style={styles.loginButtonContent}>
          <AntDesign name="login" size={20} color="white" style={styles.loginIcon} />
          <Text style={styles.loginText}>SIGN UP</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.googleButton}>
        <View style={styles.googleButtonContent}>
          <FontAwesome5 name="google" size={20} color="white" style={styles.googleIcon} />
          <Text style={styles.googleText}>SIGN UP WITH GOOGLE</Text>
        </View>
      </TouchableOpacity>

      <View style={{ flexDirection: 'row' }}>
        <Text style={styles.signText}>ALREADY HAVE AN ACCOUNT ?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.signText1}>LOGIN</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default SignUp;

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
    fontSize: 35,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 25,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    width: "80%",
    borderColor: "black",
    borderWidth: 2,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
    alignSelf: 'flex-start',
    marginLeft: 40,
  },
  label: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
    marginHorizontal: 40,
    alignContent:'center'
  },

  roleCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
    alignContent:'center'
  },

  loginButton: {
    alignSelf: 'center',
    marginTop: 30,
    backgroundColor: '#0461cc',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '60%',
  },
  loginText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  googleButton: {
    alignSelf: 'center',
    backgroundColor: '#DB4437',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    width: '80%',
  },
  googleText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signText: {
    fontSize: 16,
    color: "black",
    fontWeight: '600',
    marginTop: 20,
    marginRight: 5,
  },
  signText1: {
    fontSize: 16,
    color: "blue",
    fontWeight: '600',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginIcon: {
    marginRight: 10,
  },
});
