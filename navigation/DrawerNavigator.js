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

// Import bottom tabs
import BottomTabNavigator from "./BottomTabNavigator";

// Import screens
import MyAccount from "../screens/MyAccount";
import Settings from "../screens/Settings";

const Drawer = createDrawerNavigator();

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

  React.useEffect(() => {
    handleSignOut();
  }, []);

  return null;
};

function CustomDrawerContent(props) {
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const backendUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`;

        if (token) {
          const response = await fetch(backendUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("User data: ", data);
            setUser({
              name: `${data.firstName} ${data.lastName}`,
              email: data.email,
            });
    
          } else {
            console.error("Failed to fetch user info:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUser();
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

export default function DrawerNavigator() {
  const [userId, setUserId] = useState(null);

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
      <Drawer.Screen
        name="Settings"
        component={Settings}
        options={{
          drawerIcon: ({}) => (
            <MaterialIcons name="settings" size={24} color={Colors.grey} />
          ),
          headerTitle: () => null,
        }}
      />
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
