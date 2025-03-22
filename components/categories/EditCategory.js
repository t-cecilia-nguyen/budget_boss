import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Constants from "expo-constants";
import axios from "axios";


import IconPicker from "./IconPicker";


const basePath = `${Constants.expoConfig.extra.API_BACKEND_URL}/uploads/`;

const EditCategory = ({ route, navigation }) => {
  const { data, userId, selected , token} = route.params || {};

  // console.log("userid from edit:", userId);
  // console.log("selectedbutton from edit:", selected);
  console.log("token from edit:", token);

  // Initialize state for category fields
  const categoryId = data.category_id;
  const [categoryName, setCategoryName] = useState(data?.name || "");
  const [categoryDescription, setCategoryDescription] = useState(
    data?.description || ""
  );
  const [categoryType, setCategoryType] = useState(data?.type || "Expense"); // Default to 'Expense'
  const [categoryImage, setCategoryImage] = useState(
    data?.img_name || "default.png"
  );


  ////////// update

  useEffect(() => {
    // If data is passed, set the form fields
    if (data) {
      setCategoryName(data.name);
      setCategoryDescription(data.description);
      setCategoryType(data.type);
      setCategoryImage(data.img_name);
    }
  }, [data]);

  const fetchCategories = async () => {
    const url = `${Constants.expoConfig.extra.API_BACKEND_URL}/categories`;

    
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = response.data;

        // Use the base path to construct the image URLs
        const categoriesItems = data.map((item) => ({
            ...item,
            img_url: `${basePath}${item.img_name}`,
          }))

        return categoriesItems;

      } catch {
        (error) => {
          console.error("Error fetching data:", error);
          return [];
        };
      }
  
  };

  // Update Category
  const handleSave = async () => {
    console.log("Category to be updated:", {
      category_id: categoryId,
      userId,
      name: categoryName,
      description: categoryDescription,
      type: categoryType,
      img_name: categoryImage,
    });

    const updatedCategory = {
      category_id: categoryId,
      userId,
      name: categoryName,
      description: categoryDescription,
      type: categoryType,
      img_name: categoryImage && categoryImage !== "" ? categoryImage : "default.png",
    };

    if (!updatedCategory.name || updatedCategory.name.trim() === "") {
      alert("Category name cannot be empty.");
      return;
    }
    try {
      const url = `${Constants.expoConfig.extra.API_BACKEND_URL}/categories/update`;
      const response = await axios.put(url, updatedCategory, {
        method: "PUT",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        }     
      });

      if (response.status === 200) {
        console.log("Category updated successfully:", updatedCategory);
        // Fetch updated categories after editing
        const updatedList = await fetchCategories();

        // Pass updated categories list back to the parent screen
        navigation.navigate("CategoriesList", {
          updatedCategories: updatedList,
          userId,
          selected,
        });
      }
      else if (response.status == 409){
        console.error("Failed to update category:", response.status);
        alert("Failed to save changes. Category name already exists");
      }
      else {
        console.error("Failed to update category:", response.status);
        alert("Failed to save changes. Please try again.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("An error occurred while saving changes. Please try again.");
    }
  };






  
  ////////// Delete Category
  const handleDatabaseDelete = async (categoryId) => {
   
    const url = `${Constants.expoConfig.extra.API_BACKEND_URL}/categories/delete?id=${categoryId}`;

    console.log("token in deleting cat:", token)
    console.log("Category ID being sent:", categoryId);

    if (token) {
      try {
        const response = await axios.delete(url, {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });

        if (response.status === 200) {
          console.log("Category deleted successfully: "+ categoryName);

        } else {
          console.error("Failed to delete category:", response.status);
          alert("Failed to delete category. Please try again.");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("An error occurred while deleting the category. Please try again.");
      }
    }
};
const handleDelete = async (categoryId) => {
  
  Alert.alert(
    "Delete Category",
    "Are you sure you want to delete this category?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          // Perform delete logic
          await handleDatabaseDelete(categoryId);
          const updatedList = await fetchCategories();
          //console.log("Updated list: ", updatedList)
          console.log("Category deleted : "+ categoryName);
          // Pass updated categories list back to the parent screen
          navigation.navigate("CategoriesList", {
            updatedCategories: updatedList,
            userId,
            selected,
          });
        },
      },
    ]
  );
};

// delete Icon
React.useLayoutEffect(() => {
  navigation.setOptions({
    headerRight: () => (
      <TouchableOpacity
        onPress={() => handleDelete(categoryId)}
        style={styles.headerIcon}
      >
        <AntDesign name="delete" size={24} color="red" />
      </TouchableOpacity>
    ),
  });
}, [navigation]);

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
            placeholder="Category Name"
            value={categoryName}
            onChangeText={(text) => setCategoryName(text)}
          />
          {/* category desc */}
          <TextInput
            style={styles.input}
            placeholder="Category Description"
            value={categoryDescription}
            onChangeText={(text) => setCategoryDescription(text)}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text>SAVE</Text>
      </TouchableOpacity>
    </View>
  );
};

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
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  rowBox: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
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
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },

  categoryImage: {
    width: 80,
    height: 80,
  },
  headerIcon: {
    marginRight: 18,
  },
});

export default EditCategory;
