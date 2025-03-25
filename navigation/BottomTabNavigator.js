import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../assets/colors";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from '@react-navigation/native'; // <-- Import useNavigation

// Import tabs
import Transactions from '../screens/Transactions';
import Overview from '../screens/Overview';
import BudgetsStackNavigator from './BudgetsStackNavigator';
import Categories from '../screens/Categories';
import Reports from '../screens/Reports';
import CreateCategory from "../components/categories/CreateCategory";
import EditCategory from "../components/categories/EditCategory";
import CreateTransactions from '../screens/CreateTransactions'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Categories stack
function CategoriesStack() {
    return (
        <Stack.Navigator>
        <Stack.Screen
            name="CategoriesList"
            component={Categories}
            options={{ headerShown: false }}
        />
        <Stack.Screen
            name="CreateCategory"
            component={CreateCategory}
            options={{
            headerShown: true,
            headerTitle: "New Category",
            }}
        />
        <Stack.Screen
            name="EditCategory"
            component={EditCategory}
            options={{
            headerShown: true,
            headerTitle: "Edit Category",
            }}
        />
        </Stack.Navigator>
    );
}

// Bottom tab navigator
export default function BottomTabNavigator() {
    const navigation = useNavigation(); // <-- Use useNavigation hook

    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                initialRouteName="Transactions"
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: Colors.darkBlue,
                    },
                    tabBarActiveTintColor: Colors.accentYellow,
                    tabBarInactiveTintColor: Colors.grey,
                }}>

                {/* Transactions tab */}
                <Tab.Screen
                    name="Transactions"
                    component={Transactions}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <MaterialIcons
                                name="view-list"
                                size={28}
                                color={focused ? Colors.accentYellow : Colors.grey} />
                        ),
                    }} />

                {/* Overview tab */}
                <Tab.Screen
                    name="Overview"
                    component={Overview}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <MaterialIcons
                                name="pie-chart"
                                size={28}
                                color={focused ? Colors.accentYellow : Colors.grey} />
                        ),
                    }} />

                {/* Budgets tab */}
                <Tab.Screen
                    name="Budgets"
                    component={BudgetsStackNavigator}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <MaterialIcons
                                name="currency-exchange"
                                size={28}
                                color={focused ? Colors.accentYellow : Colors.grey} />
                        ),
                    }} />

                {/* Categories tab */}
                <Tab.Screen
                    name="Categories"
                    component={CategoriesStack}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <MaterialIcons
                                name="category"
                                size={30}
                                color={focused ? Colors.accentYellow : Colors.grey} />
                        ),
                    }} />

                {/* Reports tab */}
                <Tab.Screen
                    name="Reports"
                    component={Reports}
                    options={{
                        tabBarIcon: ({focused}) => (
                            <MaterialIcons
                                name="stacked-line-chart"
                                size={28}
                                color={focused ? Colors.accentYellow : Colors.grey} />
                        ),
                    }} />
            </Tab.Navigator>

            {/* Add button */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => navigation.navigate('Create Transactions')} // Navigate to Create Transactions tab
            >
                <MaterialIcons name="add" size={25} color={Colors.white} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: "absolute",
        right: 10,
        bottom: 60,
        backgroundColor: Colors.accentYellow,
        width: 40,
        height: 40,
        borderRadius: "50%",
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
    },
});
