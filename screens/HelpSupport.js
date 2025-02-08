import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HelpSupportScreen = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>HelpSupport Screen</Text>
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

export default HelpSupportScreen;
