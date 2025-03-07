import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import axios from 'axios';
import { Colors } from '../assets/colors';
import { MaterialIcons } from '@expo/vector-icons';

const MyAccountScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        const fetchUserData = async () => { 
            const token = await AsyncStorage.getItem('token');
            const backendUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`;

            try {
                const response = await axios.get(backendUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const data = response.data;

                if (response.status === 200) {
                    setUserData(data);
                    setFirstName(data.firstName);
                    setLastName(data.lastName);
                    setEmail(data.email);
                } else {
                    Alert.alert('Error', data.message || 'Failed to fetch user data.');
                }
            } catch (error) {
                Alert.alert('Error', 'Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        if (!firstName || !lastName || !email) {
            Alert.alert('Error', 'All fields are required!');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]+$/;

        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('token');
            const backendUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`;

            const response = await axios.put(backendUrl, {
                firstName,
                lastName,
                email,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                Alert.alert('Success', 'Profile updated successfully!');
                navigation.reset({ // Update the user data in drawer
                    index: 0,
                    routes: [{ name: 'DrawerNavigator' }],
                });
                
            } else {
                Alert.alert('Error', response.data.message || 'Failed to update profile.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            {/* First Name */}
            <Text style={styles.label}>First Name</Text>
            <View style={styles.inputContainer}>
                <MaterialIcons name="person" size={24} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter first name"
                    value={firstName}
                    onChangeText={setFirstName}
                />
            </View>

            {/* Last Name */}
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.inputContainer}>
                <MaterialIcons name="person" size={24} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter last name"
                    value={lastName}
                    onChangeText={setLastName}
                />
            </View>

            {/* Email */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
                <MaterialIcons name="email" size={24} style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* Save */}
            <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                <Text style={styles.buttonText}>SAVE</Text>
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
        fontWeight: '600',
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        backgroundColor: '#FFF',
        marginBottom: 15,
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
    button: {
        backgroundColor: Colors.primaryBlue,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default MyAccountScreen;
