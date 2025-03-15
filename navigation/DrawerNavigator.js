import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../assets/colors";
import Constants from "expo-constants";

// Import navigators
import BottomTabNavigator from "./BottomTabNavigator";
import SettingsStackNavigator from './SettingsNavigator';

// Import screens
import MyAccount from '../screens/MyAccount';
import CreateTransactions from '../screens/CreateTransactions';

const Drawer = createDrawerNavigator();

// Handle sign out
const SignOut = ({ navigation }) => {
  const handleSignOut = async () => {
    try {
      // Clear token from storage
      await AsyncStorage.removeItem("token");

      // Sign Out confirmation
      Alert.alert("Sign Out", "You have successfully signed out!", [
        { text: "OK", onPress: () => navigation.replace("Login") },
      ]);
    } catch (error) {
      console.error("Error during sign out:", error);
      Alert.alert("Sign Out", "An error occurred while signing out.");
    }
  };

  // Sign out on component mount
  React.useEffect(() => {
    handleSignOut();
  }, []);

  return null; // No UI for this screen
};

// Define custom drawer content (user profile)
function CustomDrawerContent(props) {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get token from storage
        const token = await AsyncStorage.getItem("token");

        // Backend URL
        const backendUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`;

        if (token) {
          // Fetch user data using token
          const response = await fetch(backendUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            // Set user info
            setUser({
              name: `${data.firstName} ${data.lastName}`,
              email: data.email,
            });
          } else {
            console.error('Failed to fetch user info:', response.statusText);
          }
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUser(); // Fetch user info
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          source={require("../assets/icon.png")} // Profile picture
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      {/* Navigation Items */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

// Drawer Navigator
export default function DrawerNavigator() {
  const [userId, setUserId] = useState(null); // Store User ID

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      drawerContent={(props) => (
        <CustomDrawerContent {...props} setUserId={setUserId} />
      )}
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.darkBlue,
        },
        headerTintColor: Colors.grey,
        drawerStyle: {
          backgroundColor: Colors.darkBlue,
          width: 280,
        },
        drawerActiveTintColor: Colors.accentYellow,
        drawerInactiveTintColor: Colors.greyBlue,
      }}
    >
      {/* My Account */}
      <Drawer.Screen
        name="My Account"
        component={MyAccount}
        options={{
          drawerIcon: ({}) => (
            <MaterialIcons
              name="account-circle"
              size={24}
              color={Colors.grey}
            />
          ),
          headerTitle: () => null,
        }}
      />

      {/* Dashboard */}
      <Drawer.Screen
        name="Dashboard"
        component={BottomTabNavigator}
        options={{
          drawerIcon: ({}) => (
            <MaterialIcons name="leaderboard" size={24} color={Colors.grey} />
          ),
          headerTitle: () => null,
        }}
      />

      {/* Create Transactions */}
      <Drawer.Screen
        name="Create Transactions"
        component={CreateTransactions}
        options={{
          drawerIcon: ({}) => (
            <MaterialIcons name="add" size={24} color={Colors.grey}/>
          ),
          headerTitle: () => null,
          drawerItemStyle: { display: 'none' },
        }}
        initialParams={{ userId }}
      />

      {/* Settings */}
      <Drawer.Screen
        name="Settings"
        component={SettingsStackNavigator}
        options={{
          drawerIcon: ({}) => (
            <MaterialIcons name="settings" size={24} color={Colors.grey} />
          ),
          headerTitle: () => null,
        }}
      />

      {/* Sign Out */}
      <Drawer.Screen
        name="SignOut"
        component={SignOut}
        options={{
          drawerIcon: ({}) => (
            <MaterialIcons name="exit-to-app" size={24} color={Colors.grey} />
          ),
          headerTitle: () => null,
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: Colors.darkBlue,
    borderBottomWidth: 1,
    borderBottomColor: Colors.greyBlue,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    color: Colors.accentYellow,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    color: Colors.greyBlue,
  },
});