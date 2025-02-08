import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons'; 

const TransactionsScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const backend_url = `${Constants.expoConfig.extra.API_BACKEND_URL}/transactions/transactions`;

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                // PLACEHOLDER!!!!! remember to fix
                const response = await axios.post(backend_url, {
                    user_id: 1,  
                    month: '01',  
                    year: '2025',  
                });

                setTransactions(response.data);  
            } catch (err) {
                setError('Failed to fetch transactions');
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [backend_url]);

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text>{error}</Text>;
    }

    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const date = transaction.date;  //  date should be in a 'YYYY-MM-DD' format
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {});

    // Calculate total inflow, outflow, and balance
    const inflow = transactions.filter(item => item.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const outflow = transactions.filter(item => item.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const balance = inflow - outflow;

    const renderItem = ({ item }) => (
        <View style={styles.transactionItem}>

            <View style={styles.transactionDetails}>
                <View style={styles.categoryRow}>
                    {item.icon ? (
                        <Image
                            source={{ uri: item.icon }}
                            style={{
                                width: 20,
                                height: 20,
                            }}
                        />
                    ) : (
                        <Ionicons
                            name={'pricetag-outline'}
                            size={20}
                            color={item.type === 'income' ? 'green' : 'red'}
                        />
                    )}
        

                    <View style={styles.transactionHeader}>
                        <Text style={styles.transactionCategory}>{item.category}</Text>

                        <Text style={[styles.transactionAmount, item.type === 'income' ? styles.income : styles.expense]}>
                            {item.type === 'income' ? `+${item.amount}` : `-${item.amount}`}
                        </Text>
                    </View>

                </View>
                <Text style={[styles.transactionDescription]}>
                    {item.note || '-'}
                </Text>
            </View>
        </View>
    );

    const renderGroupItem = ({ item }) => {
        return (
            <View style={styles.transactionCard}>
                <Text style={styles.groupDate}>{item[0].date}</Text>
                <View style={styles.separatorLine}></View>
                {item.map(transaction => renderItem({ item: transaction }))}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Transactions</Text>
            <View style={styles.balanceContainer}>
                <Text style={styles.balanceText}>This Month</Text>
                <View style={styles.separatorLine}></View>
                <View style={styles.progressBar}>
                    <View
                        style={[styles.progressFill, { flex: inflow / (inflow + outflow || 1) }]}>
                    </View>
                    <View
                        style={[styles.progressEmpty, { flex: outflow / (inflow + outflow || 1) }]}>
                    </View>
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
                        <Text style={styles.balanceValue}>{balance}</Text>
                    </View>
                </View>
            </View>

            <FlatList
                data={Object.values(groupedTransactions)}  
                renderItem={renderGroupItem}
                keyExtractor={(item, index) => item[0].date + index.toString()}  
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F8F8F8',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    balanceContainer: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
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
        color: '#28a745',
    },
    outflow: {
        color: '#dc3545',
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
    transactionCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    groupDate: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#555',
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',  
        alignItems: 'center',
        width: '100%',  
    },
    
    transactionCategory: {
        fontSize: 16,
        fontWeight: 'bold',

    },
    
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'right',  
        width: '40%',  
    },
    transactionDate: {
        fontSize: 14,
        color: '#555',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 15,
    },
    income: {
        color: '#28a745',
    },
    expense: {
        color: '#dc3545',
    },
    transactionDetails: {
        marginTop: 8,
    },
    categoryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    transactionCategory: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    transactionDescription: {
        fontSize: 14,
        color: '#777',
        marginTop: 4,
    },
    separatorLine: {
        height: 1,
        backgroundColor: '#ddd',  
        marginVertical: 8, 
    },
});

export default TransactionsScreen;
