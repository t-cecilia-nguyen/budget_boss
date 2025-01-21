
import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from "react-native";

const basePath = "http://10.0.2.2:5000/uploads/"; 

const CreateCategory = ({ navigation }) => {
  // Initialize state for category fields (empty for new category)
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryType, setCategoryType] = useState('Expense'); // Default to 'Expense'
  const [categoryImage, setCategoryImage] = useState('default.png');
  const [newCategory, setNewCategory] = useState(false);

  //////////

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://10.0.2.2:5000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload response:", data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

///////////

  const handleSave = () => {
    console.log("New category created:", {
      name: categoryName,
      description: categoryDescription,
      type: categoryType,
      img_name: categoryImage,
    });

    //@TODO: SAVE TO DATABASE
    // Navigate back or to another screen after saving
    setNewCategory(true)
    navigation.goBack( {newCtegory});
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
              source={require('../../assets/categories/default.png')}
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
          {/* category description */}
          <TextInput
            style={styles.input}
            placeholder="Category Description"
            value={categoryDescription}
            onChangeText={(text) => setCategoryDescription(text)}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>SAVE</Text>
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
    marginTop: 20,                 //  space between the button and input fields
  },
  buttonText: {
    color: "#fff",                 
    fontSize: 16,                  
    fontWeight: "bold",            
  },
  rowBox: {
    flexDirection: 'row',
    width: '100%',
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
    width: '30%',
    height: '90%',
    padding: 10,
  },
  infoBox: {
    width: '70%',
  },
  categoryImage: {
    width: 80,
    height: 80,
  },
});




export default CreateCategory;

