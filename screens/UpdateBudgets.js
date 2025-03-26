import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from "date-fns";

const UpdateBudgetScreen = ({ route, navigation }) => {

    // Pass budget's original values from summary page
    const { budget } = route.params;
    
    // States - Initialized with original budget's values
    const [startDate, setStartDate] = useState(new Date(budget.start_date));
    const [endDate, setEndDate] = useState(new Date(budget.end_date));
    const [amount, setAmount] = useState(budget.amount.toString());
    const [amountSpent, setAmountSpent] = useState(budget.amount_spent.toString());
    const [category, setCategory] = useState(budget.category);
    const [notes, setNotes] = useState(budget.notes || '');
    const [token, setToken] = useState('');
    const [startDatePicker, setStartDatePicker] = useState('');
    const [endDatePicker, setEndDatePicker] = useState('');
    const [categories, setCategories] = useState([]);

    // Retrieve user token
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

    // Get category names 
    useEffect(() => {
        const getCategories = async () => {

            if (!token) return;

            try {
                const response = await axios.get('http://10.0.2.2:5000/categories', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                // Debug API response
                //console.log('API response:', response.data);

                if (response.status === 200) {
                    const categoryNames = response.data.map(cat => cat.name);

                    // Check to ensure that the original category still exists, defaults to label if not present
                    if (budget?.category && !categoryNames.includes(budget.category)) {
                        categoryNames.unshift(budget.category);
                    }

                    setCategories(categoryNames);
                } else {
                    Alert.alert('Error', 'Failed to fetch categories for form.');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                Alert.alert('Error', 'An error has occured while fetching categories.');
            }
        };

        getCategories();
    }, [token]);


    // Form validation checks
    const validateForm = () => {
        
        // If missing fields
        if (!startDate || !endDate || !amount || !category) {
            Alert.alert('Validation Error', 'Please fill in all required fields.');
            return false;
        }

        // If start date is not within the same month and year as end date
        if (startDate.getMonth() !== endDate.getMonth() || startDate.getFullYear() !== endDate.getFullYear()) {
            Alert.alert('Validation Error', 'Start and end dates must be within the same month range.');
            return false;
        }

        // If start date is not before the end date
        if (startDate > endDate) {
            Alert.alert('Validation Error', 'Start date cannot be after the selected end date.');
            return false;
        }

        // If amount is not a positive number
        if (isNaN(amount) || parseFloat(amount) <= 0) {
            Alert.alert('Validation Error', 'Please enter a valid number that is greater than zero.');
            return false;
        }

         // If amount_spent is not a number
         if (isNaN(amountSpent)) {
            Alert.alert('Validation Error', 'Please enter a valid number.');
            return false;
        }

        return true;
    };

    // Form submission
    const handleUpdate = async () => {
        
        if (!validateForm()) return;

        try {
            
            const updatedData = {
                startDate: format(startDate, 'yyyy-MM-dd'),
                endDate: format(endDate, 'yyyy-MM-dd'),
                amount: parseFloat(amount),
                amount_spent: amountSpent ? parseFloat(amountSpent) : 0,
                category,
                notes,
            };

            // Payload check
            //console.log("Updating with:", updatedData)

            const response = await axios.put(`http://10.0.2.2:5000/budgets/update/${budget.id}`, updatedData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 200) {
                Alert.alert('Success', response.data.message)

                // Navigates to budget summary after success
                navigation.navigate('BudgetSummary');
            } else {
                Alert.alert('Error', response.data.error || 'Failed to update budget.'); 
            }
        } catch (error) {
            console.error('Error:', error)
            Alert.alert('Error', 'An error occured while updating the form.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update your Budget</Text>

            {/* Start date field */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Start Date:</Text>
                    <TouchableOpacity onPress={() => setStartDatePicker(true)} style={styles.inputButton}>
                        <Text style={styles.inputText}>
                            {startDate ? format(startDate, 'yyyy-MM-dd') : 'Select Start Date'}
                        </Text>
                    </TouchableOpacity>
                    {startDatePicker && (
                        <DateTimePicker
                            value={startDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setStartDatePicker(false);
                                if (selectedDate) setStartDate(selectedDate);
                            }}
                        />
                    )}  
            </View>
            
            {/* End date field */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>End Date:</Text>
                <TouchableOpacity onPress={() => setEndDatePicker(true)} style={styles.inputButton}>
                    <Text style={styles.inputText}>
                        {endDate ? format(endDate, 'yyyy-MM-dd') : 'Select End Date'}
                    </Text>
                </TouchableOpacity>
                {endDatePicker && (
                    <DateTimePicker
                        value={endDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setEndDatePicker(false);
                            if (selectedDate) setEndDate(selectedDate);
                        }}
                    />
                )}         
            </View>
            
            {/* Amount field */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Amount:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>
            
            {/* Amount spent field */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Amount Spent:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Amount Spent"
                    keyboardType="numeric"
                    value={amountSpent}
                    onChangeText={setAmountSpent}
                />
            </View>
            
            {/* Category field */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Category:</Text>
                <View style={styles.pickerWrapper}>
                    <Picker style={styles.picker} selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
                        <Picker.Item label="Select Category" value="" />
                        {categories.map((categoryName, index) => (
                            <Picker.Item key={index} label={categoryName} value={categoryName} />
                        ))}
                    </Picker>
                </View>
            </View>
            
            {/* Notes field */}
            <View style={styles.formGroup}>
                <Text style={styles.label}>Notes:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Notes"
                    value={notes}
                    onChangeText={setNotes}
                />
            </View>

            {/* Submit and navigation buttons */}
            <View style={styles.buttonGroup}>
                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>Update Budget</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BudgetSummary')}>
                    <Text style={styles.buttonText}>Your Budgets Summary</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


// Styling 

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: 'white'    
    },
    
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },

    formGroup: {
        marginBottom: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },

    label: {
        fontSize: 20,
        color: 'black',
        marginRight: 10,
        width: 100,
    },
    
    input: {
        flex: 1,
        height: 60,
        borderColor: '#277DA1',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        fontSize: 18,
    },

    pickerWrapper: {
        flex: 1,
        borderColor: '#277DA1',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
        height: 60,
        justifyContent: 'center',
    },

    picker: {
        flex: 1,
        height: 60,
        fontSize: 18,
        lineHeight: 0,
        textAlign: 'left',
        color: 'black',
        paddingVertical: 0,
    },

    inputButton: {
        height: 60,
        justifyContent: 'center',
        borderColor: '#277DA1',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        flexShrink: 1,
        width: '100%'
    },

    inputText: {
        color: 'black',
        fontSize: 18,
    },

    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },

    button: {
        flex: 1,
        backgroundColor:  '#66B2FF',
        paddingVertical: 10,
        marginHorizontal: 5,
        borderRadius: 5,
    },

    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default UpdateBudgetScreen;