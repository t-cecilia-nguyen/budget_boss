import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Colors } from '../assets/colors';

export default function FAQ() {
    const [expanded, setExpanded] = useState(null);

    // FAQ data
    const faqs = [
        // FEATURES AND FUNCTIONALITY
        {
            // 1
            question: 'How do I add a transaction?',
            answer: (
                <Text>Navigate to the <Text style={{ color: Colors.primaryBlue }}>Dashboard</Text> from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} />,
                then tap the Add button <MaterialIcons name="add-circle-outline" size={14} color={Colors.primaryBlue} /> at the bottom right of the screen.
                Choose whether to add an Expense or Income by selecting the appropriate tab.{"\n\n"}
                Fill out the form with the following details:{"\n\n"}
                - Date: Pick the date for the transaction.{"\n"}
                - Amount: Enter the amount of the expense or income.{"\n"}
                - Category: Choose a category from the dropdown menu (e.g., Groceries, Salary).{"\n"}
                - Note (optional): Add any extra details or descriptions for the transaction.{"\n\n"}
                Once all required fields are filled, tap <Text style={{ color: Colors.primaryBlue }}>Save</Text> to record your entry.</Text>
            ),
        },
        {
            question: 'How do I delete a transaction?',
            answer: (
                <Text>Navigate to the <Text style={{ color: Colors.primaryBlue }}>Dashboard</Text> from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} /> and tap on the Transactions tab <MaterialIcons name="view-list" size={12} color={Colors.primaryBlue} /> at the bottom of the screen.
                Click on the transaction you want to delete and the <Ionicons name="close-circle" size={12} color={Colors.primaryBlue} /> icon will appear on the right-hand side of the transaction.{"\n\n"}
                Tap the <Ionicons name="close-circle" size={12} color={Colors.primaryBlue} /> to delete the transaction. A confirmation message will appear confirming the transaction was deleted successfully.
                Press <Text style={{ color: Colors.primaryBlue }}>OK</Text> to continue.</Text>
            ),
        },
        
        {
            question: 'How do I add a budget?',
            answer: (
                <Text>Navigate to the <Text style={{ color: Colors.primaryBlue }}>Dashboard</Text> from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} /> and tap on the Budgets tab <MaterialIcons name="currency-exchange" size={12} color={Colors.primaryBlue} /> at the bottom of the screen.{"\n\n"}
                Fill out the form with the following details:{"\n\n"}
                - Start and End Date: Set the duration for your budget.{"\n"}
                - Amount: Enter the amount for the budget limit.{"\n"}
                - Amount Spent: Enter the amount you've already spent for this budget.{"\n"}
                - Category: Choose a category from the dropdown menu to organize your budget (e.g., Groceries, Bills).{"\n"}
                - Note (optional): Add any extra details or descriptions for the budget.{"\n\n"}
                Once all required fields are filled, tap <Text style={{ color: Colors.primaryBlue }}>Submit Budget</Text> to record your entry.</Text>
            ),
        },
        {
            question: 'Where do I view my budgets?',
            answer: (
                <Text>Navigate to the Dashboard from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} />,
                then tap the Budgets tab <MaterialIcons name="currency-exchange" size={10} color={Colors.primaryBlue} /> at the bottom of the screen.
                Tap the <Text style={{ color: Colors.primaryBlue }}>Your Budgets Summary</Text> button to see all your budgets for the current month.{"\n"}
                The summary displays the budgeted amount, amount spent, and remaining balance for each category. 
                At the top of the screen, you can use the arrow buttons to navigate to different months and review past or upcoming budgets.</Text>
            ),
        },
        {
            question: 'How do I edit my budget?',
            answer: (
                <Text>In the budget summary, click on <MaterialIcons name="edit" size={10} color={Colors.primaryBlue}/> to expand the category budget. In the expanded view, you'll see options to update and delete the budget.
                Tap <Text style={{ color: Colors.primaryBlue }}>Update</Text> to open a form where you can edit the following:{"\n\n"}
                - Start and End Date: Set the duration for your budget.{"\n"}
                - Amount: Enter the amount for the budget limit.{"\n"}
                - Amount Spent: Enter the amount you've already spent for this budget.{"\n"}
                - Category: Choose a category from the dropdown menu to organize your budget (e.g., Groceries, Bills).{"\n"}
                - Note (optional): Add any extra details or descriptions for the budget.{"\n\n"}
                Once all required fields are filled, tap <Text style={{ color: Colors.primaryBlue }}>Update Budget</Text> Budget to record your entry.</Text>
            ),
        },
        {
            question: 'How do I delete my budget?',
            answer: (
                <Text>In the budget summary, click on <Text style={{ color: Colors.primaryBlue }}>{"\u25B6"}</Text> to expand the category budget. In the expanded view, you'll see options to update and delete the budget.
                Tap <Text style={{ color: Colors.primaryBlue }}>Delete</Text> to remove the budget from your list.{"\n\n"}
                A prompt will appear asking for confirmation. To confirm, tap <Text style={{ color: Colors.primaryBlue }}>DELETE</Text>. 
                If you wish to cancel, tap <Text style={{ color: Colors.primaryBlue }}>CANCEL</Text> to exit without making any changes.</Text>
            ),
        },
        {
            // 7
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
        // USER SUPPORT
        {
            // 8
            question: 'How can I submit feedback or report an issue?',
            answer: (
                <Text>If you have any questions, concerns, or feedback regarding the app, you can submit it through the <Text style={{ color: Colors.primaryBlue }}>Feedback</Text> section.
                Navigate to the <Text style={{ color: Colors.primaryBlue }}>Settings</Text> from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} />, 
                and select <Text style={{ color: Colors.primaryBlue }}>Submit Feedback</Text>.{"\n\n"} 
                Rate your experience by tapping on a smiley face that best represents your feedback. 
                Provide any details or suggestions you have about your experience and tap <Text style={{ color: Colors.primaryBlue }}>Submit</Text>.{"\n\n"}
                We value your input and will keep you updated with any changes or improvements based on your feedback.</Text>
            ),
        },
        // GENERAL QUESTIONS
        {
            // 9
            question: 'How do I update my account information?',
            answer: (
                <Text>Navigate to <Text style={{ color: Colors.primaryBlue }}>My Account</Text> from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} />, 
                and edit your first name, last name, or email in the form. 
                Tap <Text style={{ color: Colors.primaryBlue }}>Save</Text> to apply the changes.</Text>
            ),
        },
        {
            // 10
            question: 'How do I change my password?',
            answer: (
                <Text>Navigate to <Text style={{ color: Colors.primaryBlue }}>My Account</Text> from the top left menu <MaterialIcons name="menu" size={8} color={Colors.primaryBlue} />, 
                tap on <Text style={{ color: Colors.primaryBlue }}>Login and Security</Text>, enter your new password and confirm it. 
                Tap <Text style={{ color: Colors.primaryBlue }}>Save</Text> to update your password.</Text>
            ),
        },
    ];

    return (
        <ScrollView style={styles.scrollViewContent}>
            <View style={styles.container}>

                {/* FAQ Title */}
                <Text style={styles.title}>Help and Support</Text>

                {/* FEATURES AND FUNCTIONALITY */}
                <Text style={styles.titleText}>FEATURES AND FUNCTIONALITY</Text>

                {/* Map through the FAQ data: 1 to 7 */}
                {faqs.slice(0, 7).map((faq, index) => (
                <View key={index} style={styles.textContainer}>

                    {/* Expandable Question */}
                    <TouchableOpacity onPress={() => setExpanded(expanded === index ? null : index)}>
                    <View style={styles.row}>
                        <Text style={styles.question}>
                        {faq.question}
                        </Text>

                        {/* Expand/Collapse Icon */}
                        <MaterialIcons
                        name={expanded === index ? 'expand-less' : 'expand-more'}
                        size={24}
                        color={Colors.primaryBlue}
                        />
                    </View>
                    </TouchableOpacity>

                    {/* Answer */}
                    {expanded === index && <Text style={styles.answer}>{faq.answer}</Text>}
                </View>
                ))}

                {/* USER SUPPORT */}
                <Text style={styles.titleText}>USER SUPPORT</Text>

                {/* Map through the FAQ data: 8 */}
                {faqs.slice(7, 8).map((faq, index) => (
                    <View key={index} style={styles.textContainer}>

                    {/* Expandable Question */}
                    <TouchableOpacity onPress={() => setExpanded(expanded === index + 7 ? null : index + 7)}>
                        <View style={styles.row}>
                        <Text style={styles.question}>
                            {faq.question}
                        </Text>

                        {/* Expand/Collapse Icon */}
                        <MaterialIcons
                            name={expanded === index + 7 ? 'expand-less' : 'expand-more'}
                            size={24}
                            color={Colors.primaryBlue}
                        />
                        </View>
                    </TouchableOpacity>

                    {/* Answer */}
                    {expanded === index + 7 && <Text style={styles.answer}>{faq.answer}</Text>}
                    </View>
                ))}

                {/* GENERAL */}
                <Text style={styles.titleText}>GENERAL</Text>

                {/* Map through the FAQ data: 9 to 10 */}
                {faqs.slice(8, 10).map((faq, index) => (
                    <View key={index} style={styles.textContainer}>

                    {/* Expandable Question */}
                    <TouchableOpacity onPress={() => setExpanded(expanded === index + 8 ? null : index + 8)}>
                        <View style={styles.row}>
                        <Text style={styles.question}>
                            {faq.question}
                        </Text>

                        {/* Expand/Collapse Icon */}
                        <MaterialIcons
                            name={expanded === index + 8 ? 'expand-less' : 'expand-more'}
                            size={24}
                            color={Colors.primaryBlue}
                        />
                        </View>
                    </TouchableOpacity>

                    {/* Answer */}
                    {expanded === index + 8 && <Text style={styles.answer}>{faq.answer}</Text>}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
    }

    const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        padding: 30,  
    },
    container: {
        flex: 1,
        paddingBottom: 30,
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
        color: Colors.darkBlue,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
