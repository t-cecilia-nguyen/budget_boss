import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const OverviewScreen = () => {
    // Define data for different months
   const monthlyData = {
       October: [
           { name: 'Rent', amount: 1800, color: '#277DA1' },
           { name: 'Food', amount: 800, color: '#F94144' },
           { name: 'Fitness', amount: 100, color: '#F9844A' },
           { name: 'Shopping', amount: 30, color: '#F9C74F' },
           { name: 'Medical', amount: 200, color: '#90BE6D' },
       ],
       November: [
           { name: 'Rent', amount: 1800, color: '#277DA1' },
           { name: 'Food', amount: 400, color: '#F94144' },
           { name: 'Fitness', amount: 100, color: '#F9844A' },
           { name: 'Shopping', amount: 80, color: '#F9C74F' },
       ],
       December: [
           { name: 'Rent', amount: 1800, color: '#277DA1' },
           { name: 'Food', amount: 500, color: '#F94144' },
           { name: 'Fitness', amount: 120, color: '#F9844A' },
           { name: 'Insurance', amount: 350, color: '#F9C74F' },
           { name: 'Beauty', amount: 100, color: '#90BE6D' },
           { name: 'Vacation', amount: 450, color: '#BECAE6' },
       ],
   };

    // State to track the current month
    const [currentMonth, setCurrentMonth] = useState('November');

    // Get the data for the current month
    const data = monthlyData[currentMonth];

    // Calculate total expenses for the current month
    const totalExpenses = data.reduce((sum, item) => sum + item.amount, 0);

    // Function to handle the previous month
    const handlePreviousMonth = () => {
        const months = Object.keys(monthlyData);
        const currentIndex = months.indexOf(currentMonth);
        if (currentIndex > 0) {
            const prevMonth = months[currentIndex - 1];
            setCurrentMonth(prevMonth);
        }
    };

    // Function to handle the next month
    const handleNextMonth = () => {
        const months = Object.keys(monthlyData);
        const currentIndex = months.indexOf(currentMonth);
        if (currentIndex < months.length - 1) {
            const nextMonth = months[currentIndex + 1];
            setCurrentMonth(nextMonth);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={handlePreviousMonth}>
                        <Text style={styles.navigationButton}>{'<'}</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>{currentMonth} 2024</Text>
                    <TouchableOpacity onPress={handleNextMonth}>
                        <Text style={styles.navigationButton}>{'>'}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.expenseHeader}>
                    <Text style={styles.expenseText}>Expenses: ${totalExpenses}</Text>
                </View>
            </View>
            <PieChart
                data={data}
                width={450}
                height={250}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    labelColor: () => '#FFF',
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="100"
                center={[10, 10]}
                hasLegend={false}
                absolute
            />
            <FlatList
                data={data}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => {
                    const percentage = ((item.amount / totalExpenses) * 100).toFixed(0); // Calculate percentage
                    return (
                        <View style={styles.listItem}>
                            <View style={[styles.colorBox, { backgroundColor: item.color }]}>
                                <Text style={styles.percentageText}>{percentage}%</Text>
                            </View>
                            <Text style={styles.listText}>{item.name}</Text>
                            <Text style={styles.amountText}>${item.amount.toFixed(2)}</Text>
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
        padding: 0,
    },

    headerContainer: {
        backgroundColor: '#F94144',
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: '100%',
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 25,
        color: '#FFF',
    },
    navigationButton: {
        fontSize: 25,
        color: '#FFF',
    },
    expenseHeader: {
        backgroundColor: '#FFF',
        padding: 5,
        borderRadius: 20,
        alignItems: 'center',
        marginVertical: 10,
    },
    expenseText: {
        fontSize: 25,
        color: '#F94144',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        marginRight: 20,
        marginLeft: 20,
        backgroundColor: 'transparent',
    },
    colorBox: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageText: {
        fontSize: 20,
        color: '#333',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    listText: {
        color: '#333',
        fontSize: 20,
        flex: 1,
    },
    amountText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#333',
    },
});

export default OverviewScreen;