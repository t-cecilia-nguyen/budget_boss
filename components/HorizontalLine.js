import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";


/* This component provides a custom line*/
const HorizontalLine = ({ width = "100%", style }) => {
  return <View style={[{ width }, styles.line, style]} />;
};

export default HorizontalLine;

const styles = StyleSheet.create({
  line: {
    height: 1,
    borderRadius: 10,
    backgroundColor: "lightgrey",
    position: "absolute",
    bottom: 0, 
    left: 0,
    right: 0,
    height: 5, 
    zIndex: 0,
  },
});
