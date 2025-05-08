import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ORIENTATION_KEY = 'selectedOrientation';

const useOrientationController = () => {
  const [selectedOrientation, setSelectedOrientation] = useState('portrait');

  const saveOrientation = async (orientation) => {
    setSelectedOrientation(orientation);
    await AsyncStorage.setItem(ORIENTATION_KEY, orientation);
  };

  const loadOrientation = async () => {
    const orientation = await AsyncStorage.getItem(ORIENTATION_KEY);
    if (orientation) {
      setSelectedOrientation(orientation);
    }
  };

  // Load orientation when hook mounts
  useEffect(() => {
    loadOrientation();
  }, []);

  return { selectedOrientation, setOrientation: saveOrientation };
};

export default useOrientationController;
