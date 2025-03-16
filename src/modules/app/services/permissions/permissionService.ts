/* permissionService.ts */
import { Platform } from 'react-native';
import {
  check,
  request,
  Permission,
  PERMISSIONS,
  RESULTS,
  PermissionStatus,
  requestNotifications,
  NotificationOption,
} from 'react-native-permissions';

export type PermissionType = 'CAMERA' | 'LOCATION' | 'NOTIFICATION' | 'STORAGE';

const getPermissionConstant = (permissionType: PermissionType) => {
  switch (permissionType) {
    case 'CAMERA':
      return Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      }) as Permission;
    case 'LOCATION':
      return Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      }) as Permission;
    case 'STORAGE':
      return Platform.select({
        ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
        android:
          Platform.OS === 'android' &&
          parseInt(Platform.Version as unknown as string, 10) >= 33
            ? PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
            : PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      }) as Permission;
    default:
      throw new Error('Unsupported permission type');
  }
};

// Updated notification permission handler: always request notifications,
// which mirrors the logic from your PermissionsScreen example.
const handleNotificationPermission = async (
  operation: 'check' | 'request'
): Promise<PermissionStatus> => {
  try {
    const options: NotificationOption[] = ['alert', 'sound', 'badge'];
    // Always call requestNotifications regardless of the operation type.
    // This means that even "checking" will prompt and return an updated status.
    const { status } = await requestNotifications(options);
    return status;
  } catch (error) {
    console.error(`Error ${operation}ing notification permission:`, error);
    return RESULTS.UNAVAILABLE;
  }
};

const checkPermissionStatus = async (permissionType: PermissionType): Promise<PermissionStatus> => {
  if (permissionType === 'NOTIFICATION') {
    // Instead of returning RESULTS.UNAVAILABLE for "check", we now request the notifications.
    return handleNotificationPermission('request');
  }

  const permission = getPermissionConstant(permissionType);
  try {
    const result = await check(permission);
    return result;
  } catch (error) {
    console.error(`Error checking ${permissionType} permission`, error);
    return RESULTS.UNAVAILABLE;
  }
};

const requestPermission = async (permissionType: PermissionType): Promise<PermissionStatus> => {
  if (permissionType === 'NOTIFICATION') {
    return handleNotificationPermission('request');
  }

  const permission = getPermissionConstant(permissionType);
  try {
    let result = await check(permission);
    if (result === RESULTS.DENIED || result === RESULTS.LIMITED) {
      result = await request(permission);
    }
    if (result === RESULTS.BLOCKED) {
      console.warn(`${permissionType} permission is blocked. Consider opening settings.`);
    }
    return result;
  } catch (error) {
    console.error(`Error requesting ${permissionType} permission`, error);
    return RESULTS.UNAVAILABLE;
  }
};

// Updated so both check and request for notifications use the same logic.
export const checkNotificationPermission = async (): Promise<PermissionStatus> => {
  return handleNotificationPermission('request');
};

export const requestNotificationPermission = async (): Promise<PermissionStatus> => {
  return handleNotificationPermission('request');
};

// The rest remains unchanged.
export const checkStoragePermission = async (): Promise<PermissionStatus> => {
  return checkPermissionStatus('STORAGE');
};

export const requestStoragePermission = async (): Promise<PermissionStatus> => {
  return requestPermission('STORAGE');
};

export const checkCameraPermission = async (): Promise<PermissionStatus> => {
  return checkPermissionStatus('CAMERA');
};

export const requestCameraPermission = async (): Promise<PermissionStatus> => {
  return requestPermission('CAMERA');
};

export const checkLocationPermission = async (): Promise<PermissionStatus> => {
  return checkPermissionStatus('LOCATION');
};

export const requestLocationPermission = async (): Promise<PermissionStatus> => {
  return requestPermission('LOCATION');
};

export const checkMultiplePermissions = async (
  permissions: PermissionType[]
): Promise<Record<PermissionType, PermissionStatus>> => {
  const results: Partial<Record<PermissionType, PermissionStatus>> = {};

  for (const permission of permissions) {
    results[permission] = await checkPermissionStatus(permission);
  }

  return results as Record<PermissionType, PermissionStatus>;
};

export const requestMultiplePermissions = async (
  permissions: PermissionType[]
): Promise<Record<PermissionType, PermissionStatus>> => {
  const results: Partial<Record<PermissionType, PermissionStatus>> = {};

  for (const permission of permissions) {
    results[permission] = await requestPermission(permission);
  }

  return results as Record<PermissionType, PermissionStatus>;
};

export default {
  checkCameraPermission,
  requestCameraPermission,
  checkLocationPermission,
  requestLocationPermission,
  checkNotificationPermission,
  requestNotificationPermission,
  checkStoragePermission,
  requestStoragePermission,
  checkMultiplePermissions,
  requestMultiplePermissions,
};
