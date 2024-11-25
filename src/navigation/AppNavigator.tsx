// AppNavigator.js
import React, {useEffect} from 'react';
import { StatusBar } from 'react-native';

import AuthNavigator from '../modules/auth/navigation/AuthNavigator';
import MainNavigator from '../modules/app/navigation/MainNavigator';
import WelcomeNavigator from '../modules/welcome/navigation/WelcomeNavigator';
import { useAuth } from '../hooks/AuthProvider';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  // useEffect(() => {
  //   StatusBar.setHidden(true); // Hide the status bar
  //   StatusBar.setBarStyle('light-content');
  //   StatusBar.setBackgroundColor('transparent');
  // }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/*{isAuthenticated ? (*/}
        {/*  <Stack.Screen name="MainNavigator" component={MainNavigator} />*/}
        {/*) : (*/}
        {/*  <>*/}
        {/*    <Stack.Screen name="WelcomeNavigator" component={WelcomeNavigator} />*/}
        {/*    <Stack.Screen name="AuthNavigator" component={AuthNavigator} />*/}
        {/*  </>*/}
        {/*)}*/}
        {/*<Stack.Screen name="WelcomeNavigator" component={WelcomeNavigator} />*/}
        {/*<Stack.Screen name="AuthNavigator" component={AuthNavigator} />*/}
        <Stack.Screen name="MainNavigator" component={MainNavigator} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
