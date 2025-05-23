import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../assets/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Constants from 'expo-constants';
import axios from 'axios';  

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Error states for each field
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });

    // Validate email and password
    const validateInputs = () => {
        let isValid = true;
        let tempErrors = { email: '', password: '' };

        if (!email) {
            tempErrors.email = 'Email is required';
            isValid = false;
        } 
        if (!password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
        
    };

    // Login logic
    const handleLogin = async () => {
        // Validate inputs
        const isValid = validateInputs();
        if (!isValid) return;

        // Backend URL
        const backend_url = `${Constants.expoConfig.extra.API_BACKEND_URL}/auth/login`;

        try {
            // Send POST login request to backend
            const response = await axios.post(backend_url, {
                email,
                password,
            });


            if (response.status === 200) {
                const token = response.data.token;

                // Save token to AsyncStorage
                await AsyncStorage.setItem('token', token);
                navigation.navigate('DrawerNavigator'); // Navigate to Dashboard
            } 
        } catch (error) {
            // Handle errors specifically
            if (error.response) {
                // Handle 401 status for invalid login
                if (error.response.status === 401 && error.response.data.error === "Invalid email or password") {
                    Alert.alert("Error", "Incorrect email or password. Please try again.", [
                        { text: "OK" },
                    ]);
                } else {
                    // Handle any other backend errors
                    Alert.alert("Error", "An error occurred while logging in. Please try again.");
                }
            } else {
                // Handle network errors or unexpected errors
                console.error("Network error or unexpected issue:", error);
                Alert.alert("Error", "Something went wrong. Please check your connection and try again.");
            }
        }
    };

    // Error: Border
    const getInputStyle = (field) => {
        return {
            ...styles.input,
            borderColor: errors[field] ? Colors.red : Colors.darkBlue,
        };
    };

    // Error: Text
    const getErrorTextStyle = (field) => {
        return {
            color: errors[field] ? Colors.red : 'transparent',
        };
    };

    return (
        <ImageBackground 
            source={require('../assets/login_signup_background.png')}            
            style={styles.background}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>

                    {/* Login Form */}
                    <Text style={styles.title}>Login</Text>

                    {/* Email Input */}
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="email" size={24} style={styles.icon} />
                        <TextInput
                            style={getInputStyle('email')}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            placeholderTextColor={Colors.grey}
                            autoCapitalize="none"
                        />
                        <Text style={getErrorTextStyle('email')}>{errors.email}</Text>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={24} style={styles.icon} />
                        <TextInput
                            style={getInputStyle('password')}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor={Colors.grey}
                        />
                        <Text style={getErrorTextStyle('password')}>{errors.password}</Text>
                    </View>

                    {/* Login Button */}
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>LOGIN</Text>
                    </TouchableOpacity>
                </View>

                {/* Sign up link */}
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signupText}>Don't have an account? Sign Up here</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '90%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        elevation: 5,
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        marginBottom: 20,
        color: Colors.darkBlue,
    },
    inputContainer: {
        position: 'relative',
        width: '100%',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: Colors.darkBlue,
        borderWidth: 2,
        borderRadius: 20,
        marginTop: 10,
        paddingLeft: 40,
    },
    icon: {
        position: 'absolute',
        left: 12,
        top: 22,
        color: Colors.darkBlue,
    },
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.darkBlue,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 22,
    },
    signupText: {
        marginTop: 20,
        color: Colors.darkBlue,
    },
});