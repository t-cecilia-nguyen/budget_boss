import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../assets/colors';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';

const CreateTransactions = () => {
  const [selectedTab, setSelectedTab] = useState('Expense'); // Default to Expense tab
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(null);
  const [note, setNote] = useState('');
  const [categories, setCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]); // Store both Income and Expense categories
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const navigation = useNavigation();

  const backend_url = `${Constants.expoConfig.extra.API_BACKEND_URL}/transactions/transactions/create`;
  const categories_url = `${Constants.expoConfig.extra.API_BACKEND_URL}/categories`;

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const backendUrl = `${Constants.expoConfig.extra.API_BACKEND_URL}/profile/user`;

        const response = await axios.get(backendUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setUserData(response.data);
        } else {
          console.error('Failed to fetch user data:', response.statusText);
          Alert.alert('Error', 'Unable to fetch user data.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        Alert.alert('Error', 'An error occurred while fetching user data.');
      }
    };
    fetchUserData();
  }, []);

  // Fetch all categories (both Income and Expense) and filter based on selected tab
  useEffect(() => {
    const fetchCategories = async () => {
      console.log(`Fetching categories for type: ${selectedTab}`);

      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const response = await axios.get(categories_url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.status === 200) {
          setAllCategories(response.data); // Save all categories (both Income and Expense)
          // Now filter categories based on the selected tab
          const filteredCategories = response.data.filter(cat => cat.type === selectedTab);
          setCategories(filteredCategories.map(cat => ({
            label: cat.name,
            value: cat.name,
          })));
        } else {
          console.error('Failed to fetch categories:', response.statusText);
          Alert.alert('Error', 'Unable to fetch categories.');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        Alert.alert('Error', 'An error occurred while fetching categories.');
      }
    };

    fetchCategories();
  }, [selectedTab]); // Fetch categories whenever the selected tab changes

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(moment(selectedDate).format('YYYY-MM-DD'));
    hideDatePicker();
  };

  const handleSubmit = async () => {
    if (!amount || !category || !date || !userData) {
      Alert.alert('Error', 'Please fill out all required fields.');
      console.log("Missing fields in transaction data", { amount, category, date, userData });
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    const transactionData = {
      user_id: userData.id,
      amount: parsedAmount,
      category,
      type: selectedTab === 'Income' ? 'income' : 'expense',
      date,
      note,
    };

    console.log("Transaction Data to be sent:", transactionData);

    try {
      const response = await axios.post(
        backend_url,
        transactionData,
        {
          headers: {
            Authorization: `Bearer ${userData.id}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        Alert.alert('Success', response.data.message);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' }],
        });
      } else {
        Alert.alert('Error', response.data.error || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error creating transaction', error.response ? error.response.data : error.message);
      Alert.alert('Error', 'There was an issue creating the transaction');
    }
  };

  const renderForm = () => (
    <>
      <View style={styles.row}>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={showDatePicker} style={styles.dateInput}>
          <Text style={{ fontSize: 20 }}>{date}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter amount"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Category</Text>
        <DropDownPicker
          open={open}
          value={category}
          items={categories}
          setOpen={setOpen}
          setValue={setCategory}
          setItems={setCategories}
          style={styles.input}
          placeholder="Select a category"
          dropDownStyle={styles.dropdown}
          containerStyle={styles.dropdownContainer}
          itemStyle={styles.dropdownItem}
          listMode="SCROLLVIEW"  // Enables scroll mode for the dropdown
          scrollViewProps={{
            showsVerticalScrollIndicator: true,  // Adds vertical scroll indicator
          }}
          maxHeight={300}  // Allow the dropdown to show up to 300px before scrolling
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Note</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter note"
          value={note}
          onChangeText={setNote}
        />
      </View>
      <TouchableOpacity
        style={[
          styles.saveButton,
          selectedTab === 'Expense' ? styles.expenseButton : styles.incomeButton,
        ]}
        onPress={handleSubmit}
      >
        <Text style={styles.saveText}>SAVE</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Dashboard' }],
          });
        }}
      >
        <Text style={styles.backText}>
          <MaterialIcons name="arrow-back" size={30} color={Colors.white} />
        </Text>
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Expense' && styles.activeTab]}
          onPress={() => setSelectedTab('Expense')}
        >
          <Text style={[styles.tabText, selectedTab === 'Expense' && styles.activeTabText]}>
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'Income' && styles.activeTab]}
          onPress={() => setSelectedTab('Income')}
        >
          <Text style={[styles.tabText, selectedTab === 'Income' && styles.activeTabText]}>
            Income
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>{renderForm()}</View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    padding: 0,
    position: 'absolute',
    top: 0,
    left: 20,
    zIndex: 1,
  },
  backText: {
    top: 10,
    fontSize: 40,
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tabButton: {
    marginTop: 50,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeTab: {
    backgroundColor: '#F9C74F',
  },
  tabText: {
    fontSize: 30,
    color: '#000',
  },
  activeTabText: {
    color: '#fff',
  },
  formContainer: {
    flex: 1,
    marginTop: 60,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  label: {
    flex: 1,
    fontSize: 26,
    textAlign: 'right',
    marginRight: 8,
  },
  input: {
    flex: 2,
    fontSize: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
  },
  dateInput: {
    flex: 2,
    fontSize: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
  },
  saveButton: {
    padding: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 16,
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  expenseButton: {
    backgroundColor: '#F94144',
  },
  incomeButton: {
    backgroundColor: '#90BE6D',
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 20,
  },
  dropdownContainer: {
    flex: 2,
    height: 40,
  },
  dropdownItem: {
    justifyContent: 'center',
  },
  placeholder: {
    fontSize: 30,
  },
});

export default CreateTransactions;