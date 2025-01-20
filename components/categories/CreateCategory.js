import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CreateCategory = () => {



    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);
      
        try {
          const response = await fetch('http://10.0.2.2:5000/upload', {
            method: 'POST',
            body: formData,
          });
      
          const data = await response.json();
          console.log('Upload response:', data);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };
      
      // Example usage
      const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          uploadImage(file);
        }
      };
      
  return (
    <View>
      <Text>CreateCategory</Text>
    </View>
  )
}

export default CreateCategory

const styles = StyleSheet.create({})