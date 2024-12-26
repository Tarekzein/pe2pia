import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import NotificationsScreen from '../screens/notifications/NotificationsScreen.tsx';
import { NotificationsProvider } from '../context/NotificationsContext.tsx';

const Stack = createStackNavigator();

const NotificationsNavigator = () => {
    return (
        <NotificationsProvider>
            <Stack.Navigator
                initialRouteName="Notifications"
                screenOptions={{
                    headerTitleAlign: 'center',
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Medium',
                    },
                    headerShown: false,
                }}
            >
                <Stack.Screen
                    name="Notifications"
                    component={NotificationsScreen}
                />
            </Stack.Navigator>
        </NotificationsProvider>
    );
};

export default NotificationsNavigator;
