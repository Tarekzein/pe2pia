import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';  // Change to Material Top Tab
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import SearchNavigator from './SearchNavigator';
import MessagesNavigator from './MessagesNavigator';
import ProfileNavigator from './ProfileNavigator';
import HomeNavigator from './HomeNavigator';
import NotificationsNavigator from './NotificationsNavigator';
import tailwind from 'twrnc';
import { View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

const Tab = createMaterialTopTabNavigator();  // Updated to Material Top Tab


const MainNavigator: React.FC = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        // headerShown: false,
        tabBarActiveTintColor: isDarkMode ? '#FEA928' : '#00347D',
        tabBarInactiveTintColor: isDarkMode ? '#FFF8EC' : '#FEA928',
        tabBarIndicatorStyle: {
          backgroundColor: 'transparent',
        },
        tabBarStyle: {
          display: 'flex',
          backgroundColor: isDarkMode ? 'rgb(31 41 55)' : '#FFF8EC',
          borderTopWidth: 0.2, // No border for the top tab bar
          borderTopColor: isDarkMode ? '#D1D5DB' : '#00347D66'  ,
          height: 60,
          // marginBottom:20,
        },
        tabBarItemStyle: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarShowLabel: false,
      }}
      tabBarPosition="bottom"

    >
      <Tab.Screen
        name="HomeScreen"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <MaterialIcon
                name={focused ? 'home-variant' : 'home-variant-outline'}
                color={color}
                size={35}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="SearchScreen"
        component={SearchNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <FeatherIcon
                name={focused ? 'search' : 'search'}
                color={color}
                size={35}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="NotificationsScreen"
        component={NotificationsNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <MaterialIcon
                name={focused ? 'bell' : 'bell-outline'}
                color={color}
                size={35}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MessagesScreen"
        component={MessagesNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <MaterialIcon
                name={focused ? 'chat' : 'chat-outline'}
                color={color}
                size={35}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ProfileScreen"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <MaterialIcon
                name={focused ? 'account' : 'account-outline'}
                color={color}
                size={35}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;
