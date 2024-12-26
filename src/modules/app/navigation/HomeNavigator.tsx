
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import HomeScreen from '../screens/home/HomeScreen';
import CreatePostScreen from '../screens/home/CreatePostScreen';
import { HomeProvider } from '../context/HomeContext';
const Stack = createStackNavigator();
const HomeNavigator = () => {
  return (
      <HomeProvider>
          <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                      fontFamily: 'Poppins-Medium',
                  },
                  headerShown: false,
              }}
          >
              <Stack.Screen
                  name="Home"
                  component={HomeScreen}
              />
              <Stack.Screen
                  name="CreatePost"
                  component={CreatePostScreen}
              />
          </Stack.Navigator>
      </HomeProvider>
  );
}

export default HomeNavigator;
