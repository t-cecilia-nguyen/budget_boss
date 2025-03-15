import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Colors } from '../assets/colors';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import axios from 'axios';

export default function SignUpScreen({ navigation }) {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Error states for each field
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // Regular expressions for email and password validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    // Validate inputs
    const validateInputs = () => {
        let isValid = true;
        let tempErrors = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

        // Check if fields are empty
        if (!firstName) {
            tempErrors.firstName = 'First name is required';
            isValid = false;
        }
        if (!lastName) {
            tempErrors.lastName = 'Last name is required';
            isValid = false;
        }
        if (!email) {
            tempErrors.email = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(email)) { // Check if email is valid
            tempErrors.email = 'Please enter a valid email';
            isValid = false;
        }
        if (!password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        } else if (!passwordRegex.test(password)) { // Check if password meets requirements
            tempErrors.password = 'Password must be minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number';
            isValid = false;
        }
        if (password !== confirmPassword) { // Check if passwords match
            tempErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }
        
        // Update errors state
        setErrors(tempErrors);
        return isValid;
    };

    // Handle signup
    const handleSignUp = async () => {
        // Validate inputs
        const isValid = validateInputs();
        if (!isValid) return;

        // Backend URL
        const backend_url = `${Constants.expoConfig.extra.API_BACKEND_URL}/auth/signup`;
        try {
            // Send POST request to signup
            const response = await axios.post(backend_url, {
                firstName,
                lastName,
                email,
                password,
            });

            if (response.data.error) {
                // Display error message
                Alert.alert("Error", response.data.error);
            } else {
                Alert.alert("Success", "User created successfully!");
                navigation.navigate('Login'); // Navigate to Login
            }
        } catch (error) {
            // Display error message
            console.error('Error during signup:', error);
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

                    {/* SignUp Title */}
                    <Text style={styles.title}>SignUp</Text>

                    {/* First Name */}
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="person" size={24} style={styles.icon}/>
                        <TextInput
                            style={getInputStyle('firstName')}
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholderTextColor={Colors.grey}
                        />
                        <Text style={getErrorTextStyle('firstName')}>{errors.firstName}</Text>
                    </View>

                    {/* Last Name */}
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="person" size={24} style={styles.icon}/>
                        <TextInput
                            style={getInputStyle('lastName')}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                            placeholderTextColor={Colors.grey}
                        />
                        <Text style={getErrorTextStyle('lastName')}>{errors.lastName}</Text>
                    </View>

                    {/* Email */}
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="email" size={24} style={styles.icon}/>
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

                    {/* Password */}
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={24} style={styles.icon}/>
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

                    {/* Confirm Password */}
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={24} style={styles.icon}/>
                        <TextInput
                            style={getInputStyle('confirmPassword')}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            placeholderTextColor={Colors.grey}
                        />
                        <Text style={getErrorTextStyle('confirmPassword')}>{errors.confirmPassword}</Text>
                    </View>

                    {/* SignUp Button */}
                    <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
                        <Text style={styles.signupButtonText}>SIGNUP</Text>
                    </TouchableOpacity>
                </View>

                {/* Login Link */}
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Already have an account? Login here</Text>
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
    signupButton: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.darkBlue,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    signupButtonText: {
        color: '#FFFFFF',
        fontSize: 22,
    },
    loginText: {
        marginTop: 20,
        color: Colors.darkBlue,
    },
});