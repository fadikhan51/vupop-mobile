import { useState, useEffect, useRef, useContext } from 'react';
import { Camera } from 'react-native-vision-camera';
import { launchImageLibrary } from 'react-native-image-picker';
import { PermissionsAndroid, Platform, Linking, Alert } from 'react-native';
import { OrientationContext } from '../contexts/orientationContext';

const useCameraController = (navigation) => {
  const [device, setDevice] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFlashEnabled, setIsFlashEnabled] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(1.0);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const cameraRef = useRef(null);
  const { orientation } = useContext(OrientationContext);

  useEffect(() => {
    console.log("The orientation fetched from orientation controller is ", orientation);
    initializeCamera();
    return () => disposeCamera();
  }, [isFrontCamera]);

  const initializeCamera = async () => {
    try {
      const devices = await Camera.getAvailableCameraDevices();
      console.log('Available devices:', devices);

      const selectedDevice = devices.find(d => d.position === (isFrontCamera ? 'front' : 'back'));
      if (!selectedDevice) {
        alert('No camera found');
        setDevice(null);
        setIsInitialized(false);
        return;
      }

      setDevice(selectedDevice);
      setIsInitialized(true);
    } catch (e) {
      alert(`Failed to initialize camera: ${e}`);
      setDevice(null);
      setIsInitialized(false);
    }
  };

  const disposeCamera = async () => {
    if (isRecording) {
      await stopRecording();
    }
  };

  const toggleCamera = () => {
    setIsFrontCamera(prev => !prev);
  };

  const toggleRecording = async () => {
    if (!isInitialized) return;
  
    try {
      if (isRecording) {
        await cameraRef.current.stopRecording();
        setIsRecording(false);
      } else {
        await cameraRef.current.startRecording({
          onRecordingFinished: (video) => {
            setIsRecording(false);
            navigation.navigate('PostVideo', { videoPath: video.path });
          },
          onRecordingError: (error) => {
            alert(`Recording failed: ${error}`);
            setIsRecording(false);
          },
        });
        setIsRecording(true);
      }
    } catch (e) {
      alert(`Failed to ${isRecording ? 'stop' : 'start'} recording: ${e}`);
      setIsRecording(false);
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(prev => !prev);
  };

  const toggleFlash = () => {
    setIsFlashEnabled(prev => !prev);
  };

  const setZoom = (zoom) => {
    setCurrentZoom(zoom);
  };

  const pickVideoFromGallery = async () => {
    try {
      // Request permissions for Android
      if (Platform.OS === 'android') {
        // Use READ_MEDIA_VIDEO for Android 13+ (API 33), fall back to READ_EXTERNAL_STORAGE
        const permission = Platform.Version >= 33
          ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO
          : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const granted = await PermissionsAndroid.request(permission, {
          title: 'Gallery Access Permission',
          message: 'This app needs access to your gallery to select videos.',
          buttonPositive: 'OK',
          buttonNegative: 'Cancel',
        });

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          // Check if permission was permanently denied
          const status = await PermissionsAndroid.check(permission);
          if (!status) {
            Alert.alert(
              'Permission Denied',
              'Gallery access is required to select videos. Please enable it in your device settings.',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Open Settings', onPress: () => Linking.openSettings() },
              ]
            );
          } else {
            alert('Gallery access denied');
          }
          return;
        }
      }

      // Launch gallery picker
      const result = await launchImageLibrary({
        mediaType: 'video',
        videoQuality: 'high',
        includeBase64: false,
      });

      if (result.didCancel) {
        console.log('User cancelled video picker');
        return;
      }

      if (result.errorCode) {
        alert(`Failed to pick video: ${result.errorMessage}`);
        return;
      }

      const videoUri = result.assets[0].uri;
      console.log('Selected video URI:', videoUri);
      navigation.navigate('PostVideo', { videoPath: videoUri });
    } catch (error) {
      console.error('Error picking video:', error);
      alert(`Failed to pick video: ${error.message}`);
    }
  };

  return {
    device,
    isInitialized,
    isRecording,
    isAudioEnabled,
    isFlashEnabled,
    currentZoom,
    isFrontCamera,
    cameraRef,
    orientation,
    toggleCamera,
    toggleRecording,
    toggleAudio,
    toggleFlash,
    setZoom,
    pickVideoFromGallery,
  };
};

export default useCameraController;