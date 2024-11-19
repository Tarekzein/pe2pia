import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';  // Import the icon set
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import tailwind from 'twrnc';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#00347D',
        tabBarInactiveTintColor: '#FEA928',  // Inactive icon color
        tabBarStyle: {
          display: 'flex',
          flexDirection: 'row',  // Aligns the tab bar items horizontally
          backgroundColor: '#FFF8EC',  // Custom background color for the tab bar
          borderTopWidth: 0,  // Optional: removes the top border
          height: 90,  // Increase height to give more space for the icons
          justifyContent: 'center',  // Ensures the tab bar content is centered vertically
        },
        tabBarItemStyle: {
          display: 'flex',
          justifyContent: 'center',  // Centers the content horizontally
          alignItems: 'center',  // Aligns items in the center of the tab bar
        },
        tabBarIconStyle: {
          width: 50,  // Width of the icon
          height: 50,  // Height of the icon
        },
        tabBarShowLabel: false,

      }}
    >

      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          // Hides the label (icon only)
          tabBarIcon: ({ color }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <Icon name="home" color={color} size={40} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{
          // Hides the label (icon only)
          tabBarIcon: ({ color }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <Icon name="search" color={color} size={40} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="NotificationsScreen"
        component={NotificationsScreen}
        options={{
          // Hides the label (icon only)
          tabBarIcon: ({ color }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <Icon name="bell" color={color} size={40} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          // Hides the label (icon only)
          tabBarIcon: ({ color }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <Icon name="message-circle" color={color} size={40} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          // Hides the label (icon only)
          tabBarIcon: ({ color }) => (
            <View style={tailwind`flex justify-center items-center`}>
              <Icon name="user" color={color} size={40} />
            </View>
          ),
        }}
      />


    </Tab.Navigator>
  );
};

export default MainNavigator;
