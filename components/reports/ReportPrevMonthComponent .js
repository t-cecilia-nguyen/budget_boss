import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import { FontAwesome } from "react-native-vector-icons";

import { Colors } from "../../assets/colors";
import ProgressBar from "./ProgressBar";
import SummaryChart from "./SummaryChart";

const { width: screenWidth } = Dimensions.get("window");

const ReportPrevMonthComponent = ({
  incomeTransactions,
  expenseTransactions,
  budgets
}) => {
  // Get the current month and year
  const today = new Date();
  const prevMonth = today.getUTCMonth() - 1;
  const currentYear = today.getUTCFullYear();

  //// Log the current month, previous month, and current year
  //console.log("Current Month (UTC):", today.getUTCMonth());
  //console.log("Previous Month (UTC):", prevMonth);
  //console.log("Current Year:", currentYear);

  const isValidDate = (date) => !isNaN(new Date(date).getTime());

  const filterByPrevMonth = (transactions) =>
    transactions.filter((txn) => {
      const date = new Date(txn.date);
      const parsedMonth = date.getUTCMonth();
      const parsedYear = date.getUTCFullYear();

      return (
        isValidDate(txn.date) &&
        parsedMonth === prevMonth &&
        parsedYear === currentYear
      );
    });

  const filterBudgetsByPrevMonth = (entries) =>
    entries.filter((entry) => {
      const startDay = new Date(entry.start_date);
      const endDay = new Date(entry.end_date);
      return (
        isValidDate(entry.start_date) &&
        isValidDate(entry.end_date) &&
        (
          // Budget starts or ends in the previous month
          (startDay.getUTCMonth() === prevMonth && startDay.getUTCFullYear() === currentYear) ||
          (endDay.getUTCMonth() === prevMonth && endDay.getUTCFullYear() === currentYear) ||
  
          // Budget spans across the previous month
          (startDay.getUTCMonth() <= prevMonth && endDay.getUTCMonth() >= prevMonth && startDay.getUTCFullYear() === currentYear)
        )
      );
    });

  const filteredExpenseTransactions = filterByPrevMonth(expenseTransactions);
  const filteredBudgets = filterBudgetsByPrevMonth(budgets);
  const filteredIncomeTransactions = filterByPrevMonth(incomeTransactions);

  console.log("FILTERED");
  console.log(
    "BUDGET PREV MONTH: ",filteredBudgets
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
  const totalBudget = filteredBudgets.reduce(
    (sum, txn) => sum + txn.amount,
    0
  );

  const netAmount = totalBudget - totalExpense;
  const expensePercentage = totalBudget > 0 ? totalExpense / totalBudget : 0;

  //console.log("netAmount:", netAmount, "expensePercentage", expensePercentage); //debug

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
                {0} days
              </Text>
            </View>
          </View>
        </View>

        {/*Report This Month*/}
        <View style={styles.card}>
          <Text style={styles.cardText}>Expense Previous Month</Text>

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

export default ReportPrevMonthComponent;
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
