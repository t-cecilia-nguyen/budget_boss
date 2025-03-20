import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
} from "react-native";
import { FontAwesome } from "react-native-vector-icons";

import { Colors } from "../../assets/colors";
import ProgressBar from "./ProgressBar";
import SummaryChart from "./SummaryChart";

const { width: screenWidth } = Dimensions.get("window");

const ReportThisMonthComponent = ({
  incomeTransactions,
  expenseTransactions,
  budgets,
}) => {

  // Get the current month and year
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
 

  const isValidDate = (date) => !isNaN(new Date(date).getTime());

  
  const filterByCurrentMonth = (transactions) =>
    transactions.filter((txn) => {
      const date = new Date(txn.date); 
      const parsedMonth = date.getUTCMonth(); 
      const parsedYear = date.getUTCFullYear(); 

      return (
        isValidDate(txn.date) &&
        parsedMonth === currentMonth &&
        parsedYear === currentYear
      );
    });

    const filterBudgetByCurrentMonth = (entries) =>
      entries.filter((entry) => {
        const startDay = new Date(entry.start_date);
        const endDay = new Date(entry.end_date);

        return (
          isValidDate(entry.start_date) &&
          isValidDate(entry.end_date) &&
          (
            // Budget starts or ends in the current month
            (startDay.getUTCMonth() === currentMonth && startDay.getUTCFullYear() === currentYear) ||
            (endDay.getUTCMonth() === currentMonth && endDay.getUTCFullYear() === currentYear) ||
    
            // Budget spans across the current month
            (startDay.getUTCMonth() <= currentMonth && endDay.getUTCMonth() >= currentMonth && startDay.getUTCFullYear() === currentYear)
          )
        );
      });
   


  const filteredExpenseTransactions = filterByCurrentMonth(expenseTransactions);
  const filteredBudgetEntries = filterBudgetByCurrentMonth(budgets);
  const filteredIncomeTransactions = filterByCurrentMonth(incomeTransactions);

  console.log("FILTERED")
  console.log(    "BUDGET THIS MONTH: ",filteredBudgetEntries
  );

 // Calculate totals directly for the current month
const totalIncome = filteredIncomeTransactions.reduce(
  (sum, txn) => sum + txn.amount,
  0
);
const totalExpense = filteredExpenseTransactions.reduce(
  (sum, txn) => sum + txn.amount,
  0
);
const totalBudget = filteredBudgetEntries.reduce(
  (sum, txn) => sum + txn.amount,
  0
);


  const netAmount = totalBudget - totalExpense;
  const expensePercentage = totalBudget > 0 ? totalExpense / totalBudget : 0;

  console.log("netAmount:", netAmount  , "expensePercentage", expensePercentage);//debug
  
  
  // Days left in the current month
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const diffTime = lastDayOfMonth - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <View style={styles.container}>
      <ScrollView nestedScrollEnabled>

        <View style={styles.card}>

          <Text style={styles.cardText}>Running Budget</Text>
          <View style={styles.noteBox}>
            <View style={styles.flexBox}>
              <FontAwesome name="circle" size={15} color={Colors.lightGrey} />
              <Text>Budget</Text>
            </View>
            <View style={styles.flexBox}>
              <FontAwesome name="circle" size={15} color={Colors.green} />
              <Text>Expense</Text>
            </View>
          </View>
          <View style={styles.spacer}></View>
          <ProgressBar newValue={expensePercentage} />
          <View style={styles.amountYouCanSpend}>
          <Text style={styles.textBold}>
              {netAmount <= 0 ? "Over Budget" : "Amount you can spend"}
            </Text>
            <Text
              style={[
                styles.textBold,
                { color: netAmount <= 0 ? Colors.red : Colors.green },
              ]}
            >
              {netAmount}
            </Text>
          </View>
          <View style={styles.horizontalBox}>
            <View style={styles.totalBudget}>
              <Text style={styles.textBold}>Total Budget</Text>
              <Text style={[{ color: Colors.green }, styles.textBold]}>
                ${totalBudget}
              </Text>
            </View>
            <View style={styles.totalSpent}>
              <Text style={styles.textBold}>Total Spent</Text>
              <Text style={[{ color: Colors.red }, styles.textBold]}>
                ${totalExpense}
              </Text>
            </View>
            <View style={styles.dayofmonthLeft}>
              <Text style={styles.textBold}>End of Month</Text>
              <Text style={[{ color: Colors.green }, styles.textBold]}>
                {diffDays} days
              </Text>
            </View>
          </View>
        </View>

        
        {/*Report This Month*/}
        <View style={styles.card}>
          <Text style={styles.cardText}>Expense This Month</Text>

          <SummaryChart
            incomeTransactions={filteredIncomeTransactions}
            expenseTransactions={filteredExpenseTransactions}
            totalIncome={totalIncome}
            totalExpense={totalExpense}
          />
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

export default ReportThisMonthComponent;
const styles = StyleSheet.create({
  amountYouCanSpend: {
    marginTop: 20,
    alignItems: "center",
  },

  bottomSpacer: {
    height: 65,
  },
  container: {
    paddingHorizontal: 10,
  },
  card: {
    flex: 1,
    width: screenWidth - 20,
    height: 300,
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    backgroundColor: "#fff",
    shadowColor: Colors.lightGrey,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  cardText: {
    color: Colors.primaryBlue,
    fontSize: 16,
    fontWeight: "bold",
    padding: 15,
    position: "absolute",
    top: 10,
    left: 10,
  },
  dayofmonthLeft: {
    alignItems: "center",
  },
  flexBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  horizontalBox: {
    marginTop: 20,
    width: "90%",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noteBox: {
    width: "25%",
    position: "absolute",
    top: 20,
    right: 20,
  },
  totalBudget: {
    alignItems: "center",
  },
  totalSpent: {
    alignItems: "center",
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  textBold: {
    fontWeight: "bold",
  },
  transactionList: {
    width: "95%",
    height: 200,
    marginTop: 50,
  },
  spacer: {
    height: 50,
  },
});
