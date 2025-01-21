import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";

import HorizontalLine from "../components/categories/HorizontalLine";
import CustomButtonTab from "../components/categories/CustomButtonTab";
import ExpenseComponent from "../components/categories/ExpenseComponent";
import IncomeComponent from "../components/categories/IncomeComponent";
import NeedHelp from "../components/categories/NeedHelp";


const { width: screenWidth } = Dimensions.get("window");

const CategoriesScreen = () => {

  const navigation = useNavigation();

  const [selectedButton, setSelectedButton] = useState("Expense");

  const handleCreatePress = () => {
    navigation.navigate("CreateCategory", { type: selectedButton });
  };
  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <View style={styles.headerTab}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              paddingVertical: 0,
              paddingHorizontal: 0,
              zIndex: 1,
            }}
          >
            <CustomButtonTab
              title="Expense"
              selectedButton={selectedButton}
              setSelectedButton={setSelectedButton}
            />
            <CustomButtonTab
              title="Income"
              selectedButton={selectedButton}
              setSelectedButton={setSelectedButton}
            />
          </View>
          <HorizontalLine />
        </View>

        <TouchableOpacity
          onPress={handleCreatePress}
        >
          <View style={styles.addButtonContainer}>
            {/* add new category button */}
            <Feather name="plus-circle" size={34} color="#277da1" />
            <Text
              style={{
                color: "#277da1",
                fontSize: 20,
                fontWeight: "bold",
                paddingLeft: 15,
              }}
            >
              ADD NEW CATEGORY
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyCard}>
      
          {selectedButton === "Expense" && <ExpenseComponent />}
          {selectedButton === "Income" && <IncomeComponent />}
        
      
      </View>
      <NeedHelp/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerTab: {
    marginTop: 10,
    marginBottom: 10,
    position: "relative",
    width: "90%",
  },
  addButtonContainer: {
    height: 50,
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  headerCard: {
    width: screenWidth - 20,
    height: 100,
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

  cardText: {
    color: "#277da1",
    fontSize: 16,
    fontWeight: "bold",
    padding: 15,
    position: "absolute",
    top: 10,
    left: 10,
  },
  needHelpBox: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 20,
  },
});

export default CategoriesScreen;
