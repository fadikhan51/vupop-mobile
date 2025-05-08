import { Platform, PermissionsAndroid } from 'react-native';

// How to use in other files:
// import PermissionService from '../services/PermissionService';
// 
// async function someFunction() {
//   const hasStoragePermission = await PermissionService.requestStoragePermission();
//   // or get all permissions
//   const allPermissions = await PermissionService.requestAllPermissions();
// }

const requestStoragePermission = async () => {
  try {
    console.log("Asking for storage");
    let permissions = [];
    let results = [];

    if (Platform.OS === 'android') {
      console.log("Platform is android");
      if (Platform.Version >= 33) {
        console.log("Version is 14")
        // Android 13+ requires these separate permissions
        permissions = [
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO,
        ];
      } else {
        permissions = [
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ];
      }

      for (const permission of permissions) {
        const result = await PermissionsAndroid.request(permission);
        results.push(result);
      }
      
      console.log("Results are ", results);
      return results.every(result => result === PermissionsAndroid.RESULTS.GRANTED);
    } else {
      // iOS or other platform
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};

const requestCameraPermission = async () => {
  console.log("I am requesting for camera")
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Cool Photo App Camera Permission',
        message:
          'Cool Photo App needs access to your camera ' +
          'so you can take awesome pictures.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      return true;
    } else {
      console.log('Camera permission denied');
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
};


const requestLocationPermission = async () => {
  try {
    const permission = PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;
    const result = await PermissionsAndroid.request(permission);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return false;
  }
};

const requestAudioPermission = async () => {
  try {
    const permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
    const result = await PermissionsAndroid.request(permission);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    return false;
  }
};

const requestAllPermissions = async () => {
  const results = {
    storage: await requestStoragePermission(),
    camera: await requestCameraPermission(),
    location: await requestLocationPermission(),
    audio: await requestAudioPermission(),
  };
  return results;
};

export default {
  requestStoragePermission,
  requestCameraPermission,
  requestLocationPermission,
  requestAudioPermission,
  requestAllPermissions,
};