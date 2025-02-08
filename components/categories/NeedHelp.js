import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useNavigation } from "@react-navigation/native";

export default function NeedHelp() {
  const navigation = useNavigation();
  //Navigate help to settings screen
  return (
    <View style={styles.needHelpBox}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Settings")}
      >
        <Text style={styles.text}>Need Help?</Text>
        <Ionicons name="information-circle-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  needHelpBox: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  text: {
    marginRight: 5,
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
  },
});
