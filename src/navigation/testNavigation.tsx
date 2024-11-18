import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TestScreen from '../modules/test/components/TestScreen';
import EmptyScreen from '../modules/test/components/EmptyScreen';
const Stack = createStackNavigator();

const TestNavigation: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="empty"
                    options={{ headerShown: false }} // This removes the default header
                    component={EmptyScreen} />
      <Stack.Screen name="test"
                    options={{ headerShown: false }} // This removes the default header
                    component={TestScreen} />
    </Stack.Navigator>
  );
};

export default TestNavigation;
