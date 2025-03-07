import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../assets/colors';

export default function FAQ() {
    const [expanded, setExpanded] = useState(null);

    const faqs = [
        {
        question: 'How do I update my account information?',
        answer: (
            <Text>Navigate to My Account from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} />, 
            and edit your first name, last name, or email in the form. 
            Save to apply the changes.</Text>
            ),
        },
        {
        question: 'How do I change my password?',
        answer: (
            <Text>Navigate to My Account from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} />, 
            tap on Login and Security, enter your new password and confirm it. 
            Save to update your password.</Text>
        ),
        },
        {
        question: 'How do I add an expense or income?',
        answer: (
            <Text>Navigate to the Dashboard from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} />,
            then tap the Add button <MaterialIcons name="add-circle-outline" size={14} color={Colors.primaryBlue} /> at the bottom right of the screen.
            Choose whether to add an Expense or Income by selecting the appropriate tab.{"\n\n"}
            Fill out the form with the following details:{"\n\n"}
            - Date: Pick the date for the transaction.{"\n"}
            - Amount: Enter the amount of the expense or income.{"\n"}
            - Category: Choose a category from the dropdown menu (e.g., Groceries, Salary).{"\n"}
            - Note (optional): Add any extra details or descriptions for the transaction.{"\n\n"}
            Once all required fields are filled, tap Save to record your entry.</Text>
        ),
        },
        {
        question: 'How do I add a budget?',
        answer: (
            <Text>Navigate to the Dashboard from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} /> and tap on the Budgets tab <MaterialIcons name="currency-exchange" size={12} color={Colors.primaryBlue} /> at the bottom of the screen.{"\n\n"}
            Fill out the form with the following details:{"\n\n"}
            - Start and End Date: Set the duration for your budget.{"\n"}
            - Amount: Enter the amount for the budget limit.{"\n"}
            - Category: Choose a category from the dropdown menu to organize your budget (e.g., Groceries, Bills).{"\n"}
            - Note (optional): Add any extra details or descriptions for the budget.{"\n\n"}
            Once all required fields are filled, tap Submit Budget to record your entry.</Text>
        ),
        },
        {
        question: 'Where do I view my budgets?',
        answer: (
            <Text>Navigate to the Dashboard from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} />,
            then tap the Budgets tab <MaterialIcons name="currency-exchange" size={10} color={Colors.primaryBlue} /> at the bottom of the screen.
            Tap the Your Budgets Summary button to see all your budgets for the current month.{"\n"}
            The summary displays the budgeted amount, amount spent, and remaining balance for each category. 
            At the top of the screen, you can use the arrow buttons to navigate to different months and review past or upcoming budgets.</Text>
        ),
        },
        {
        question: 'How do I manage my categories?',
        answer: (
            <Text>Navigate to the Dashboard from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} />,
            then tap the Categories tab <MaterialIcons name="category" size={10} color={Colors.primaryBlue} /> at the bottom of the screen.
            Here, you can view all your existing categories or create new ones. To create a new category, tap Add New Category.{"\n\n"}
            Fill out the form with the following details:{"\n\n"}
            - Name: Provide a name for your category.{"\n"}
            - Choose an icon: Tap <MaterialIcons name="edit" size={10} color={Colors.primaryBlue}/> to select an icon that best represents the category.{"\n"}
            - Description (optional): Add a brief description about the purpose of this category.{"\n"}
            - Select the type of Category (Income or Expense): Choose whether this category will be for tracking income or expenses.{"\n\n"}
            Once all required fields are filled, tap Save to add the category to your list.</Text>
        ),
    },
        {
        question: 'I forgot my password.',
        answer: (
            <Text>On the Login screen, tap 'Forgot Password'. Enter your registered email, and you'll receive a link to reset your password.</Text>
        ),
        },
    ];

    return (
        <ScrollView style={styles.container}>
        <Text style={styles.title}>Frequently Asked Questions (FAQ)</Text>

        {/* General Questions */}
        <View style={styles.sectionContainer}>
            <Text style={styles.titleText}>GENERAL QUESTIONS</Text>
            {faqs.slice(0, 2).map((faq, index) => (
            <View key={index} style={styles.textContainer}>
                <TouchableOpacity onPress={() => setExpanded(expanded === index ? null : index)}>
                <View style={styles.row}>
                    <Text style={styles.question}>
                    {faq.question}
                    </Text>
                    <MaterialIcons
                    name={expanded === index ? 'expand-less' : 'expand-more'}
                    size={24}
                    color={Colors.primaryBlue}
                    />
                </View>
                </TouchableOpacity>
                {expanded === index && <Text style={styles.answer}>{faq.answer}</Text>}
            </View>
            ))}
        </View>

        {/* Features and Functionality */}
        <Text style={styles.titleText}>FEATURES AND FUNCTIONALITY</Text>
        {faqs.slice(2, 6).map((faq, index) => (
            <View key={index} style={styles.textContainer}>
            <TouchableOpacity onPress={() => setExpanded(expanded === index + 2 ? null : index + 2)}>
                <View style={styles.row}>
                <Text style={styles.question}>
                    {faq.question}
                </Text>
                <MaterialIcons
                    name={expanded === index + 2 ? 'expand-less' : 'expand-more'}
                    size={24}
                    color={Colors.primaryBlue}
                />
                </View>
            </TouchableOpacity>
            {expanded === index + 2 && <Text style={styles.answer}>{faq.answer}</Text>}
            </View>
        ))}

        {/* Troubleshooting */}
        <Text style={styles.titleText}>TROUBLESHOOTING</Text>
        {faqs.slice(6).map((faq, index) => (
            <View key={index} style={styles.textContainer}>
            <TouchableOpacity onPress={() => setExpanded(expanded === index + 6 ? null : index + 6)}>
                <View style={styles.row}>
                <Text style={styles.question}>
                    {faq.question}
                </Text>
                <MaterialIcons
                    name={expanded === index + 6 ? 'expand-less' : 'expand-more'}
                    size={24}
                    color={Colors.primaryBlue}
                />
                </View>
            </TouchableOpacity>
            {expanded === index + 6 && <Text style={styles.answer}>{faq.answer}</Text>}
            </View>
        ))}
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: Colors.primaryBlue,
        textAlign: 'center',
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.darkBlue,
        marginBottom: 10,
        marginTop: 20,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    textContainer: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#D3D3D3',
        paddingBottom: 10,
    },
    question: {
        fontSize: 16,
        color: Colors.primaryBlue,
        marginBottom: 5,
        flex: 1,
    },
    answer: {
        fontSize: 14,
        color: Colors.dark,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
