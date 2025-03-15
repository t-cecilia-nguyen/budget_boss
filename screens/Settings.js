import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Colors } from '../assets/colors';
import { useNavigation } from '@react-navigation/native';

export default function Settings() {
    const [isEnabled, setIsEnabled] = useState(false);
    const navigation = useNavigation();
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>
            
            {/* Account section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.titleText}>ACCOUNT</Text>
                <TouchableOpacity style={styles.textContainer} onPress={() => navigation.navigate('LoginSecurity')}>
                    <Text style={styles.text}>Login and Security</Text>
                </TouchableOpacity>
            </View>

            {/* General section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.titleText}>GENERAL</Text>
                <View style={styles.toggleContainer}>
                    <Text style={styles.text}>Notifications</Text>
                    <Switch
                        trackColor={{ false: '#767577', true: Colors.lightBlue }} 
                        thumbColor={isEnabled ? '#FFFFFF' : '#F4F3F4'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
            </View>

            {/* Feedback section */}
            <View style={styles.sectionContainer}>
                <Text style={styles.titleText}>FEEDBACK</Text>

                <TouchableOpacity style={styles.textContainer} onPress={() => navigation.navigate('HelpSupport')}>
                    <Text style={styles.text}>Help and Support</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.textContainer} onPress={() => navigation.navigate('ContactUs')}>
                    <Text style={styles.text}>Contact Us</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.textContainer} onPress={() => navigation.navigate('SubmitFeedback')}>
                    <Text style={styles.text}>Submit Feedback</Text>
                </TouchableOpacity>
            </View>

            {/* Empty section for spacing */}
            <View style={styles.emptySection}></View>

            {/* Delete Account button */}
            <TouchableOpacity style={styles.deleteContainer} onPress={() => navigation.navigate('SubmitFeedback')}>
                <Text style={[styles.text, styles.textDelete]}>Delete Account</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.primaryBlue,
        textAlign: 'center',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.darkBlue,
        marginBottom: 10,
        marginTop: 20,
    },
    toggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3',
        paddingBottom: 5,
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'left',
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3',
        paddingBottom: 10,
    },
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
    emptySection: {
        flex: 1,
    },
});