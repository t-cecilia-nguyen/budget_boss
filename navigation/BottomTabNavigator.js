import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../assets/colors';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

// Import tabs
import Transactions from '../screens/Transactions';
import Overview from '../screens/Overview';
import Budgets from '../screens/Budgets';
import Categories from '../screens/Categories';
import Reports from '../screens/Reports';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator 
                initialRouteName="Categories" 
                screenOptions={{ 
                    headerShown: false, 
                    tabBarStyle: {
                        backgroundColor: Colors.darkBlue,
                    },
                    tabBarActiveTintColor: Colors.accentYellow, 
                    tabBarInactiveTintColor: Colors.grey, 
                }}>
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
                <Tab.Screen 
                    name="Budgets" 
                    component={Budgets} 
                    options={{
                        tabBarIcon: ({focused}) => (
                            <MaterialIcons 
                                name="currency-exchange" 
                                size={28} 
                                color={focused ? Colors.accentYellow : Colors.grey} />
                        ),
                    }} />
                <Tab.Screen 
                    name="Categories" 
                    component={Categories} 
                    options={{
                        tabBarIcon: ({focused}) => (
                            <MaterialIcons 
                                name="category" 
                                size={30} 
                                color={focused ? Colors.accentYellow : Colors.grey} />
                        ),
                    }} />
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
            <TouchableOpacity style={styles.floatingButton}>
                <MaterialIcons name="add" size={30} color={Colors.white} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        right: 10,
        bottom: 60,
        backgroundColor: Colors.accentYellow,
        width: 50,
        height: 50,
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
});
