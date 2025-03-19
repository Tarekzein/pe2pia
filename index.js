/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

if (!messaging().isDeviceRegisteredForRemoteMessages) {
  messaging().registerDeviceForRemoteMessages();
}

AppRegistry.registerComponent(appName, () => App);
