import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { format } from "date-fns";
import AsyncStorage from '@react-native-async-storage/async-storage';

const BudgetSummaryScreen = ({ navigation }) => {

    // States
    const [currentDate, setCurrentDate] = useState(new Date());
    const [budgets, setBudgets] = useState([]);
    const [token, setToken] = useState('');
    
    //Retrieve user token
    useEffect(() => {
        const getUserId = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                
                if (!storedToken) {
                    console.log("No token could be found.");
                    return;
                }
                // Debug log
                //console.log("Stored token:", storedToken);
                setToken(storedToken);
            } catch (error) {
                console.error("Error retrieving token:", error);
            }
        };

        getUserId();
    }, []);

    // Get budget data if currentDate or token changes
    useEffect(() => {
        if (token) {
            console.log("Fetching budget list for:", format(currentDate, "MMMM yyyy"));
            getBudgets();
        }
    }, [currentDate, token]);

    // Get budgets based on the set month and year
    const getBudgets = async () => {

        if (!token) return;

        // Date formatting
        const month = format(currentDate, "MM");
        const year = format(currentDate, "yyyy");

        // Debug log
        //console.log(`Fetching budgets for month: ${month}, year: ${year}`)

        try {

            const response = await axios.get('http://10.0.2.2:5000/budgets/list', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                params: { month, year },
            });

            // Debug API response
            //console.log('API response:', response.data);

            if (response.status === 200) {
                console.log(`Budget list fetched successully for ${month} ${year}.`);
                setBudgets(response.data);
            } else {
                Alert.alert('Error', 'Failed to fetch budget list.');
            }

        } catch (error) {
            console.error('Error fetching budget list:', error);
            Alert.alert('Error', 'An error has occured while fetching the budget list.');
        }
    };

    // Changes the displayed month by 1
    const changeMonth = (direction) => {
        setCurrentDate((prevDate) => {
            const newDate = new Date(prevDate);
            // Sets date to first of month - Must be kept to ensure month overflow does not occur
            newDate.setDate(1); 
            // Moves forward or backwards 1 month based on direction from user
            newDate.setMonth(prevDate.getMonth() + direction);
            
            return newDate;
        });
    };
    
    // Calculates total budget based off all category budget values for the month
    const calculateTotalBudget = () => {
        return budgets.reduce((total, item) => total + item.category_budget, 0);
    }

    // Calculates total spent based off all categories for the month
    // Dummy data - Sets spent to 100 for each category in the month to simulate overall look
    // Will update in future to be editable - Jan 31st, 2025
    const calculateTotalSpent = () => {
        return budgets.reduce((total, item) => total + 100, 0);
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => changeMonth(-1)}>
                        <Text style={styles.navButton}>&lt;</Text>
                    </TouchableOpacity>

                    <Text style={styles.dateText}>{format(currentDate, "MMMM yyyy")}</Text>

                    <TouchableOpacity onPress={() => changeMonth(1)}>
                        <Text style={styles.navButton}>&gt;</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.calculateContainer}>
                    <Text style={styles.totalBudgetText}>Total Budget: ${calculateTotalBudget().toFixed(2)}</Text>
                    <Text style={styles.totalSpentText}>Total Spent: ${calculateTotalSpent().toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.listContainer}>
                <FlatList
                    data={budgets}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.listItem}>
                            <Text style={styles.itemCategory}>{item.category}</Text>
                            <Text style={styles.itemAmount}>Budget: ${item.category_budget.toFixed(2)}</Text>
                            
                            <View style={styles.remainingCategoryItems}>
                                <Text style={styles.itemSpent}>Spent: $</Text>
                                <Text style={styles.itemRemaining}>Remaining: $</Text>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyList}>No budget data is available for this month.</Text>}
                />

                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>Back to Budgets Form</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Styling

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingvertical: 10,
        backgroundColor: 'white',
    },

    headerContainer: {
        backgroundColor: '#66B2FF',
        marginHorizontal: -20,
        padding: 12,
    },

    header: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 80,
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    navButton: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },

    dateText: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },

    calculateContainer: {
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 100,
        marginVertical: 8,
        alignSelf: 'center',
        width: '80%',
    },

    totalBudgetText: {
        backgroundColor: 'white',
        color: '#66B2FF',
        fontSize: 18,
        textAlign: 'center',
    },

    totalSpentText: {
        backgroundColor: 'white',
        color: '#F94144',
        fontSize: 18,
        textAlign: 'center',
    },

    listItem: {
        flexDirection: 'col',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'black',
    },

    itemCategory: {
        fontSize: 18,
        color: 'black',
    }, 

    itemAmount: {
        fontSize: 16,
        color: 'black',
    },

    remainingCategoryItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    itemSpent: {
        fontSize: 16,
        color: 'black',
    },

    itemRemaining: {
        fontSize: 16,
        color: 'black',
    },

    emptyList: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: 'gray',
    },

    backButton: {
        marginTop: 20,
        backgroundColor: '#66B2FF',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
    },

    backButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default BudgetSummaryScreen;