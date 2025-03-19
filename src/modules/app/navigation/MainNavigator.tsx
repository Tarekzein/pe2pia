import React, { useEffect, useMemo } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
import {
  EventArg,
  MaterialTopTabNavigationProp,
  ParamListBase
} from '@react-navigation/native';

const Tab = createMaterialTopTabNavigator();

// Memoized icon components
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

  // Notification initialization
  useEffect(() => {
    initializeNotifications();
  }, []);

  // Status bar configuration
  // useEffect(() => {
  //   StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  //   StatusBar.setBackgroundColor('transparent');
  //   StatusBar.setTranslucent(true);
  // }, [isDarkMode]);

  // Memoized screen options
  const screenOptions = useMemo(() => ({
    gestureEnabled: true, // Enables swipe gestures for navigation
    animationEnabled: true, // Enables smooth animation
    tabBarActiveTintColor: isDarkMode ? '#FEA928' : '#00347D',
    tabBarInactiveTintColor: isDarkMode ? '#FFF8EC' : '#FEA928',
    tabBarIndicatorStyle: {
      backgroundColor: isDarkMode ? '#FEA928' : '#00347D',
      height: 3,
    },
    tabBarStyle: {
      backgroundColor: isDarkMode ? 'rgb(31 41 55)' : '#FFF8EC',
      borderTopColor: isDarkMode ? '#D1D5DB' : '#00347D66',
      // height: 60,
      borderTopWidth: 0,
    },
    tabBarItemStyle: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingBottom: 4,
    },
    tabBarLabelStyle: {
      fontSize: 12,
      marginTop: -4,
    },
    tabBarShowLabel: false,
    headerShown: false,
  }), [isDarkMode]);
  const lastTapRef = React.useRef(0);

  return (
    <Tab.Navigator
      initialRouteName="HomeNavigation"
      screenOptions={screenOptions}
      tabBarPosition={'bottom'}>

      <Tab.Screen
        name="HomeNavigation"
        component={HomeNavigator}
        options={({navigation}) => ({
          tabBarIcon: ({color, focused}) => (
            <View style={tailwind``}>
              <MemoizedHomeIcon color={color} focused={focused} />
            </View>
          ),
        })}
        listeners={({navigation}) => ({
          tabPress: (e: EventArg<'tabPress', true, { navigation: MaterialTopTabNavigationProp<ParamListBase> }>) => {
            // Prevent default behavior
            e.preventDefault();

            const now = Date.now();
            const lastTap = (navigation as any).lastTap || 0;

            if (now - lastTap < 300) {
              // Double tap detected
              navigation.navigate('HomeNavigation', {
                screen: 'Home',
                params: { type: 'doubleTabPress' }
              });
            } else {
              // Default navigation behavior
              navigation.navigate('HomeNavigation');
            }

            // Update last tap time
            (navigation as any).lastTap = now;
          },
        })}
      />

      <Tab.Screen
        name="SearchNavigation"
        component={SearchNavigator}
        options={{
          tabBarIcon: ({color}) => (
            <View style={tailwind``}>
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
            <View style={tailwind``}>
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
            <View style={tailwind``}>
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
            <View style={tailwind``}>
              <MemoizedAccountIcon color={color} focused={focused} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
});

export default MainNavigator;
