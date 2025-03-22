import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RadioButton from "./RadioButton";
import IconPicker from "./IconPicker";
import Constants from "expo-constants";


const basePath = `${Constants.expoConfig.extra.API_BACKEND_URL}/uploads/`;

const CreateCategory = ({ navigation, route }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryType, setCategoryType] = useState("Expense"); // default is Expense
  const [categoryImage, setCategoryImage] = useState("");
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const { selected } = route.params || {};

  /* Get user by received token */
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (!storedToken) {
          console.log("No token could be found.");
          return;
        }
        setToken(storedToken);
        console.log("Retrieved token in create:", storedToken);

        const userUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`;
        const response = await axios.get(userUrl, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.status === 200) {
          setUserId(response.data.id);
        } else {
          console.error("Failed to fetch user info:", response.statusText);
        }
      } catch (error) {
        console.error("Error retrieving user info:", error);
      }
    };

    getUserId();
  }, []);

  /* Get categories list after setting token */
  const fetchCategories = async () => {
    const url = `${Constants.expoConfig.extra.API_BACKEND_URL}/categories`;

    if (token) {
      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!Array.isArray(response.data)) {
          console.error("Error: API response is not an array!", response.data);
          return;
        }

        const categoriesItems = response.data.map((item) => ({
          ...item,
          img_url: `${basePath}${item.img_name}`,
        }));

        return categoriesItems;
      } catch (error) {
        console.error("Error fetching data:", error);
        return [];
      }
    } else {
      console.error("No token found");
    }
  };


  /* Function handle create and saving new category */
  const handleCreateCategory = async (newCategory) => {
    if (!newCategory.name || newCategory.name.trim() === "") {
      alert("Category name cannot be empty.");
      return;
    }
    if (token) {
      try {
        const response = await axios.post(`${Constants.expoConfig.extra.API_BACKEND_URL}/categories/create`, newCategory, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 201 || response.status === 200 ) {
          console.log("Category created successfully:", newCategory.categoryName);

          const updatedList = await fetchCategories();
          navigation.navigate("CategoriesList", {
            updatedCategories: updatedList,
            userId,
            selected,
          });
        } else if (response.status === 409) {
          console.error("Failed to create category:", response.status);
          alert("Failed to create category. Category name already exists.");
        } else {
          console.error("Failed to create category:", response.status);
          alert("Failed to create category. Please try again.");
        }
      } catch (error) {
        console.error("Error creating category:", error);
        alert("An error occurred while creating the category. Please try again.");
      }
    }
  };

  /* Function handle saving new data */
  const handleSave = () => {
    const newCategory = {
      name: categoryName,
      description: categoryDescription,
      type: categoryType,
      img_name: categoryImage && categoryImage !== "" ? categoryImage : "default.png",
      user_id: userId,
    };

    handleCreateCategory(newCategory);
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowBox}>
        <IconPicker
          categoryImage={categoryImage}
          basePath={basePath}
          onImageSelect={(selectedImage) => setCategoryImage(selectedImage)}
        />
        <View style={styles.infoBox}>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={categoryName}
            onChangeText={(text) => setCategoryName(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Description"
            value={categoryDescription}
            onChangeText={(text) => setCategoryDescription(text)}
          />
        </View>
      </View>

      <RadioButton
        selectedValue={categoryType}
        onValueChange={(value) => setCategoryType(value)}
        options={[
          { label: "Income", value: "Income" },
          { label: "Expense", value: "Expense" },
        ]}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>SAVE</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateCategory;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rowBox: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
    marginBottom: 20,
    paddingLeft: 10,
    paddingBottom: 5,
  },
  imageBox: {
    width: "30%",
    height: "90%",
    padding: 10,
  },
  infoBox: {
    width: "70%",
  },
  categoryImage: {
    width: 80,
    height: 80,
  },
  radioButton: {},
});
