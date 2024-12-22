import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SearchScreen from '../screens/search/SearchScreen';
import { SearchProvider } from '../context/SearchContext';
const Stack = createStackNavigator();

const SearchNavigator = () => {
  return (
      <SearchProvider>
          <Stack.Navigator
              initialRouteName="Search"
              screenOptions={{
                  headerTitleAlign: 'center',
                  headerTitleStyle: {
                      fontFamily: 'Poppins-Medium',
                  },
                  headerShown: false,
              }}
          >
              <Stack.Screen
                  name="Search"
                  component={SearchScreen}
              />
          </Stack.Navigator>
      </SearchProvider>
  );
}

export default SearchNavigator;