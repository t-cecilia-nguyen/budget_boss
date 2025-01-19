import { StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const { width: screenWidth } = Dimensions.get("window");

const ExpenseComponent = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://10.0.2.2:5000/categories", {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((data) => {
        setCategories(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const renderData = (item) => {
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemInfo}>
          <View style={styles.imageBox}></View>
          <View style={styles.itemText}>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ color: "grey" }}>{item.description}</Text>
          </View>
        </View>
        <FontAwesome6 name="greater-than" size={16} color="lightgrey" />
      </View>
    );
  };

  return (
    <View style={styles.bodyCard}>
      <Text>ExpenseComponent</Text>
      <FlatList
        data={categories}
        renderItem={({ item }) => {
          return renderData(item);
        }}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default ExpenseComponent;

const styles = StyleSheet.create({
  bodyCard: {
    width: screenWidth - 20,
    height: 500,
    marginVertical: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  itemInfo: {
    borderWidth: 1,
    borderColor: "pink",
    width: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemText: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  imageBox: {
    height: 40,
    width: 40,
    borderWidth: 1,
  },
});
