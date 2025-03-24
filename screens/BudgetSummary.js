import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { format } from "date-fns";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';
import Constants from 'expo-constants';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from "../assets/colors";

const BudgetSummaryScreen = ({ navigation }) => {

    // States
    const [currentDate, setCurrentDate] = useState(new Date());
    const [budgets, setBudgets] = useState([]);
    const [token, setToken] = useState('');
    const [expandedCategories, setExpandedCategories] = useState({});
    const [categories, setCategories] = useState([]);

    // Backend URL
    const backend_url = `${Constants.expoConfig.extra.API_BACKEND_URL}`;
    
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

    // Fetch categories from backend
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = await AsyncStorage.getItem('token');

                if (token) {
                    fetch(`${backend_url}/categories`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    })
                    .then((res) => res.json())
                    .then((data) => {
                        // console.log("Fetched categories:", data);

                        if (Array.isArray(data)) {
                            const categoryMap = data.reduce((acc, category) => {
                                acc[category.name] = category.img_name;
                                return acc;
                            }, []);
                            setCategories(categoryMap);
                        } else {
                            console.error("Expected an array but received:", data);
                        }
                    })
                    .catch((err) => console.error("Error fetching categories:", err));
                } else {
                    console.error("No token found.");
                }
            } catch (error) {
                console.error("Error fetching token:", error);
            }
        };
        
        fetchCategories();
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

    // Toggle for expanding category to showcase individual budgets
    const toggleCategory = (category) => {
        setExpandedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
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
    const calculateTotalSpent = () => {
        return budgets.reduce((total, item) => total + (item.category_spent || 0), 0);
    }

    // Delete a specific budget based off its ID
    const deleteBudget = (budgetId) => {
        // Alert to confirm deletion
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this budget entry?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete", style: "destructive",
                    onPress: async () => {
                        try {
                            // Axios delete request to backend
                            const response = await axios.delete(`http://10.0.2.2:5000/budgets/delete/${budgetId}`, {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            });

                            // If deletion is successful
                            if (response.status === 200) {
                                Alert.alert("Success", response.data.message);
                                // Refresh budgets after success
                                getBudgets();
                            } else {
                                // Alert for failed deletion
                                Alert.alert("Error", response.data.error || "Failed to delete budget entry.")
                            }
                        } catch (error) {
                            // Catch for exceptions
                            console.error('Error deleting budget entry:', error)
                            Alert.alert("Error", "An error has occured while deleting the budget.")
                        }
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Nav Header for month / year selection */}
            <View style={styles.headerContainer}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => changeMonth(-1)}>
                    <MaterialIcons name="chevron-left" size={34} color="white" />                    
                    </TouchableOpacity>

                    <Text style={styles.dateText}>{format(currentDate, "MMMM yyyy")}</Text>

                    <TouchableOpacity onPress={() => changeMonth(1)}>
                    <MaterialIcons name="chevron-right" size={34} color="white" />                    
                    </TouchableOpacity>
                </View>
                {/* Displays total budget and total spent for the selected month */}
                <View style={styles.calculateContainer}>
                    <Text style={styles.totalBudgetText}>Total Budget: ${calculateTotalBudget().toFixed(2)}</Text>
                    <Text style={styles.totalSpentText}>Total Spent: ${calculateTotalSpent().toFixed(2)}</Text>
                </View>
            </View>

            {/* Budget list section */}
            <View style={styles.listContainer}>
                <FlatList
                    data={budgets}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => {
                        // Check if category has been expanded 
                        const isExpanded = expandedCategories[item.category] || false;
                        
                        // Set category remaining calculation
                        const remaining = item.category_budget - (item.category_spent || 0);
                        
                        // Set remaining text's colour based off if the user is over budget 
                        const remainingColour = remaining > 0 ? styles.remainingText : styles.overBudgetText;

                        // Calculate progress bar gauge's fill percentage 
                        const usageRatio = (item.category_spent || 0) / item.category_budget;
                        let progressColour = Colors.green;
                        
                        // Usage ratio check (0 to 0.74 - green, 0.75 to 0.99 - orange, red 100+)
                        if (usageRatio > 0.99) progressColour = Colors.red;
                        else if (usageRatio > 0.75) progressColour = '#FFA500';
                        
                        // Image URL for category icon
                        const categoryImageUrl = `${backend_url}/uploads/${categories[item.category]}`;

                        return (
                            <View style={styles.listItem}>
                                {/* Category Section */}
                                <TouchableOpacity onPress={() => toggleCategory(item.category)} activeOpacity={0.7}>
                                    {/* Displays category name and chevron icon based on if the category has been expanded */}
                                    <View style={styles.categoryHeader}>
                                        <Image 
                                            source={{ uri: categoryImageUrl }} 
                                            style={{ width: 20, height: 20, marginRight: 10 }}
                                        />
                                        <Text style={styles.itemCategory}>{item.category}</Text>
                                        <Text style={styles.chevron}>{isExpanded ? '\u25BC' : <MaterialIcons name="edit" size={20} color='black'/>}</Text>
                                    </View>

                                {/* Category budget */}
                                <View style={styles.categoryBudgetRow}>
                                    <Text style={styles.itemAmount}>Budget: ${item.category_budget.toFixed(2) || '0.00'}</Text>
                                    {remaining < 0 && (
                                        <Text style={styles.budgetExceededText}>Budget Exceeded!</Text>
                                    )}
                                </View>

                                {/* Category spent and category remaining */}
                                <View style={styles.remainingCategoryItems}>
                                    <Text style={styles.itemSpent}>
                                        Spent: <Text style={{ color: item.category_spent <= item.category_budget ? Colors.green : Colors.red }}>
                                            ${item.category_spent?.toFixed(2)}
                                        </Text>
                                    </Text>

                                    <Text style={styles.itemRemaining}>
                                        {remaining < 0 ? 'Over budget: ' : 'Remaining: '}
                                        <Text style={{ color: remaining >= 0 ? Colors.green : Colors.red }}>
                                            ${Math.abs(remaining).toFixed(2)}
                                        </Text>
                                    </Text>
                                </View>

                                    {/* Category progress bar */}
                                    <View style={styles.progressBar}>
                                        <Progress.Bar
                                            progress={Math.min(usageRatio, 1)}
                                            width={null}
                                            height={10}
                                            color={progressColour}
                                            unfilledColor="#e0e0e0"
                                            borderWidth={0}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {/* Expanded category list displaying individual budgets */}
                                {isExpanded && item.entries && (
                                    <View style={styles.expandedList}>
                                        {item.entries.map((entry, index) => (
                                            // Displays budget amount, budget spent, and the date range
                                            <View key={index} style={styles.budgetEntry}>
                                                <Text style={styles.entryText}>Budget: ${entry.amount} | Spent: ${entry.amount_spent} | Dates: {format(new Date(entry.start_date), 'MM-dd')} to {format(new Date(entry.end_date), 'MM-dd')}</Text>
                                                
                                                {/* Budget entry buttons for update and delete */}
                                                <View style={styles.entryButtonGroup}>
                                                    <TouchableOpacity 
                                                        style={styles.updateButton} 
                                                        onPress={() => navigation.navigate('UpdateBudget', {
                                                            // Pre-populate fields with initial budget data
                                                            budget: { ...entry, category: item.category }
                                                        })}
                                                    >
                                                        <Text style={styles.buttonText}>Update</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteBudget(entry.id)}>
                                                        <Text style={styles.buttonText}>Delete</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        );
                    }}
                    // If no budgets for the month are available
                    ListEmptyComponent={
                        <Text style={styles.emptyList}>No budget data is available for this month.</Text>
                    }
                />
                {/* Back to budget form button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('BudgetScreen')}>
                    <Text style={styles.backButtonText}>CREATE A BUDGET</Text>
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
        paddingBottom: 10,
    },

    listContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingvertical: 10,
        backgroundColor: 'white',
    },

    headerContainer: {
        backgroundColor: '#66B2FF',
        marginHorizontal: -30,
        padding: 10,
    },

    header: {
        flexDirection: 'row',
        paddingVertical: 15,
        paddingHorizontal: 80,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: -10,
    },

    navButton: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },

    dateText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 5,
    },

    calculateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        paddingVertical: 6,
        paddingHorizontal: 15,
        borderRadius: 100,
        marginBottom: 6,
        alignSelf: 'center',
        width: '80%',
    },

    totalBudgetText: {
        backgroundColor: 'white',
        color: Colors.lightBlue,
        fontSize: 14,
        textAlign: 'center',
    },

    totalSpentText: {
        backgroundColor: 'white',
        color: Colors.red,
        fontSize: 14,
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
        flex: 1,
    }, 

    itemAmount: {
        fontSize: 16,
        color: 'black',
    },

    remainingCategoryItems: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    remainingContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },

    categoryBudgetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    budgetExceededText: {
        color: Colors.red,
        fontSize: 14,
        fontWeight: 'bold',
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
        marginTop: 10,
        backgroundColor: '#66B2FF',
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
    },

    backButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },

    expandedList: {
        marginTop: 10,
        paddingLeft: 10,
    },

    budgetEntry: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },

    entryText: {
        fontSize: 14,
        marginBottom: 6,
        color: '#333',
    },

    entryButtonGroup: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },

    updateButton: {
        backgroundColor: '#66B2FF', 
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 8,
    },

    deleteButton: {
        backgroundColor: '#F94144', 
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4,
        marginLeft: 8,
    },

    buttonText: {
        color: '#f0f0f0',
        fontWeight: 'bold',
        fontSize: 12,
    },

    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },

    chevron: {
        fontSize: 25,
        color: '#666',
    },

    remainingText: {
        color: 'black',
    },

    overBudgetText: {
        color: '#F94144',
    },

    progressBar: {
        marginTop: 6,
    },
});

export default BudgetSummaryScreen;