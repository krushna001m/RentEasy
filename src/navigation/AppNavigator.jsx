import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Login from "../screens/Login";
import SignUp from "../screens/SignUp";
import Home from "../screens/Home";
import BrowseItems from "../screens/BrowseItems";
import ForgotPassword from "../screens/ForgotPassword";
import AddItem from "../screens/AddItem";

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="BrowseItems" component={BrowseItems}/>
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <Stack.Screen name="AddItem" component={AddItem}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
