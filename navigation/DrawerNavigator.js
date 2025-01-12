import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { createDrawerNavigator} from '@react-navigation/drawer';
import { Colors } from '../assets/colors';

// Import bottom tabs
import BottomTabNavigator from './BottomTabNavigator';

// Import screens
import MyAccount from '../screens/MyAccount';
import Settings from '../screens/Settings';
import SignOut from '../screens/SignOut';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
    return (
        <Drawer.Navigator initialRouteName="Dashboard">
            <Drawer.Screen 
            name="MyAccount" 
            component={MyAccount}
            options={{
                drawerIcon: ({}) => (
                    <MaterialIcons name="account-circle" size={24} color={Colors.lightGrey}/>
                ),
                headerTitle: () => null,
            }}
            />
            <Drawer.Screen 
            name="Dashboard" 
            component={BottomTabNavigator}
            options={{
                drawerIcon: ({}) => (
                    <MaterialIcons name="leaderboard" size={24} color={Colors.lightGrey}/>
                ),
                headerTitle: () => null,
            }}
            />
            <Drawer.Screen 
            name="Settings" 
            component={Settings} 
            options={{
                drawerIcon: ({}) => (
                    <MaterialIcons name="settings" size={24} color={Colors.lightGrey}/>
                ),
                headerTitle: () => null,
            }}
            />
            <Drawer.Screen 
            name="SignOut" 
            component={SignOut}
            options={{
                drawerIcon: ({}) => (
                    <MaterialIcons name="exit-to-app" size={24} color={Colors.lightGrey}/>
                ),
                headerTitle: () => null,
            }}
            />
        </Drawer.Navigator>
    );
}