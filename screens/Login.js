import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground  } from 'react-native';
import { Colors } from '../assets/colors';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Credentials for testing
    const testEmail = 'email@gmail.com';
    const testPassword = 'password';

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Login Failed', 'Both fields are required');
            return;
        }

        if (email === testEmail && password === testPassword) {
            navigation.replace('DrawerNavigator');
        } else {
            Alert.alert('Login Failed', 'Incorrect email or password');
        }
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
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>LOGIN</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                        <Text style={styles.link}>Not yet registered? SignUp now</Text>
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
    loginButton: {
        width: '100%',
        height: 50,
        backgroundColor: Colors.darkBlue,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 22,

    },
    link: {
        marginTop: 20,
        color: Colors.darkBlue,
    },
});