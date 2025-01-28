import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { MaterialIcons } from '@expo/vector-icons'; // <-- Correct import for expo
import { Colors } from '../assets/colors';
import { useNavigation } from '@react-navigation/native';  // Import useNavigation hook

const CreateTransactions = () => {
  const [selectedTab, setSelectedTab] = useState('Expense');
  const [date, setDate] = useState(moment().format('YYYY-MM-DD'));
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const navigation = useNavigation();  // Access navigation object

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (selectedDate) => {
    setDate(moment(selectedDate).format('YYYY-MM-DD')); // Format date
    hideDatePicker();
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
        <TextInput style={styles.input} placeholder="Enter amount" keyboardType="numeric" />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Category</Text>
        <TextInput style={styles.input} placeholder="Enter category" />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Note</Text>
        <TextInput style={styles.input} placeholder="Enter note" />
      </View>
      <TouchableOpacity
        style={[
          styles.saveButton,
          selectedTab === 'Expense' ? styles.expenseButton : styles.incomeButton,
        ]}
      >
        <Text style={styles.saveText}>SAVE</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      {/* Back Arrow Button */}
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

      {/* Top Tabs */}
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

      {/* Form Section */}
      <View style={styles.formContainer}>{renderForm()}</View>

      {/* Date Picker */}
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
    fontSize: 40,
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  tabButton: {
    marginTop: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeTab: {
    backgroundColor: '#F9C74F',
  },
  tabText: {
    fontSize: 20,
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
    fontSize: 24,
    textAlign: 'right',
    marginRight: 8,
  },
  input: {
    flex: 2,
    fontSize: 20,
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
});

export default CreateTransactions;
