
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import MessagesScreen from '../screens/messages/MessagesScreen';
import ChatScreen from '../screens/messages/ChatScreen';
import { MessagesProvider } from '../context/MessagesContext';

const Stack = createStackNavigator();
const MessagesNavigator = () => {
  return (
      <MessagesProvider>
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
      </MessagesProvider>
  );
}

export default MessagesNavigator;
