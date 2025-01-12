import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SignOutScreen = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>SignOut Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center', 
        alignItems: 'center',     
    }
});

export default SignOutScreen;
