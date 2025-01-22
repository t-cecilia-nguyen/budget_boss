import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const RadioButton = () => {
  const [selectedType, setSelectedType] = useState("Expense"); // Default to "Expense"

  const handleSelect = (type) => {
    setSelectedType(type);
  };

  return (
      <View style={styles.radioGroup}>
        <TouchableWithoutFeedback
          style={styles.radioButton}
          onPress={() => handleSelect("Income")}
        >
          <View
            style={[
              styles.outerCircle,
              selectedType === "Income" && styles.selectedOuterCircle,
            ]}
          >
            {selectedType === "Income" && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.radioLabel}>Income</Text>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          style={styles.radioButton}
          onPress={() => handleSelect("Expense")}
        >
          <View
            style={[
              styles.outerCircle,
              selectedType === "Expense" && styles.selectedOuterCircle,
            ]}
          >
            {selectedType === "Expense" && <View style={styles.innerCircle} />}
          </View>
          <Text style={styles.radioLabel}>Expense</Text>
        </TouchableWithoutFeedback>
      </View>
      
  );
};

const styles = StyleSheet.create({

  label: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: "bold",
  },
  radioGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
    marginBottom: 20,
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  selectedOuterCircle: {
    borderColor: "#90be6d",
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: "#90be6d",
  },
  radioLabel: {
    fontSize: 16,
  },
  selectedText: {
    fontSize: 16,
    color: "gray",
    marginTop: 10,
  },
});

export default RadioButton;
