import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';



import HorizontalLine from "../components/categories/HorizontalLine";
import CustomButtonTab from "../components/categories/CustomButtonTab";
import ExpenseComponent from "../components/categories/ExpenseComponent ";
import IncomeComponent from "../co/categories/IncomeComponent";


const CategoriesScreen = () => {

    //fetch categories
    useEffect()



    const [selectedButton, setSelectedButton] = useState("Expense");

    return (
      <View style={styles.container}>
        <View style={styles.headerTab}>
          <View
            style={{
              flexDirection: "row",
              width: "60%",
              justifyContent: "space-around",
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
  
        {selectedButton === "Expense" && 
          <ExpenseComponent 
            
          />}
        {selectedButton === "Income" &&
         <IncomeComponent 
            
  
         />}
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
    },
  });
  


export default CategoriesScreen;
