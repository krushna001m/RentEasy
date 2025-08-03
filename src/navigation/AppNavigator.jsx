import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Home from "../screens/Home";
import BrowseItems from "../screens/BrowseItems";
import ForgotPassword from "../screens/ForgotPassword";
import ChangePassword from "../screens/ChangePassword";
import OTPVerification from "../screens/OTPVerification";
import ResetPassword from "../screens/ResetPassword";
import AddItem from "../screens/AddItem";
import History from "../screens/History";
import Chat from "../screens/Chat";
import Profile from "../screens/Profile";
import Settings from "../screens/Settings";
import ChatBot from "../screens/ChatBot";
import Payment from "../screens/Payment";
import Loader from "../components/Loader";
import RentEasyModal from "../components/RentEasyModal";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("loggedInUser");
        if (userData) {
          setInitialRoute("Home"); // ✅ Already logged in → Go to Home
        } else {
          setInitialRoute("Login"); // ✅ No user → Show Login
        }
      } catch (error) {
        console.error("Error checking login:", error);
        setInitialRoute("Login");
      }
    };

    checkLoginStatus();
  }, []);

  if (!initialRoute) {
    return (
      <Loader/>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BrowseItems" component={BrowseItems} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="ResetPassword" component={ResetPassword} />
        <Stack.Screen name="AddItem" component={AddItem} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="ChatBot" component={ChatBot} />
        <Stack.Screen name="Payment" component={Payment} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;