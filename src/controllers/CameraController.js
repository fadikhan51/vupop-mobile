import { useState, useEffect, useRef, useContext } from 'react';
import { Camera } from 'react-native-vision-camera';
import { OrientationContext } from '../contexts/orientationContext';

const useCameraController = (navigation) => {
  const [device, setDevice] = useState(null); // ✅ Track selected device
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
  }, [isFrontCamera]); // ✅ re-run when toggling front/back camera

  const initializeCamera = async () => {
    try {
      const devices = await Camera.getAvailableCameraDevices();
      console.log('Available devices:', devices); // ✅ Debugging log

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

  return {
    device, // ✅ return the selected device
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
  };
};

export default useCameraController;
