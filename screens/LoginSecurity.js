import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import axios from 'axios';
import { Colors } from '../assets/colors';
import { MaterialIcons } from '@expo/vector-icons';

const LoginSecurityScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Error states for each field
    const [errors, setErrors] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    // Regular expression for password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    // Validate email and password
    const validateInputs = () => {
        let isValid = true;
        let tempErrors = { newPassword: '', confirmPassword: '' };

        if (!newPassword) {
            tempErrors.newPassword = 'New password is required';
            isValid = false;
        } else if (!passwordRegex.test(newPassword)) {
            tempErrors.newPassword = 'Password must be at least 8 characters, with 1 uppercase letter, 1 lowercase letter, and 1 number';
            isValid = false;
        }

        if (!confirmPassword) {
            tempErrors.confirmPassword = 'Confirm password is required';
            isValid = false;
        } else if (newPassword !== confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
    };

    // Update password
    const handleSave = async () => {
        // Validate inputs
        const isValid = validateInputs();
        if (!isValid) {
            return;
        }

        setLoading(true);

        try {
            // Get token from AsyncStorage
            const token = await AsyncStorage.getItem('token');
            // Backend URL
            const backendUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/password`;

            // Send PUT request to update password
            const response = await axios.put(backendUrl, {
                password: newPassword,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                // Password updated successfully
                Alert.alert('Success', 'Password updated successfully!');
                navigation.goBack();
            } else {
                // Error if password update fails
                Alert.alert('Error', response.data.message || 'Failed to update password.');
            }
        } catch (error) {
            // Errors during password update
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Error: Border Color Styling
    const getInputStyle = (field) => {
        return {
            ...styles.input,
            borderColor: errors[field] ? Colors.red : '#CCC',
        };
    };

    // Error: Text Style
    const getErrorTextStyle = (field) => {
        return {
            color: errors[field] ? Colors.red : 'transparent',
        };
    };

    return (
        <View style={styles.container}>

            {/* Update Account Title */}
            <Text style={styles.title}>Update Account</Text>

            {/* New Password */}
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} style={styles.icon} />
                <TextInput
                    style={getInputStyle('newPassword')}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                />
            </View>
            <Text style={getErrorTextStyle('newPassword')}>{errors.newPassword}</Text>

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.inputContainer}>
                <MaterialIcons name="lock" size={24} style={styles.icon} />
                <TextInput
                    style={getInputStyle('confirmPassword')}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                />
            </View>
            <Text style={getErrorTextStyle('confirmPassword')}>{errors.confirmPassword}</Text>

            {/* Empty section for spacing */}
            <View style={styles.emptySection}></View>

            {/* Save Button */}
            <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>SAVE</Text>}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F5F5F5',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.primaryBlue,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        marginTop: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 20,
        backgroundColor: '#FFF',
        paddingLeft: 10,
    },
    input: {
        flex: 1,
        height: 50,
        paddingLeft: 10,
    },
    icon: {
        color: Colors.darkBlue,
    },
    emptySection: {
        flex: 1,
    },
    button: {
        backgroundColor: Colors.primaryBlue,
        padding: 15,
        marginTop: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoginSecurityScreen;