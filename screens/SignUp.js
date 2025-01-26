import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Alert } from 'react-native';
import { Colors } from '../assets/colors';
import { MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

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

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    const validateInputs = () => {
        let isValid = true;
        let tempErrors = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

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
        } else if (!emailRegex.test(email)) {
            tempErrors.email = 'Please enter a valid email';
            isValid = false;
        }
        if (!password) {
            tempErrors.password = 'Password is required';
            isValid = false;
        } else if (!passwordRegex.test(password)) {
            tempErrors.password = 'Password must be minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter and 1 number';
            isValid = false;
        }
        if (password !== confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }
        
        setErrors(tempErrors);
        return isValid;
    };

    const handleSignUp = async () => {
        // Validate inputs
        const isValid = validateInputs();
        if (!isValid) return;

        const backend_url = `${Constants.expoConfig.extra.API_BACKEND_URL}/auth/signup`;
        try {
            const response = await fetch(backend_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password,
                }),
            });

            const data = await response.json();
            console.log('Response:', data);
            if (data.error) {
                Alert.alert("Error", data.error);
            } else {
                Alert.alert("Success", "User created successfully!");
                navigation.navigate('Login'); // Navigate to Login
            }
        } catch (error) {
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
                    <Text style={styles.title}>SignUp</Text>
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
                    <TouchableOpacity style={styles.signupButton} onPress={handleSignUp}>
                        <Text style={styles.signupButtonText}>SIGNUP</Text>
                    </TouchableOpacity>
                </View>
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