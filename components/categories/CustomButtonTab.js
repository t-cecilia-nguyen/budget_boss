import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";


/*This component provide custom button Tab */
const CustomButtonTab = ({ title, selectedButton, setSelectedButton }) => {
  
  return (
 
    <TouchableWithoutFeedback
      onPress={() => {
        setSelectedButton(title);
      }}
    >
     <Text style={styles.buttonText}>{title}</Text>

      <View
        style={[
          styles.button,
          { backgroundColor: selectedButton === title ? "#32659A" : "transparent" },
        ]}
      >
       
      </View>
    </TouchableWithoutFeedback>
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
