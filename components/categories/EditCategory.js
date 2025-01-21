import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Image } from "react-native";

const basePath = "http://10.0.2.2:5000/uploads/"; // Adjust base URL to your server path

const EditCategory = ({ route, navigation }) => {
  const { data } = route.params || {};

  // Initialize state for category fields
  const [categoryName, setCategoryName] = useState(data?.name || '');
  const [categoryDescription, setCategoryDescription] = useState(data?.description || '');
  const [categoryType, setCategoryType] = useState(data?.type || 'Expense'); // Default to 'Expense'
  const [categoryImage, setCategoryImage] = useState(data?.img_name || 'default.png');

  useEffect(() => {
    // If data is passed, set the form fields
    if (data) {
      setCategoryName(data.name);
      setCategoryDescription(data.description);
      setCategoryType(data.type);
      setCategoryImage(data.img_name); 
    }
  }, [data]);

  const handleSave = () => {
    console.log("Category updated:", {
      name: categoryName,
      description: categoryDescription,
      type: categoryType,
      img_name: categoryImage,
    });

    //@TODO: SAVE TO DATABASE

    // naviate back or to another screen after saving
    navigation.goBack();
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
{/* category desc */}
      <TextInput
        style={styles.input}
        placeholder="Category Description"
        value={categoryDescription}
        onChangeText={(text) => setCategoryDescription(text)}
      />
</View>
</View>   
<TouchableOpacity style={styles.button}  onPress={handleSave} >
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
    color: "#fff",                 // Text color
    fontSize: 16,                  // Font size of the button text
    fontWeight: "bold",            // Make the text bold
  },
 rowBox:{
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
  imageBox:{
    width: '30%',
    height: '90%',
    padding: 10,
  },
  infoBox:{
    width: '70%'
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
});

export default EditCategory;
