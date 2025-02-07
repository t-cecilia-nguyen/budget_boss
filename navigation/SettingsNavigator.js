import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import Settings from '../screens/Settings';
import LoginSecurity from '../screens/LoginSecurity';
import HelpSupport from '../screens/HelpSupport';
import ContactUs from '../screens/ContactUs';
import SubmitFeedback from '../screens/SubmitFeedback';  

const Stack = createStackNavigator();

export default function SettingsStackNavigator() {
    return (
        <Stack.Navigator initialRouteName="SettingsNav">
            <Stack.Screen name="SettingsNav" component={Settings} options={{ headerShown: false }}/>
            <Stack.Screen name="LoginSecurity" component={LoginSecurity} options={{ headerShown: false }}/>
            <Stack.Screen name="HelpSupport" component={HelpSupport} options={{ headerShown: false }}/>
            <Stack.Screen name="ContactUs" component={ContactUs} options={{ headerShown: false }}/>
            <Stack.Screen name="SubmitFeedback" component={SubmitFeedback} options={{ headerShown: false }}/>
        </Stack.Navigator>
    );
}