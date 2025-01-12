import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BudgetScreen = () => {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>Budget Screen</Text>
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

export default BudgetScreen;
