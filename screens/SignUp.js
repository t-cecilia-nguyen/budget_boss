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

    const handleSignUp = async () => {
        const backend_url = `${Constants.expoConfig.extra.API_BACKEND_URL}/signup`;
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
        } catch (error) {
            console.error('Error during signup:', error);
        }
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
                            style={styles.input}
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholderTextColor={Colors.grey}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="person" size={24} style={styles.icon}/>
                        <TextInput
                            style={styles.input}
                            placeholder="Last Name"
                            value={lastName}
                            onChangeText={setLastName}
                            placeholderTextColor={Colors.grey}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="email" size={24} style={styles.icon}/>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            placeholderTextColor={Colors.grey}
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={24} style={styles.icon}/>
                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            placeholderTextColor={Colors.grey}
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <MaterialIcons name="lock" size={24} style={styles.icon}/>
                        <TextInput
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            placeholderTextColor={Colors.grey}
                        />
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
        size: 24,
    },
    signupButton: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.darkBlue,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
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
