import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LoginSecurityScreen = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>LoginSecurity Screen</Text>
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

export default LoginSecurityScreen;
