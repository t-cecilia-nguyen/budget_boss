import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DrawerNavigator from './navigation/DrawerNavigator';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import CreateTransactions from './screens/CreateTransactions';
import BottomTabNavigator from './navigation/BottomTabNavigator';

const Stack = createStackNavigator();

export default function App() {
	return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
					<Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
					<Stack.Screen name="Login" component={Login} />
					<Stack.Screen name="SignUp" component={SignUp} />
					<Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />
                    <Stack.Screen name="CreateTransactions" component={CreateTransactions} />
				</Stack.Navigator>
			</NavigationContainer>
	);
}