import React from 'react';
import { Alert } from 'react-native';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Colors } from '../assets/colors';

const DeleteAccountButton = ({ navigation }) => {

    const deleteAccountButton = () => {
        Alert.alert(
            "Are you sure you want to permanently delete your account?",
            "This action cannot be undone. You will lose all your data.",
            [
                {
                    text: "Cancel",
                    onPress: () => {},
                },
                { 
                    text: "Delete", 
                    style: 'destructive',
                    onPress: () => deleteAccount(),
                },
            ],
            { cancelable: false }
        );
    };

    const deleteAccount = async () => {
        try {
            // Get token from AsyncStorage
            const token = await AsyncStorage.getItem('token');

            if (!token) { return; }
            
            // Backend URL
            const backendUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/delete`;
            console.log('Backend URL:', backendUrl);
            
            // Send DELETE request to delete user account
            await axios.delete(backendUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            // Clear token and user data from AsyncStorage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');

            // Success alert and navigate to login screen
            Alert.alert('Account Deleted', 'Your account has been successfully deleted.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }],
                { cancelable: false }
            );
        } catch (error) {
            // Display error message
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    return (
        // Delete Button
        <TouchableOpacity style={styles.deleteContainer} onPress={() => deleteAccountButton()}>
            <Text style={[styles.text, styles.textDelete]}>Delete Account</Text>
        </TouchableOpacity>
    );
};

export default DeleteAccountButton;

const styles = StyleSheet.create({
    text: {
        fontSize: 16,
        marginBottom: 10,
        color: Colors.primaryBlue,
    },
    deleteContainer: {
        flexDirection: 'row',
        justifyContent: 'center', 
        width: '100%',
        paddingBottom: 5,
        paddingTop: 10,
        backgroundColor: Colors.red,
        borderRadius: 20,
    },
    textDelete: {
        fontSize: 16,
        color: '#FFF',
    },
});