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

const basePath = "http://10.0.2.2:5000/uploads/";

const EditCategory = ({ route, navigation }) => {
  const { data } = route.params || {};

  // Initialize state for category fields
  const categoryId = data.id;
  const [categoryName, setCategoryName] = useState(data?.name || "");
  const [categoryDescription, setCategoryDescription] = useState(
    data?.description || ""
  );
  const [categoryType, setCategoryType] = useState(data?.type || "Expense"); // Default to 'Expense'
  const [categoryImage, setCategoryImage] = useState(
    data?.img_name || "default.png"
  );

  ////////// Delete
  const handleDatabaseDelete = async (categoryId) => {
    try {
      const response = await fetch("http://10.0.2.2:5000/categories/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: categoryId }),
      });

      if (response.ok) {
        console.log("Category deleted successfully: "+ categoryName);

      } else {
        console.error("Failed to delete category:", response.status);
        alert("Failed to delete category. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("An error occurred while deleting the category. Please try again.");
    }
  };
  const handleDelete = async (categoryId) => {
    const updatedList = await fetchCategories();
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
          onPress: () => {
            // Perform delete logic
            // Fetch the updated categories list
            handleDatabaseDelete(categoryId);
            console.log("Category deleted : "+ categoryName);
            // Pass updated categories list back to the parent screen
            navigation.navigate("CategoriesList", {
              updatedCategories: updatedList,
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

  //////////

  useEffect(() => {
    // If data is passed, set the form fields
    if (data) {
      setCategoryName(data.name);
      setCategoryDescription(data.description);
      setCategoryType(data.type);
      setCategoryImage(data.img_name);
    }
  }, [data]);

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
  //
  const handleSave = async () => {
    console.log("Category to be updated:", {
      id: categoryId,
      name: categoryName,
      description: categoryDescription,
      type: categoryType,
      img_name: categoryImage,
    });

    //@TODO: SAVE TO DATABASE

    const updatedCategory = {
      id: categoryId,
      name: categoryName,
      description: categoryDescription,
      type: categoryType,
      img_name: categoryImage,
    };

    try {
      const response = await fetch("http://10.0.2.2:5000/categories/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCategory),
      });

      if (response.ok) {
        console.log("Category updated successfully:", updatedCategory);
        // Fetch updated categories after editing
        const updatedList = await fetchCategories();

        // Pass updated categories list back to the parent screen
        navigation.navigate("CategoriesList", {
          updatedCategories: updatedList,
        });
      } else {
        console.error("Failed to update category:", response.status);
        alert("Failed to save changes. Please try again.");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("An error occurred while saving changes. Please try again.");
    }
    navigation.navigate("CategoriesList", {
      updatedCategories: newCategoriesList,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowBox}>
        <View style={styles.imageBox}>
          {/* image */}
          {categoryImage ? (
            <Image
              style={styles.categoryImage}
              source={{ uri: `${basePath}${categoryImage}` }}
              resizeMode="center"
            />
          ) : (
            <Image
              style={styles.categoryImage}
              source={require("../../assets/categories/default.png")}
              resizeMode="center"
            />
          )}
        </View>
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
