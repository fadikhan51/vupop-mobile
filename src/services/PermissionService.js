import { Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

class PermissionService {
  async requestStoragePermission() {
    const permissions = Platform.OS === 'ios'
      ? [PERMISSIONS.IOS.PHOTO_LIBRARY]
      : [
          PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
          PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        ];

    const results = await Promise.all(
      permissions.map(permission => request(permission))
    );
    return results.every(result => result === RESULTS.GRANTED);
  }

  async requestCameraPermission() {
    const permission = Platform.OS === 'ios'
      ? PERMISSIONS.IOS.CAMERA
      : PERMISSIONS.ANDROID.CAMERA;
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  }

  async requestLocationPermission() {
    const permission = Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  }

  async requestAudioPermission() {
    const permission = Platform.OS === 'ios'
      ? PERMISSIONS.IOS.MICROPHONE
      : PERMISSIONS.ANDROID.RECORD_AUDIO;
    const result = await request(permission);
    return result === RESULTS.GRANTED;
  }

  async requestAllPermissions() {
    const results = {
      storage: await this.requestStoragePermission(),
      camera: await this.requestCameraPermission(),
      location: await this.requestLocationPermission(),
      audio: await this.requestAudioPermission(),
    };
    return results;
  }
}

export default new PermissionService();