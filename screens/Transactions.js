import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons'; 
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../assets/colors';
import Toast from 'react-native-toast-message';
import { set } from 'date-fns';

const TransactionsScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTransactionId, setSelectedTransactionId] = useState(null);

    const basePath = "http://10.0.2.2:5000/uploads/";
    const backend_url = `${Constants.expoConfig.extra.API_BACKEND_URL}/transactions/transactions`;

    const [openMonth, setOpenMonth] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const [openYear, setOpenYear] = useState(false);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());


    const inflow = transactions.filter(item => item.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const outflow = transactions.filter(item => item.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const balance = parseFloat((inflow - outflow).toFixed(2));
    const balancePercentage = balance / inflow * 100;

    // Fetch transactions when month or year changes    
    useEffect(() => {
        fetchTransactions();
    }, [selectedMonth, selectedYear]);

    // Categorize balance based on percentage
    let balanceCategory = '';
    if (balance < 0) {
        balanceCategory = 'negative';
    } else if (balancePercentage > 50) {
        balanceCategory = 'surplus';
    } else if (balancePercentage < 20) {
        balanceCategory = 'low';
    }

    // Function to show the toast (for balance)
    const showToast = () => {
        console.log("Balance:", balance);

        // Show toast based on balance category
        if (balanceCategory === 'negative') {
            Toast.show({
                text1: 'Warning: Your balance is negative!',
                text2: 'Please review your transactions and adjust your budget.',
                position: 'top',
                topOffset: 8,
                type: 'error',
                visibilityTime: 4000,
            });
        } else if (balanceCategory === 'surplus') {
            Toast.show({
                text1: `Great! Your balance is positive.`,
                text2: "You're doing great with your finances!",
                position: 'top',
                topOffset: 8,
                type: 'success',
                visibilityTime: 4000,
            });
        } else if (balanceCategory === 'low') {
            Toast.show({
                text1: `Warning: Your balance is low!`,
                text2: "You have less than 20% of your income left.",
                position: 'top',
                topOffset: 8,
                type: 'error',
                visibilityTime: 4000,
            });
        }
    };  


    // Show toast when balance changes
    useEffect(() => {
        if (loading) return;  // Prevent showing toast during loading
        showToast();
    }, [balance]); 

    // Fetch transactions from backend using stored token and selected date filters
    const fetchTransactions = async () => {
        setLoading(true);
        setError(null); 
    
        try {
            const token = await AsyncStorage.getItem('token');
    
            const userProfileUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`;
            const userResponse = await axios.get(userProfileUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const userId = userResponse.data.id;
            // console.log("User ID:", userId);
    
            const response = await axios.post(backend_url, {
                user_id: userId,  
                month: selectedMonth.toString().padStart(2, '0'),  
                year: selectedYear.toString(),  
            });
    
            if (response.data.length === 0) {
                console.warn(`No transactions found for ${selectedMonth}/${selectedYear}`);
                setTransactions([]); 
            }
    
            setTransactions(response.data);
        } catch (err) {
            console.warn(`No transactions found for ${selectedMonth}/${selectedYear}`);

            try {
                const token = await AsyncStorage.getItem('token');
                const userProfileUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`;
                const userResponse = await axios.get(userProfileUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
    
                const userId = userResponse.data.id;
    
                const fallbackResponse = await axios.post(backend_url, {
                    user_id: userId,  
                    month: currentMonth.toString().padStart(2, '0'),  
                    year: currentYear.toString(),  
                });
    
                if (fallbackResponse.data.length === 0) {
                    console.warn(`No transactions found for ${currentMonth}/${currentYear}`);
                    setTransactions([]);
                    return;
                }
    
                setTransactions(fallbackResponse.data);
                setSelectedMonth(currentMonth);
                setSelectedYear(currentYear);
            } catch (fallbackErr) {
                console.log("No transactions found.");
                setTransactions([]); 
            }
        } finally {
            setLoading(false);
        }
    };
    
    // Delete a transaction by ID
    const handleDelete = async (transactionId) => {
        if (!transactionId) {
            alert("Error: Transaction ID is missing.");
            return;
        }
    
        try {
            const token = await AsyncStorage.getItem('token'); 
            const deleteUrl = `http://10.0.2.2:5000/transactions/transactions/${transactionId}`;
    
            const response = await axios.delete(deleteUrl);
    
            if (response.status === 200) {
                // Remove the deleted transaction from state
                setTransactions(prevTransactions => prevTransactions.filter(item => item.id !== transactionId));
                setSelectedTransactionId(null);
                alert('Transaction deleted successfully.');
            } else {
                alert(response.data.error || 'Failed to delete transaction.');
            }
        } catch (err) {
            console.error('Error deleting transaction:', err);
            alert(err.response?.data?.error || 'Failed to delete transaction.');
        }
    };

    // Show loading spinner while fetching
    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    // Show error if any
    if (error) {
        return <Text>{error}</Text>;
    }

    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const date = transaction.date;
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {});



    const monthItems = [
        { label: "January", value: 1 },
        { label: "February", value: 2 },
        { label: "March", value: 3 },
        { label: "April", value: 4 },
        { label: "May", value: 5 },
        { label: "June", value: 6 },
        { label: "July", value: 7 },
        { label: "August", value: 8 },
        { label: "September", value: 9 },
        { label: "October", value: 10 },
        { label: "November", value: 11 },
        { label: "December", value: 12 },
    ];
    
    // Render individual transaction item
    const renderItem = ({ item }) => (
        <TouchableOpacity 
            style={styles.transactionItem} 
            onPress={() => setSelectedTransactionId(item.id === selectedTransactionId ? null : item.id)}>
            <View style={styles.transactionDetails}>
                <View style={styles.categoryRow}>
                    {item.icon ? (
                        <Image source={{ uri: `${basePath}${item.icon}` }} style={styles.icon} />
                    ) : (
                        <Ionicons
                            name={'pricetag-outline'}
                            size={20}
                            color={item.type === 'income' ? 'green' : 'red'}
                        />
                    )}

                    <View style={styles.transactionHeader}>
                        <Text style={styles.transactionCategory}>{item.category}</Text>

                        <Text style={[styles.transactionAmount, item.type === 'income' ? styles.inflow : styles.outflow]}>
                            {item.type === 'income' ? `+${item.amount}` : `-${item.amount}`}
                        </Text>

                        {selectedTransactionId === item.id && (
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Ionicons name="close-circle" size={24} color="red" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                {item.note ? (
                    <Text style={styles.transactionDescription}>{item.note}</Text>
                ) : null}
            </View>
        </TouchableOpacity>
    );


    // Render group of transactions under a single date
    const renderGroupItem = ({ item }) => (
        <View style={styles.transactionCard}>
            <Text style={styles.groupDate}>{item[0].date}</Text>
            <View style={styles.separatorLine}></View>
            {item.map(transaction => (
                <View key={transaction.id}>
                    {renderItem({ item: transaction })}
                </View>
            ))}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.header}>Transactions</Text>
            </View>

            <View style={styles.headerRow}>
                {/* Dropdowns for month and year selection */}
                <View style={styles.dropdownWrapper}>
                    <DropDownPicker
                        open={openMonth}
                        value={selectedMonth}
                        items={monthItems}
                        setOpen={setOpenMonth}
                        setValue={setSelectedMonth}
                        placeholder="Select Month"
                        containerStyle={styles.dropdownContainer}
                        style={styles.dropdown}
                        
                    />
                    <DropDownPicker
                        open={openYear}
                        value={selectedYear}
                        items={[...Array(5).keys()].map((i) => ({
                            label: (new Date().getFullYear() - i).toString(),
                            value: new Date().getFullYear() - i,
                        }))}
                        setOpen={setOpenYear}
                        setValue={setSelectedYear}
                        placeholder="Year"
                        containerStyle={styles.dropdownContainer}
                        style={styles.dropdown}
                    />
                </View>
            </View>

            <View style={styles.balanceContainer}>
                <Text style={styles.balanceText}>{monthItems.find(item => item.value === selectedMonth)?.label} {selectedYear}</Text>
                <View style={styles.separatorLine}></View>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { flex: inflow / (inflow + outflow || 1) }]} />
                    <View style={[styles.progressEmpty, { flex: outflow / (inflow + outflow || 1) }]} />
                </View>
                
                <View style={styles.balanceDetails}>
                    <View style={styles.row}>
                        <Text style={styles.label}>Inflow</Text>
                        <Text style={[styles.value, styles.inflow]}>{inflow}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.label}>Outflow</Text>
                        <Text style={[styles.value, styles.outflow]}>{outflow}</Text>
                    </View>
                    <View style={styles.separatorLine}></View>
                    <View style={styles.row}>
                        <Text style={styles.balanceLabel}>Balance</Text>
                        <Text style={[styles.balanceValue, balance < 0 ? styles.outflow : styles.inflow]}>
                            {balance}
                        </Text>     
                    </View>
                </View>
            </View>
            
            <FlatList
                // ListEmptyComponent rendered when there are no transactions recorded
                ListEmptyComponent={() => (
                    <Text style={styles.noRecordsText}>No transaction records found for {monthItems.find(item => item.value === selectedMonth)?.label} {selectedYear}.</Text>
                )}
                data={Object.values(groupedTransactions)}
                renderItem={renderGroupItem}
                keyExtractor={(item, index) => item[0].date + index.toString()}  
            />

            {/* Toast component */}
            <Toast />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8F8F8',
        flexGrow: 1
    },
    headerContainer: {
        alignItems: 'center',
    },    
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        color: Colors.primaryBlue,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    dropdownWrapper: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    dropdownContainer: {
        flex: 1,
        marginHorizontal: 5,
    },
    dropdown: {
        borderColor: Colors.grey,
        backgroundColor: '#fff',
        width: '100%',
        minHeight: 40,
    },
    balanceContainer: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 10,
        paddingTop: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        marginBottom: 10,
        borderColor: Colors.grey,
        borderWidth: 1,
    },
    progressBar: {
        height: 10,
        flexDirection: 'row',
        backgroundColor: '#e6e6e6',
        borderRadius: 5,
        overflow: 'hidden',
        marginVertical: 10,
    },
    progressFill: {
        backgroundColor: '#28a745',
    },
    progressEmpty: {
        backgroundColor: '#dc3545',
    },
    balanceDetails: {
        marginTop: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#555',
    },
    value: {
        fontSize: 14,
        fontWeight: '600',
    },
    inflow: {
        color: Colors.green,
    },
    outflow: {
        color: Colors.red,
    },
    balanceText: {
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
    balanceLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    balanceValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    transactionCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        borderColor: Colors.grey,
        borderWidth: 1,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
    },
    transactionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    transactionAmount: {
        marginRight: 10,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
        marginLeft: -10,
    },
    transactionCategory: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    transactionDescription: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
        marginLeft: -10,
    },
    noRecordsText: {
        color: Colors.greyBlue,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default TransactionsScreen;