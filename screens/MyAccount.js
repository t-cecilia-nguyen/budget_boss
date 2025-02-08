import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import axios from 'axios';

const MyAccountScreen = () => {
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
            } else {
                Alert.alert('Error', response.data.message || 'Failed to update profile.');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#32659A" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Edit Profile</Text>

            {/* First Name Input */}
            <Text style={styles.label}>First Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter first name"
                value={firstName}
                onChangeText={setFirstName}
            />

            {/* Last Name Input */}
            <Text style={styles.label}>Last Name</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter last name"
                value={lastName}
                onChangeText={setLastName}
            />

            {/* Email Input */}
            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            {/* Save Button */}
            <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Save</Text>}
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
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#CCC',
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#FFF',
        marginBottom: 15,
    },
    button: {
        backgroundColor: '#32659A',
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
