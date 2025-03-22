import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import Constants from "expo-constants";


const { width: screenWidth } = Dimensions.get("window");
const basePath = `${Constants.expoConfig.extra.API_BACKEND_URL}/uploads/`;

/* This component filters out Income categories list*/

const IncomeComponent = ({selected,userId, token, updatedCategories}) => {
  const [categories, setCategories] = useState([]);

  //console.log("token recieved from parent categories component: ", token)
  const navigation = useNavigation();


  const handleEditPress = (item) => {
    navigation.navigate("EditCategory", { data: item, userId , selected, token}); 
  };


  const fetchCategories = async () => {
    const url = `${Constants.expoConfig.extra.API_BACKEND_URL}/categories`;

    if (token) {
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = response.data;

        //console.log("Data: ", data)
        if (!Array.isArray(data)) {
          console.error("Error: API response is not an array!", data);
          return;
        }
        // Use the base path to construct the image URLs
        const categoriesItems = data.map((item) => ({
            ...item,
            img_url: `${basePath}${item.img_name}`,
          }))
          .filter((item) => item.type === "Income");

        setCategories(categoriesItems);
      } catch {
        (error) => {
          console.error("Error fetching data:", error);
        };
      }
    } else{
      console.error("No token..");
    }
  };
  useEffect(() => {
    try {
      if (updatedCategories) {
        // Filter updatedCategories to only include 'Income' types
        const incomeCategories = updatedCategories.filter(
          (category) => category.type === "Income"
        );
        setCategories(incomeCategories); 
      } else {
        fetchCategories();
      }
    } catch (error) {
      console.log("Error fetching income categories:", error);
    }
  }, [updatedCategories]);
  

  const renderData = (item) => {
    return (
      <TouchableOpacity onPress={() => handleEditPress(item)}>
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

          <FontAwesome6 name="greater-than" size={16} color="lightgrey" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.bodyCard}>
      <FlatList
        data={categories}
        renderItem={({ item }) => {
          return renderData(item);
        }}
        keyExtractor={(item) => item.category_id}
      />
    </View>
  );
};

export default IncomeComponent;

const styles = StyleSheet.create({
  bodyCard: {
    width: screenWidth - 20,
    height: 550,
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
    height: 30,
    width: 30,
  },
});
