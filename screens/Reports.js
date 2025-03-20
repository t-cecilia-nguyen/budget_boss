import React, { useState } from "react";
import { View, Text, StyleSheet , Dimensions} from "react-native";

import HorizontalLine from "../components/HorizontalLine";
import CustomButtonTab from "../components/CustomButtonTab";
import ReportPrevMonthComponent from "../components/reports/ReportPrevMonthComponent ";
import ReportThisMonthComponent from "../components/reports/ReportThisMonthComponent";


const { width: screenWidth } = Dimensions.get("window");

const ReportsScreen = () => {
  //////////// TODO: Fetch Budgets and Transactions Data //////

  const [incomeTransactions, setIncomeTransactions] = useState([]);
  const [expenseTransactions, setExpenseTransactions] = useState([]);
  const [selectedButton, setSelectedButton] = useState("This Month");
  const [budgets, setBudgets] = useState([]);

  ////////////////////
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


      {selectedButton === "Prev Month" && (
        <ReportPrevMonthComponent
          incomeTransactions={incomeTransactions}
          expenseTransactions={expenseTransactions}
          budgets={budgets}
          setBudgets={setBudgets}
        />
      )}
      {selectedButton === "This Month" && (
        <ReportThisMonthComponent
          incomeTransactions={incomeTransactions}
          expenseTransactions={expenseTransactions}
          budgets={budgets}
          setBudgets={setBudgets}
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
});
