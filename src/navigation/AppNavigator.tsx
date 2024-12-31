// AppNavigator.js
import React, {useEffect} from 'react';
import { StatusBar } from 'react-native';

import AuthNavigator from '../modules/auth/navigation/AuthNavigator';
import MainNavigator from '../modules/app/navigation/MainNavigator';
import WelcomeNavigator from '../modules/welcome/navigation/WelcomeNavigator';
import { useAuth } from '../context/AuthContext.tsx';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {useTheme} from "../context/ThemeContext.tsx";

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

    useEffect(() => {
  //   StatusBar.setHidden(true); // Hide the status bar
  //   StatusBar.setBarStyle('light-content', true); // Set the status bar to light
    StatusBar.setBackgroundColor(isDarkMode ? '#1F2937' : '#FFF8EC'); // Set the background color of the status bar
  }, [isDarkMode]);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}
      >
        {isAuthenticated ? (
          <Stack.Screen name="MainNavigator" component={MainNavigator} />
        ) : (
          <>
            <Stack.Screen name="WelcomeNavigator" component={WelcomeNavigator} />
            <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
          </>
        )}
        {/*<Stack.Screen name="WelcomeNavigator" component={WelcomeNavigator} />*/}
        {/*<Stack.Screen name="AuthNavigator" component={AuthNavigator} />*/}
        {/*<Stack.Screen name="MainNavigator" component={MainNavigator} />*/}

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
