import React, { useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  Text,
  StyleSheet,
} from "react-native";

const ICONS = [
    "salary.png",
    "investment.png",
    "savings.png",
    "freelance.png",
    "bonus.png",
    "food.png",
    "transport.png",
    "utilities.png",
    "rent.png",
    "groceries.png",
    "entertainment.png",
    "healthcare.png",
    "education.png",
    "clothing.png",
    "subscriptions.png",
    "gifts.png",
    "travel.png",
    "vacation.png",
    "insurance.png",
    "mobile.png",
    "internet.png",
    "sports.png",
    "others.png"
  ];
  

const IconPicker = ({ categoryImage, basePath, onImageSelect }) => {
  const [selectedIcon, setSelectedIcon] = useState(categoryImage || "default.png");
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectIcon = (iconName) => {
    setSelectedIcon(iconName);
    onImageSelect(iconName); // Pass the selected image back to CreateCategory
    setModalVisible(false);
  };

  return (
    <View style={styles.imageBox}>
      {/* Show either the selected icon or the default image */}
      {selectedIcon && ICONS.includes(selectedIcon) ? (
        <Image
          style={styles.categoryImage}
          source={{ uri: `${basePath}${selectedIcon}` }}
          resizeMode="center"
        />
      ) : (
        <Image
          style={styles.categoryImage}
          source={
            categoryImage
              ? { uri: `${basePath}${categoryImage}` }
              : require("../../assets/categories/default.png")
          }
          resizeMode="center"
        />
      )}

      {/* Edit Icon (Opens Modal) */}
      <TouchableOpacity style={styles.editIcon} onPress={() => setModalVisible(true)}>
        <Image
          source={require("../../assets/categories/edit-pencil.png")} 
          style={{ width: 20, height: 20 }}
        />
      </TouchableOpacity>

      {/* Icon Picker Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Pick an Icon</Text>
            <FlatList
              data={ICONS}
              numColumns={4}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.iconItem} onPress={() => handleSelectIcon(item)}>
                  <Image
                    source={{ uri: `${basePath}${item}` }}
                    style={{ width: 40, height: 40 }}
                  />
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  imageBox: {
    position: "relative",
    width: "30%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 5,
  },
  categoryImage: {
    width: "90%",
    height: "90%",
  },
  editIcon: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 8,
    borderRadius: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  iconItem: {
    margin: 10,
    padding: 10,
  },
  closeText: {
    marginTop: 10,
    color: "blue",
  },
});

export default IconPicker;
