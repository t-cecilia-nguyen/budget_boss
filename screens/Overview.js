import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../assets/colors';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const OverviewScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedType, setSelectedType] = useState('expense');
    const [selectedCategory, setSelectedCategory] = useState(null);

    const backendUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/transactions/transactions`;

    useEffect(() => {
        fetchTransactions();
    }, [selectedMonth, selectedYear, selectedType]);

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const userProfileUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`;
            const userResponse = await axios.get(userProfileUrl, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            const userId = userResponse.data.id;

            const response = await axios.post(backendUrl, {
                user_id: userId,
                month: selectedMonth.toString().padStart(2, '0'),
                year: selectedYear.toString(),
                type: selectedType,
            });

            setTransactions(response.data.length ? response.data : []);
        } catch (error) {
            console.error("Error fetching transactions: ", error);
            setTransactions([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(transaction => transaction.type === selectedType);

    const groupedTransactions = filteredTransactions.reduce((groups, { category, amount }) => {
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push({ amount });
        return groups;
    }, {});

    const pieChartColors = ['#F94144', '#F9844A', '#F9C74F', '#90BE6D', '#577590', '#277DA1', '#023047', '#8ECAE6'];

    const pieChartData = Object.keys(groupedTransactions)
        .map((category, index) => {
            const totalAmount = groupedTransactions[category].reduce((acc, { amount }) => acc + amount, 0);
            return {
                name: category,
                population: totalAmount,
                color: selectedType === 'expense'
                    ? (index === 0 ? '#F94144' : pieChartColors[index % pieChartColors.length])
                    : (index === 0 ? '#90BE6D' : pieChartColors[index % pieChartColors.length]),
                legendFontColor: "#fff",
                legendFontSize: 15,
            };
        })
        .sort((a, b) => b.population - a.population);

    const totalAmount = filteredTransactions.reduce((acc, { amount }) => acc + amount, 0);

    const categoryPercentages = Object.keys(groupedTransactions)
        .map((category, index) => {
            const categoryTotal = groupedTransactions[category].reduce((acc, { amount }) => acc + amount, 0);
            return {
                category,
                amount: categoryTotal,
                percentage: ((categoryTotal / totalAmount) * 100).toFixed(2),
                color: selectedType === 'expense'
                    ? (index === 0 ? '#F94144' : pieChartColors[index % pieChartColors.length])
                    : (index === 0 ? '#90BE6D' : pieChartColors[index % pieChartColors.length]),
            };
        })
        .sort((a, b) => b.amount - a.amount);

    const handlePieChartPress = (data) => {
        console.log("Pie Chart Data clicked:", data);
        setSelectedCategory(data.name);
    };

    return (
        <View style={styles.container}>
            {/* Header Container */}
            <View style={styles.headerContainer}>
                {/* Month Navigation */}
                <View style={styles.monthNavigationContainer}>
                    <TouchableOpacity onPress={() => setSelectedMonth(prev => (prev === 1 ? 12 : prev - 1))}>
                        <Ionicons name="chevron-back-outline" size={30} color={Colors.primary} />
                    </TouchableOpacity>

                    <Text style={styles.monthText}>
                        {new Date(selectedYear, selectedMonth - 1).toLocaleString('default', { month: 'long' })} {selectedYear}
                    </Text>

                    <TouchableOpacity onPress={() => setSelectedMonth(prev => (prev === 12 ? 1 : prev + 1))}>
                        <Ionicons name="chevron-forward-outline" size={30} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                {/* Expense/Income Navigation */}
                <View style={styles.typeNavigationContainer}>
                    <TouchableOpacity onPress={() => setSelectedType('expense')}>
                        <Ionicons name="chevron-back-outline" size={30} color={selectedType === 'expense' ? Colors.primary : '#888'} />
                    </TouchableOpacity>
                    <Text style={styles.typeText}>
                        {selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}
                    </Text>
                    <TouchableOpacity onPress={() => setSelectedType('income')}>
                        <Ionicons name="chevron-forward-outline" size={30} color={selectedType === 'income' ? Colors.primary : '#000'} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Pie Chart */}
            <PieChart
                data={pieChartData}
                width={Dimensions.get('window').width}
                height={250}
                chartConfig={{
                    backgroundColor: "#ffffff",
                    backgroundGradientFrom: "#ffffff",
                    backgroundGradientTo: "#ffffff",
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="90"
                absolute
                hasLegend={false}
                onDataPointClick={(data) => handlePieChartPress(data)}
                style={{
                    marginVertical: 8,
                    borderRadius: 16,
                }}
            />

            {/* Transaction List */}
            {loading ? (
                <ActivityIndicator size="large" color={Colors.primary} />
            ) : (
                <FlatList
                    data={categoryPercentages}
                    renderItem={({ item }) => (
                        <View style={styles.categoryItem}>
                            <View style={[styles.categoryPercentageBox, { backgroundColor: item.color }]}>
                                <Text style={styles.categoryPercentage}>{item.percentage}%</Text>
                            </View>
                            <Text
                                style={[styles.categoryText, {
                                    fontWeight: selectedCategory === item.category ? 'bold' : 'normal',
                                    color: selectedCategory === item.category ? Colors.primary : '#555'
                                }]}
                            >
                                {item.category}
                            </Text>
                            <Text style={styles.categoryAmount}>
                                {`${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.amount)}`}
                            </Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.category}
                    style={styles.categoryList}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    headerContainer: {
        backgroundColor: '#F96A6A',
        paddingVertical: 15,
        paddingHorizontal: 0,
        width: '100%',
        marginBottom: 0,
        paddingTop: 10,
    },
    monthNavigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 0,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        width: '90%',
        alignSelf: 'center',
    },
    monthText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F96A6A',
    },
    typeNavigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 12,
        paddingVertical: 0,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#FFFFFF',
        width: '90%',
        alignSelf: 'center',
    },
    typeText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#F94144',
    },
    pieChartContainer: {
        alignItems: 'center',
        marginBottom: 0,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
        alignItems: 'center',
    },
    categoryPercentage: {
        fontSize: 18,
        fontWeight: 'bold',
        width: 80,
        textAlign: 'center',
        paddingVertical: 5,
        paddingHorizontal: 0,
        color: 'black',
    },
    categoryPercentageBox: {
        marginLeft: 10,
        marginRight: 5,
        borderRadius: 25,
        backgroundColor: (category) => category === 'expense' ? '#F94144' : '#90BE6D', // Example of dynamic background color
    },
    categoryText: {
        fontSize: 18,
        color: '#555',
        flex: 1,
        marginLeft: 10,
    },
    categoryAmount: {
        fontSize: 18,
        color: '#333',
        textAlign: 'right',
        width: 100,
        marginRight: 10,
    },
    categoryList: {
        marginTop: 10,
    },
});

export default OverviewScreen;
