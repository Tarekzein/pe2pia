import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';  // Change to Material Top Tab
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import MessagesNavigator from './MessagesNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import tailwind from 'twrnc';
import { View } from 'react-native';

const Tab = createMaterialTopTabNavigator();  // Updated to Material Top Tab


const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        // headerShown: false,
        tabBarActiveTintColor: '#00347D',
        tabBarInactiveTintColor: '#FEA928',
        tabBarIndicatorStyle: {
          backgroundColor: 'transparent',
        },
        tabBarStyle: {
          display: 'flex',
          backgroundColor: '#FFF8EC',
          borderBottomWidth: 0, // No border for the top tab bar
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
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <MaterialIcon
                name={focused ? "home-variant" : "home-variant-outline"}
                color={color}
                size={35}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <FeatherIcon
                name={focused ? "search" : "search"}
                color={color}
                size={35}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <MaterialIcon
                name={focused ? "bell" : "bell-outline"}
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
                name={focused ? "chat" : "chat-outline"}
                color={color}
                size={35}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <MaterialIcon
                name={focused ? "account" : "account-outline"}
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
