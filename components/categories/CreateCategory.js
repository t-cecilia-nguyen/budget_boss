import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";

import RadioButton from "./RadioButton";
import IconPicker from "./IconPicker";


const basePath = "http://10.0.2.2:5000/uploads/";

const CreateCategory = ({ navigation, route  }) => {
  // Initialize state for category fields (empty for new category)
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categoryType, setCategoryType] = useState("Expense"); //default is Expense
  const [categoryImage, setCategoryImage] = useState("");

  const { userId, selected } = route.params || {};

  // console.log("userid from create:", userId);
  // console.log("selectedbutton from create:", selected);

  /////
 // Fetch categories after updating one
 const fetchCategories = async () => {
  try {
    const response = await fetch("http://10.0.2.2:5000/categories");
    const data = await response.json();
    return data; // Return the updated list of categories
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

/// CREATE NEW CATGORY /////

  const handleCreateCategory = async (newCategory) => {
    try {
      const response = await fetch("http://10.0.2.2:5000/categories/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCategory),
      });
  
      if (response.ok) {
        console.log("Category created successfully: "+ newCategory.categoryName);
  
        // Fetch the updated categories list
        const updatedList = await fetchCategories();
        // Navigate back to CategoriesList with the updated list
        navigation.navigate("CategoriesList", {
          updatedCategories: updatedList,
          userId,
          selected,
        });      
      } 
      else if (response.status == 409){
        console.error("Failed to create category:", response.status);
        alert("Failed to create category. Category name already exists");
      }
      else {
        console.error("Failed to create category:", response.status);
        alert("Failed to create category. Please try again.");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      alert("An error occurred while creating the category. Please try again.");
    }
  };
  


  const handleSave = () => {
    console.log("New category to be created:", {
      name: categoryName,
      description: categoryDescription,
      type: categoryType,
      img_name: categoryImage && categoryImage !== "" ? categoryImage : "default.png",
      userId,
    });

    
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
          {/* category name */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={categoryName}
            onChangeText={(text) => setCategoryName(text)}
          />
          {/* category description */}
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
        onValueChange={(value) => setCategoryType(value)} // Update categoryType
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
    marginTop: 20, //  space between the button and input fields
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
