import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

/* THis component provide custom radio button */

const RadioButton = ({ selectedValue, onValueChange, options }) => {
  return (
    <View style={{ flexDirection: "row", marginVertical: 8 }}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: 8,
          }}
          onPress={() => onValueChange(option.value)}
        >
          <View
            style={{
              height: 20,
              width: 20,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: "black",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {selectedValue === option.value && (
              <View
                style={{
                  height: 10,
                  width: 10,
                  borderRadius: 5,
                  backgroundColor: "black",
                }}
              />
            )}
          </View>
          <Text style={{ marginLeft: 8 }}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RadioButton;
