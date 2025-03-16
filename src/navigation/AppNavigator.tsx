// AppNavigator.tsx
import React, { useEffect, useState } from 'react';
import { Alert, ActivityIndicator, View } from 'react-native';
import AuthNavigator from '../modules/auth/navigation/AuthNavigator';
import MainNavigator from '../modules/app/navigation/MainNavigator';
import WelcomeNavigator from '../modules/welcome/navigation/WelcomeNavigator';
import { useAuth } from '../context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RESULTS } from 'react-native-permissions';
import {
  checkMultiplePermissions,
  requestMultiplePermissions,
  PermissionType,
} from '../modules/app/services/permissions/permissionService';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useAuth();
  const [permissionsChecked, setPermissionsChecked] = useState(false);

  useEffect(() => {
    checkAndRequestPermissions();
  }, []);

  const handlePermissionDenial = (permissionType: string) => {
    Alert.alert(
      `${permissionType} Permission Required`,
      `This app needs ${permissionType.toLowerCase()} access to function properly. Would you like to open settings?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open Settings',
          onPress: () => {
            // Import and use openSettings from react-native-permissions if needed
          }
        }
      ]
    );
  };

  const checkAndRequestPermissions = async () => {
    try {
      // Define all required permissions
      const requiredPermissions: PermissionType[] = [
        'CAMERA',
        'LOCATION',
        'NOTIFICATION',
        'STORAGE'
      ];

      // Check all permissions at once
      const statuses = await checkMultiplePermissions(requiredPermissions);

      // Filter permissions that need to be requested
      const permissionsToRequest = Object.entries(statuses)
        .filter(([_, status]) => status !== RESULTS.GRANTED)
        .map(([permission]) => permission as PermissionType);

      if (permissionsToRequest.length > 0) {
        // Request all necessary permissions
        const newStatuses = await requestMultiplePermissions(permissionsToRequest);

        // Check for any denied permissions and show appropriate alerts
        Object.entries(newStatuses).forEach(([permission, status]) => {
          if (status !== RESULTS.GRANTED) {
            handlePermissionDenial(permission);
          }
        });
      }

      // Mark permissions as checked regardless of outcome
      setPermissionsChecked(true);

    } catch (error) {
      console.error('Error checking permissions:', error);
      Alert.alert(
        'Permission Error',
        'There was an error checking app permissions. Some features might not work properly.',
        [{ text: 'OK', onPress: () => setPermissionsChecked(true) }]
      );
    }
  };

  // Show loading screen while checking permissions
  if (!permissionsChecked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainNavigator" component={MainNavigator} />
        ) : (
          <>
            <Stack.Screen name="WelcomeNavigator" component={WelcomeNavigator} />
            <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
