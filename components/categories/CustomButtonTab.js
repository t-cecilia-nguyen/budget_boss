import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const CustomButtonTab = ({ title, selectedButton, setSelectedButton }) => {
  return (
    <View>
      <Text style={styles.buttonText}>{title}</Text>
      <TouchableWithoutFeedback
        style={[
          styles.button,
          {
            backgroundColor: selectedButton === title ? "#32659A" : "",
          },
        ]}
        onPress={() => {
          setSelectedButton(title);
        }}
      />
    </View>
  );
};

export default CustomButtonTab;

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 8,
    flexShrink: 0,
    borderRadius: 4,
    backgroundColor: "#32659A",
    zIndex: 1, // Keep buttons above the line

  },
  buttonText: {
    paddingLeft: 20,
    color: "black",
    fontWeight: "bold",
  },
});
