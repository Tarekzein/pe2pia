import { PermissionsAndroid, Platform } from 'react-native';
// import store from '../../../store';
// import { selectCurrentToken } from '../redux/authSlice';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigate } from './navigationService';


// Notification Channel configuration
const DEFAULT_CHANNEL_ID = "notifications";
const DEFAULT_CHANNEL_NAME = "General Notifications";

// Request Android notification permissions
const requestAndroidNotificationPermission = async () => {
    try {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const permission = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
              {
                  title: 'Notification Permission',
                  message: 'This app needs notification permission to send you updates.',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
              }
            );
            return permission === PermissionsAndroid.RESULTS.GRANTED;
        }
        return true;
    } catch (err) {
        console.warn('Failed to request notification permission:', err);
        return false;
    }
};

// Request iOS notification permissions
const requestIOSNotificationPermission = async () => {
    try {
        const authStatus = await messaging().requestPermission();
        return (
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL
        );
    } catch (err) {
        console.warn('Failed to request iOS notification permission:', err);
        return false;
    }
};

// General function to handle notifications
const handleNotification = (title, message, data = {}) => {
    PushNotification.localNotification({
        channelId: DEFAULT_CHANNEL_ID,
        title,
        message,
        data,
        importance: "high",
        priority: "high",
        ignoreInForeground: false,
        playSound: true,
        soundName: "default",
        vibrate: true,
        userInfo: data,
        alertAction: 'view',
        smallIcon: "ic_notification",
        largeIcon: "ic_launcher",
        bigText: message,
        subText: "Tap to view details",
        color: "#000000",
        visibility: "public",
        autoCancel: true,
    });
};

// Create notification channels for Android
const createNotificationChannel = () => {
    PushNotification.createChannel({
        channelId: DEFAULT_CHANNEL_ID,
        channelName: DEFAULT_CHANNEL_NAME,
        playSound: true,
        soundName: "default",
        importance: Importance.HIGH,
        vibrate: true,
        showBadge: true,
    });
};

// Configure push notifications
const configurePushNotifications = () => {
    PushNotification.configure({
        onNotification: (notification) => {
            console.log('Received notification:', notification);
            handleNotification(notification.title || 'New Notification', notification.message || notification.body, notification.data);

            // if (notification.foreground) {
            //     handleNotification(notification.title || 'New Notification', notification.message || notification.body, notification.data);
            // } else if (!notification.foreground) {
            //     handleNotification(notification.title || 'New Notification', notification.message || notification.body, notification.data);
            // }

            // Use the navigation reference to navigate
            if (notification.userInteraction) {
                navigate('Notifications'); // Replace 'Notifications' with the target screen
            }
        },
        permissions: { alert: true, badge: true, sound: true },
        popInitialNotification: true,
        // requestPermissions: Platform.OS === 'ios',
    });
};

// Request permissions and get FCM token
const requestUserPermission = async () => {
    try {
        if (Platform.OS === 'android') {
            const hasPermission = await requestAndroidNotificationPermission();
            if (!hasPermission) return;
        } else if (Platform.OS === 'ios') {
            const hasPermission = await requestIOSNotificationPermission();
            if (!hasPermission) return;
            await messaging().registerDeviceForRemoteMessages();
        }

        const fcmToken = await messaging().getToken();
        await AsyncStorage.setItem('fcmToken', fcmToken);
        console.log('FCM token:', fcmToken);

        const token = await AsyncStorage.getItem('token');
        const userId = await AsyncStorage.getItem('userId');
        console.log('FCM token:', fcmToken);
        console.log('Token:', token);
        console.log('UserId:', userId);
        await fetch('http://api.pe2pia.com:5000/api/fcm-tokens/store-or-update-token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ token: fcmToken, userId: userId }),
        });

    } catch (error) {
        console.error('Permission request error:', error);
    }
};

// Initialize notifications and permissions
export const initializeNotifications = async () => {
    try {
        createNotificationChannel();
        configurePushNotifications();
        await requestUserPermission();
    } catch (error) {
        console.error('Initialization error:', error);
    }
};
