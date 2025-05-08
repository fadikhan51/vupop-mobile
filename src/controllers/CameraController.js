import { useState, useEffect, useRef } from 'react';
import { Camera } from 'react-native-vision-camera';
import useOrientationController from './OrientationController';

const useCameraController = (navigation) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isFlashEnabled, setIsFlashEnabled] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(1.0);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const cameraRef = useRef(null);
  const { selectedOrientation } = useOrientationController();

  useEffect(() => {
    initializeCamera();
    return () => disposeCamera();
  }, []);

  const initializeCamera = async () => {
    try {
      const devices = await Camera.getAvailableCameraDevices();
      const device = devices.find(d => d.position === (isFrontCamera ? 'front' : 'back'));
      if (!device) {
        alert('No camera found');
        return;
      }

      setIsInitialized(true);
    } catch (e) {
      alert(`Failed to initialize camera: ${e}`);
      setIsInitialized(false);
    }
  };

  const disposeCamera = async () => {
    if (isRecording) {
      await stopRecording();
    }
  };

  const toggleCamera = async () => {
    setIsFrontCamera(!isFrontCamera);
    await initializeCamera();
  };

  const toggleRecording = async () => {
    if (!isInitialized) return;

    try {
      if (isRecording) {
        const video = await cameraRef.current.stopRecording();
        setIsRecording(false);
        navigation.navigate('PostVideo', { videoPath: video.path });
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

  const toggleAudio = async () => {
    setIsAudioEnabled(!isAudioEnabled);
  };

  const toggleFlash = async () => {
    setIsFlashEnabled(!isFlashEnabled);
  };

  const setZoom = (zoom) => {
    setCurrentZoom(zoom);
  };

  return {
    isInitialized,
    isRecording,
    isAudioEnabled,
    isFlashEnabled,
    currentZoom,
    isFrontCamera,
    cameraRef,
    selectedOrientation,
    toggleCamera,
    toggleRecording,
    toggleAudio,
    toggleFlash,
    setZoom,
  };
};

export default useCameraController;