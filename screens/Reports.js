import React, { useEffect, useState } from "react";
import { View, StyleSheet, Dimensions, ActivityIndicator, Alert } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";

import HorizontalLine from "../components/HorizontalLine";
import CustomButtonTab from "../components/CustomButtonTab";

import ReportThisMonthComponent from "../components/reports/ReportThisMonthComponent";
import ReportPrevMonthComponent from "../components/reports/reportPrevMonthComponent";

const { width: screenWidth } = Dimensions.get("window");

const ReportsScreen = () => {
    const [incomeTransactions, setIncomeTransactions] = useState([]);
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedButton, setSelectedButton] = useState("This Month");
    const [token, setToken] = useState("");

    const fetchTransactions = async (monthOffset = 0) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Error", "User authentication failed.");
                return;
            }

            // Get user ID
            const userResponse = await axios.get(`${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const userId = userResponse.data.id;
            const today = new Date();
            const targetMonth = today.getMonth() + 1 - monthOffset;
            const targetYear = today.getFullYear();

            // Fetch Transactions
            const transactionsResponse = await axios.post(
                `${Constants.expoConfig.extra.API_BACKEND_URL}/transactions/transactions`,
                {
                    user_id: userId,
                    month: targetMonth.toString().padStart(2, "0"),
                    year: targetYear.toString(),
                }
            );

            if (transactionsResponse.data.length === 0) {
              console.log("No transactions found");
              setIncomeTransactions([]); 
              setExpenseTransactions([]);
              return;
          }

            const allTransactions = transactionsResponse.data;
            setIncomeTransactions(allTransactions.filter((txn) => txn.type === "income"));
            setExpenseTransactions(allTransactions.filter((txn) => txn.type === "expense"));
        } catch (error) {
            console.log("Error fetching transactions:", error);

        }
    };

    const fetchBudgets = async (monthOffset = 0) => {
      try {
          if (!token) {
              Alert.alert("Error", "User authentication failed.");
              return;
          }
  
          const today = new Date();
          let targetMonth = today.getMonth() + 1 - monthOffset;
          let targetYear = today.getFullYear();
  
          if (targetMonth <= 0) {
              targetMonth += 12;
              targetYear -= 1;
          }
  
          const formattedMonth = targetMonth.toString().padStart(2, "0");
          const formattedYear = targetYear.toString();
  
          console.log(`Fetching budgets for: ${formattedMonth}-${formattedYear}`);
  
          const response = await axios.get('http://10.0.2.2:5000/budgets/list', {
              headers: { Authorization: `Bearer ${token}` },
              params: { month: formattedMonth, year: formattedYear },
          });
  
          console.log("Budgets API Response:", response.data); 
  

          if (Array.isArray(response.data) && response.data.length > 0) {
              setBudgets(response.data);
          } else {
              console.log("No budgets found.");
              setBudgets([]);
          }
      } catch (error) {
          console.log("Error fetching budgets:", error.response?.data || error);
      }
  };

    const fetchData = async () => {
        setLoading(true);
        const monthOffset = selectedButton === "Prev Month" ? 1 : 0;
        await fetchTransactions(monthOffset);
        await fetchBudgets(monthOffset);
        setLoading(false);
    };

    // Retrieve user token
    useEffect(() => {
      const getUserToken = async () => {
          try {
              const storedToken = await AsyncStorage.getItem("token");
              if (!storedToken) {
                  console.log("No token found.");
                  return;
              }
              setToken(storedToken);
          } catch (error) {
              console.error("Error retrieving token:", error);
          }
      };

        getUserToken();
    }, []);

    // Fetch data when token is available
    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [selectedButton, token]);

    return (
        <View style={styles.container}>
            <View style={styles.headerCard}>
                <View style={styles.headerTab}>
                    <View style={styles.buttonContainer}>
                        <CustomButtonTab
                            title="Prev Month"
                            selectedButton={selectedButton}
                            setSelectedButton={setSelectedButton}
                        />
                        <CustomButtonTab
                            title="This Month"
                            selectedButton={selectedButton}
                            setSelectedButton={setSelectedButton}
                        />
                    </View>
                    <HorizontalLine />
                </View>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : selectedButton === "This Month" ? (
                <ReportThisMonthComponent
                    incomeTransactions={incomeTransactions}
                    expenseTransactions={expenseTransactions}
                    budgets={budgets}
                />
            ) : (
                <ReportPrevMonthComponent
                    incomeTransactions={incomeTransactions}
                    expenseTransactions={expenseTransactions}
                    budgets={budgets}
                />
            )}
        </View>
    );
};

export default ReportsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerCard: {
        width: screenWidth - 20,
        height: 50,
        marginVertical: 10,
        marginHorizontal: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    headerTab: {
        marginTop: 10,
        marginBottom: 10,
        position: "relative",
    },
    buttonContainer: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        paddingVertical: 0,
        paddingHorizontal: 0,
        zIndex: 1,
    },
});
