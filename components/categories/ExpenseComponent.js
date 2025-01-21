import { StyleSheet, Text, View, Dimensions, Image, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";


const { width: screenWidth } = Dimensions.get("window");
const basePath = "http://10.0.2.2:5000/uploads/";

const ExpenseComponent = () => {
  
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState();

  const navigation = useNavigation();

  const handleArrowPress = (item) => {
    navigation.navigate("EditCategory", {data: item});
  };




  useEffect(() => {
    fetch("http://10.0.2.2:5000/categories", {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((data) => {
        // Use the base path to construct the image URLs
        const categoriesItems = data
          .map((item) => ({
            ...item,
            img_url: `${basePath}${item.img_name}`,
          }))
          .filter((item) => item.type === "Expense");
        setCategories(categoriesItems);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [newCategory]);

  const renderData = (item) => {
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemInfo}>
          <View style={styles.imageBox}>
            <Image
              style={{ width: 35, height: 35 }}
              resizeMode="center"
              source={{ uri: item.img_url }}
            />
          </View>
          <View style={styles.itemText}>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ color: "grey", fontSize: 12 }}>
              {item.description}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={ () => handleArrowPress(item)}>
          <FontAwesome6 name="greater-than" size={16} color="lightgrey" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.bodyCard}>
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
    width: "100%",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  itemInfo: {
    width: "60%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemText: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "70%",
  },
  imageBox: {
    height: 40,
    width: 40,
  },
});
