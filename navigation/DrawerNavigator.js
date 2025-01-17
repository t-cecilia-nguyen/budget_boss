import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '../assets/colors';

// Import bottom tabs
import BottomTabNavigator from './BottomTabNavigator';

// Import screens
import MyAccount from '../screens/MyAccount';
import Settings from '../screens/Settings';
import SignOut from '../screens/SignOut';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props}>
            {/* Profile Section */}
            <View style={styles.profileSection}>
                <Image
                    source={require('../assets/icon.png') } // Profile picture
                    style={styles.profileImage}
                />
                <Text style={styles.profileName}>Test Name</Text>
                <Text style={styles.profileEmail}>email@gmail.com</Text>
            </View>

            {/* Navigation Items */}
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator 
        initialRouteName="Dashboard"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
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
        }}>
            <Drawer.Screen 
            name="My Account" 
            component={MyAccount}
            options={{
                drawerIcon: ({}) => (
                    <MaterialIcons name="account-circle" size={24} color={Colors.grey}/>
                ),
                headerTitle: () => null,
            }}
            />
            <Drawer.Screen 
            name="Dashboard" 
            component={BottomTabNavigator}
            options={{
                drawerIcon: ({}) => (
                    <MaterialIcons name="leaderboard" size={24} color={Colors.grey}/>
                ),
                headerTitle: () => null,
            }}
            />
            <Drawer.Screen 
            name="Settings" 
            component={Settings} 
            options={{
                drawerIcon: ({}) => (
                    <MaterialIcons name="settings" size={24} color={Colors.grey}/>
                ),
                headerTitle: () => null,
            }}
            />
            <Drawer.Screen 
            name="SignOut" 
            component={SignOut}
            options={{
                drawerIcon: ({}) => (
                    <MaterialIcons name="exit-to-app" size={24} color={Colors.grey}/>
                ),
                headerTitle: () => null,
            }}
            />
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    profileSection: {
        alignItems: 'center',
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
        fontWeight: 'bold',
    },
    profileEmail: {
        fontSize: 14,
        color: Colors.greyBlue,
    },
});