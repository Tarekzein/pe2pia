import React, { useEffect, useMemo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { View } from 'react-native';
import tailwind from 'twrnc';
import SearchNavigator from './SearchNavigator';
import MessagesNavigator from './MessagesNavigator';
import ProfileNavigator from './ProfileNavigator';
import HomeNavigator from './HomeNavigator';
import NotificationsNavigator from './NotificationsNavigator';
import { useTheme } from '../../../context/ThemeContext';
import { initializeNotifications } from '../services/fcm/notificationService';
import { EventArg, ParamListBase } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

// Memoized icon components (keep the same as before)
const MemoizedHomeIcon = React.memo(({ color, focused }: { color: string; focused: boolean }) => (
  <MaterialIcon
    name={focused ? 'home-variant' : 'home-variant-outline'}
    color={color}
    size={30}
  />
));


const MemoizedSearchIcon = React.memo(({ color }: { color: string }) => (
  <FeatherIcon name="search" color={color} size={30} />
));

const MemoizedBellIcon = React.memo(({ color, focused }: { color: string; focused: boolean }) => (
  <MaterialIcon name={focused ? 'bell' : 'bell-outline'} color={color} size={30} />
));

const MemoizedChatIcon = React.memo(({ color, focused }: { color: string; focused: boolean }) => (
  <MaterialIcon name={focused ? 'chat' : 'chat-outline'} color={color} size={30} />
));

const MemoizedAccountIcon = React.memo(({ color, focused }: { color: string; focused: boolean }) => (
  <MaterialIcon name={focused ? 'account' : 'account-outline'} color={color} size={30} />
));

const MainNavigator = React.memo(() => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Preload icon fonts
  useEffect(() => {
    Promise.all([
      MaterialIcon.loadFont(),
      FeatherIcon.loadFont(),
    ]).catch((error) => console.error('Icon loading error:', error));
  }, []);

  useEffect(() => {
    initializeNotifications();
  }, []);

  const screenOptions = useMemo(() => ({
    tabBarHideOnKeyboard: true,
    tabBarActiveTintColor: isDarkMode ? '#FEA928' : '#00347D',
    tabBarInactiveTintColor: isDarkMode ? '#FFF8EC' : '#FEA928',
    tabBarStyle: {
      backgroundColor: isDarkMode ? 'rgb(31 41 55)' : '#FFF8EC',
      borderTopColor: isDarkMode ? '#D1D5DB' : '#00347D66',
      height: 60,
      paddingBottom: 8,
      paddingTop: 8,
    },
    tabBarShowLabel: false,
    headerShown: false,
  }), [isDarkMode]);

  return (
    <Tab.Navigator
      initialRouteName="HomeNavigation"
      screenOptions={screenOptions}>

      <Tab.Screen
        name="HomeNavigation"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View style={tailwind`items-center justify-center`}>
              <MemoizedHomeIcon color={color} focused={focused} />
            </View>
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            e.preventDefault();
            const now = Date.now();
            const lastTap = (navigation as any).lastTap || 0;

            if (now - lastTap < 300) {
              navigation.navigate('HomeNavigation', {
                screen: 'Home',
                params: { type: 'doubleTabPress' }
              });
            } else {
              navigation.navigate('HomeNavigation');
            }
            (navigation as any).lastTap = now;
          },
        })}
      />

      <Tab.Screen
        name="SearchNavigation"
        component={SearchNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <View style={tailwind`items-center justify-center`}>
              <MemoizedSearchIcon color={color} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="NotificationsNavigation"
        component={NotificationsNavigator}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View style={tailwind`items-center justify-center`}>
              <MemoizedBellIcon color={color} focused={focused} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="MessagesNavigation"
        component={MessagesNavigator}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View style={tailwind`items-center justify-center`}>
              <MemoizedChatIcon color={color} focused={focused} />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ProfileNavigation"
        component={ProfileNavigator}
        options={{
          tabBarIcon: ({color, focused}) => (
            <View style={tailwind`items-center justify-center`}>
              <MemoizedAccountIcon color={color} focused={focused} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
});

export default MainNavigator;
