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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

import HorizontalLine from "../components/categories/HorizontalLine";
import CustomButtonTab from "../components/categories/CustomButtonTab";
import ExpenseComponent from "../components/categories/ExpenseComponent";
import IncomeComponent from "../components/categories/IncomeComponent";
import NeedHelp from "../components/categories/NeedHelp";


const { width: screenWidth } = Dimensions.get("window");
const basePath = "http://10.0.2.2:5000/uploads/";

const CategoriesScreen = ({route}) => {

  const [userId, setUserId] = useState(null);
  const [selectedButton, setSelectedButton] = useState("Expense");
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const {user_Id, selected, updatedCategories } = route.params || {};


  useEffect(() => {
    if (selected === "Income") {
      setSelectedButton("Income");
    } else {
      setSelectedButton("Expense");
    }
  }, [selected]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const backendUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`;

        if (token) {
          const response = await fetch(backendUrl, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            const data = await response.json();
            console.log("User data: ", data);
            setUserId(data.id);
    
          } else {
            console.error("Failed to fetch user info:", response.statusText);
          }
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUser();
  }, [user_Id]);

  const handleCreatePress = () => {
    navigation.navigate("CreateCategory", { userId: userId, selected: selectedButton });
  };



  const fetchCategories = () => {
    fetch("http://10.0.2.2:5000/categories", {
      method: "GET",
    })
      .then((resp) => resp.json())
      .then((data) => {
        // Use the base path to construct the image URLs
        const categoriesItems = data
          .map((item) => ({
            ...item,
            img_url: `${basePath}${item.img_name}`,
          }))
          .filter((item) => item.type === "Expense");
        setCategories(categoriesItems);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }

  
    useEffect(() => {
     // If we received the updated categories list, set it
     if (route.params?.updatedCategories) {
      setCategories(route.params.updatedCategories);
    } else {
      // Otherwise, fetch the categories again (for initial load)
      fetchCategories(); 
    }
  }, [updatedCategories]);
  
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
      
          {selectedButton === "Expense" && <ExpenseComponent selected="Expense" userId={userId}/>}
          {selectedButton === "Income" && <IncomeComponent selected="Income" userId={userId}/>}
        
      
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
