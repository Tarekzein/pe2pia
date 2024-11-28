
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import MessagesScreen from '../screens/messages/MessagesScreen';
import ChatScreen from '../screens/messages/ChatScreen';

const Stack = createStackNavigator();
const MessagesNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Messages"
      screenOptions={{
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: 'Poppins-Medium',
        },
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Messages"
        component={MessagesScreen}
      />
      <Stack.Screen
        name="Chat"
        component={ChatScreen}
      />
    </Stack.Navigator>
  );
}

export default MessagesNavigator;
