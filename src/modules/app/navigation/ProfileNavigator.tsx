import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import LanguageScreen from '../screens/profile/LanguageScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import { ProfileProvider } from '../context/ProfileContext';
const Stack = createStackNavigator();
const ProfileNavigator = () => {
    return (
      <ProfileProvider>
        <Stack.Navigator
            initialRouteName="Profile"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
            />
            <Stack.Screen
                name="Settings"
                component={SettingsScreen}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
            />
            <Stack.Screen
                name="Language"
                component={LanguageScreen}
            />
        </Stack.Navigator>
      </ProfileProvider>
    );
}

export default ProfileNavigator;
