import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";

// Prevetn the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const SplashScreenComponent = ({ navigation }) => {
    useEffect(() => {
        const hideSplash = async () => {
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 seconds
        await SplashScreen.hideAsync();
        navigation.replace("Login"); // Navigate to the login screen
        };

        hideSplash();
    }, []);

    return <View style={styles.container} />;
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
});

export default SplashScreenComponent;