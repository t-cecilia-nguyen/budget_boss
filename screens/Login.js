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

    const handleLogin = async () => {
        // Validate inputs
        const isValid = validateInputs();
        if (!isValid) return;

        const backend_url = `${Constants.expoConfig.extra.API_BACKEND_URL}/auth/login`;
        console.log('Backend URL:', backend_url);

        try {
            const response = await axios.post(backend_url, {
                email,
                password,
            });

            if (response.status === 200) {
                const token = response.data.token;
                // Save token to AsyncStorage
                await AsyncStorage.setItem('token', token);
                console.log('Token saved:', token);
                navigation.navigate('DrawerNavigator'); // Navigate to Dashboard
            } else {
                Alert.alert("Error", "An error occurred while logging in. Please try again.");
                console.error('Login failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during login:', error);
            Alert.alert("Error", "An error occurred while logging in. Please try again.");
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
                    <Text style={styles.title}>Login</Text>
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
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>LOGIN</Text>
                    </TouchableOpacity>
                </View>
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