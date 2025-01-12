import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../assets/colors';

// Import tabs
import Transactions from '../screens/Transactions';
import Overview from '../screens/Overview';
import Budgets from '../screens/Budgets';
import Categories from '../screens/Categories';
import Reports from '../screens/Reports';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator 
        initialRouteName="Transactions" 
        screenOptions={{ 
            headerShown: false, 
            tabBarActiveTintColor: Colors.accentYellow, 
            tabBarInactiveTintColor: Colors.lightGrey }}>
            <Tab.Screen 
            name="Transactions" 
            component={Transactions}
            options={{
                tabBarIcon: ({focused}) => (
                    <MaterialIcons 
                    name="view-list" 
                    size={28} 
                    color={focused ? Colors.accentYellow : Colors.lightGrey} />
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
                    color={focused ? Colors.accentYellow : Colors.lightGrey} />
                ),
            }}
            />
            <Tab.Screen 
            name="Budgets" 
            component={Budgets} 
            options={{
                tabBarIcon: ({focused}) => (
                    <MaterialIcons 
                    name="currency-exchange" 
                    size={28} 
                    color={focused ? Colors.accentYellow : Colors.lightGrey} />
                ),
            }}
            />
            <Tab.Screen 
            name="Categories" 
            component={Categories} 
            options={{
                tabBarIcon: ({focused}) => (
                    <MaterialIcons 
                    name="category" 
                    size={30} 
                    color={focused ? Colors.accentYellow : Colors.lightGrey} />
                ),
            }}
            />
            <Tab.Screen 
            name="Reports" 
            component={Reports} 
            options={{
                tabBarIcon: ({focused}) => (
                    <MaterialIcons 
                    name="stacked-line-chart" 
                    size={28} 
                    color={focused ? Colors.accentYellow : Colors.lightGrey} />
                ),
            }}
            />
        </Tab.Navigator>
    );
}