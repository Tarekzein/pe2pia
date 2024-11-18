import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SplashScreen from '../screens/SplashScreen';
import Welcome1Screen from '../screens/Welcome1Screen';
import Welcome2Screen from '../screens/Welcome2Screen';
import Welcome3Screen from '../screens/Welcome3Screen';
import OnboardingScreen from '../screens/OnboardingScreen';

const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

const WelcomeNavigator: React.FC = () => {
  return (

    <Stack.Navigator
      initialRouteName={'SplashScreen'}
      screenOptions={{
        headerShown: false,

      }}
    >
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="Welcome1Screen" component={Welcome1Screen} />
      <Stack.Screen name="Welcome2Screen" component={Welcome2Screen} />
      <Stack.Screen name="Welcome3Screen" component={Welcome3Screen} />
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
    </Stack.Navigator>
  );
};

export default WelcomeNavigator;
