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
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

import HorizontalLine from "../components/categories/HorizontalLine";
import CustomButtonTab from "../components/categories/CustomButtonTab";
import ExpenseComponent from "../components/categories/ExpenseComponent";
import IncomeComponent from "../components/categories/IncomeComponent";
import NeedHelp from "../components/categories/NeedHelp";

const { width: screenWidth } = Dimensions.get("window");
const basePath = `${Constants.expoConfig.extra.API_BACKEND_URL}/uploads/`;

const CategoriesScreen = ({ route }) => {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState("");
  const [selectedButton, setSelectedButton] = useState("Expense");
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const { user_Id, selected, updatedCategories } = route.params || {};

  useEffect(() => {
    if (selected === "Income") {
      setSelectedButton("Income");
    } else {
      setSelectedButton("Expense");
    }
  }, [selected]);

  //Retrieve user token to get id
  useEffect(() => {
    const getUserId = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");

        if (!storedToken) {
          console.log("No token could be found.");
          return;
        }
        setToken(storedToken);
        //console.log("Retrieved token:", storedToken)
      } catch (error) {
        console.error("Error retrieving token:", error);
      }

      if (!token) return;
      const userUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`;

      try {
        const response = await axios.get(userUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          const data = await response.data;
          setUserId(data.id);
        } else {
          console.error("Failed to fetch user info:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUserId();
  }, [token]);


  const handleCreatePress = () => {
    navigation.navigate("CreateCategory", {
      userId: userId,
      selected: selectedButton,
      token: token
    });
  };

  
  const fetchCategories = async () => {
    const url = `${Constants.expoConfig.extra.API_BACKEND_URL}/categories`;
    const token = await AsyncStorage.getItem("token");

    if (token) {
      try {
        const response = await axios.get(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = response.data;

        //console.log("Data: ", data)
        if (!Array.isArray(data)) {
          console.error("Error: API response is not an array!", data);
          return;
        }
        // Use the base path to construct the image URLs
        const categoriesItems = data.map((item) => ({
            ...item,
            img_url: `${basePath}${item.img_name}`,
          }))

        setCategories(categoriesItems);

      } catch {
        (error) => {
          console.error("Error fetching data:", error);
        };
      }
    } else{
      console.error("No token");
    }
  };

  useEffect(() => {

    try{
      // If received the updated categories list, set it
      if (updatedCategories) {
        //console.log("setting updatedCategories.....:", updatedCategories)
        setCategories(updatedCategories);
      } else {
        // Otherwise, fetch the categories again (for initial load)
        fetchCategories();
      }
    }
    catch(error){
      console.error("Error fetching categories:", error)
    
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

        <TouchableOpacity onPress={handleCreatePress}>
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
        {selectedButton === "Expense" && (
        <ExpenseComponent selected="Expense" userId={userId} token={token} updatedCategories={categories} />
        )}
        {selectedButton === "Income" && (
        <IncomeComponent selected="Income" userId={userId} token={token} updatedCategories={categories}/>
        )}
      </View>
      <NeedHelp />
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
