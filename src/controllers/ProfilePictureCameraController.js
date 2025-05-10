import { useState, useEffect, useRef } from 'react';
import { Camera } from 'react-native-vision-camera';
import { Alert } from 'react-native';
import { useUser } from '../contexts/UserContext';
import { getFirestore, doc, updateDoc } from '@react-native-firebase/firestore';

const useProfilePictureCameraController = (navigation) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFlashEnabled, setIsFlashEnabled] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(1.0);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [triggerCaptureAnimation, setTriggerCaptureAnimation] = useState(false);
  const cameraRef = useRef(null);
  const { user, updateUser } = useUser();

  useEffect(() => {
    initializeCamera();
    return () => disposeCamera();
  }, [isFrontCamera]);

  const initializeCamera = async () => {
    try {
      const devices = await Camera.getAvailableCameraDevices();
      const selectedDevice = devices.find(d => d.position === (isFrontCamera ? 'front' : 'back'));
      if (!selectedDevice) {
        Alert.alert('Error', 'No camera found');
        setIsInitialized(false);
        return;
      }
      setIsInitialized(true);
    } catch (e) {
      Alert.alert('Error', `Failed to initialize camera: ${e.message}`);
      setIsInitialized(false);
    }
  };

  const disposeCamera = async () => {
    // Cleanup if needed
  };

  const toggleCamera = () => {
    setIsFrontCamera(prev => !prev);
  };

  const toggleFlash = () => {
    setIsFlashEnabled(prev => !prev);
  };

  const setZoom = (zoom) => {
    setCurrentZoom(zoom);
  };

  const capturePhoto = async () => {
    try {
      if (!cameraRef.current) {
        throw new Error('Camera reference not available');
      }

      // Trigger capture animation
      setTriggerCaptureAnimation(true);
      setTimeout(() => setTriggerCaptureAnimation(false), 200); // Animation duration

      // Show loader
      setIsUploading(true);

      // Capture the photo
      const photo = await cameraRef.current.takePhoto({
        flash: isFlashEnabled ? 'on' : 'off',
        quality: 0.8,
      });

      // Prepare form data for Cloudinary upload
      const formData = new FormData();
      formData.append('file', {
        uri: `file://${photo.path}`,
        type: 'image/jpeg',
        name: `${user.uid}_profile.jpg`,
      });
      formData.append('upload_preset', 'ml_default'); // Ensure this matches the preset created in Cloudinary
      formData.append('cloud_name', 'drwhka2v6');
      formData.append('api_key', '892343994781167');

      // Upload to Cloudinary
      const response = await fetch('https://api.cloudinary.com/v1_1/drwhka2v6/image/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error.message || 'Cloudinary upload failed');
      }

      // Update Firebase with the Cloudinary URL
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        profilePicture: result.secure_url,
      });

      // Update local user state
      updateUser({
        ...user,
        profilePicture: result.secure_url,
      });

      Alert.alert('Success', 'Profile picture updated');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', `Failed to capture or upload photo: ${error.message}`);
    } finally {
      setIsUploading(false); // Hide loader
    }
  };

  return {
    isInitialized,
    isFlashEnabled,
    currentZoom,
    isFrontCamera,
    isUploading,
    triggerCaptureAnimation,
    cameraRef,
    toggleCamera,
    toggleFlash,
    setZoom,
    capturePhoto,
  };
};

export default useProfilePictureCameraController;