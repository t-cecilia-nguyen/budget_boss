import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BudgetScreen from '../screens/Budgets';
import BudgetSummaryScreen from '../screens/BudgetSummary';
import UpdateBudgetScreen from '../screens/UpdateBudgets';

const Stack = createStackNavigator();

const BudgetsStackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="BudgetScreen">
            <Stack.Screen
                name="BudgetScreen"
                component={BudgetScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="BudgetSummary"
                component={BudgetSummaryScreen}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="UpdateBudget"
                component={UpdateBudgetScreen}
                options={{
                    headerShown: false,
                }}
            />
        </Stack.Navigator>
    );
};

export default BudgetsStackNavigator;