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
				{/* Set default screen to Login */}
				<Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
					{/* Main Drawer Navigator */}	
					<Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />

					{/* Login screen */}
					<Stack.Screen name="Login" component={Login} />

					{/* Sign Up screen */}
					<Stack.Screen name="SignUp" component={SignUp} />

					{/* Bottom Tab Navigator */}
					<Stack.Screen name="BottomTabNavigator" component={BottomTabNavigator} />

					{/* Create Transactions screen */}
                    <Stack.Screen name="CreateTransactions" component={CreateTransactions} />
				</Stack.Navigator>
			</NavigationContainer>
	);
}