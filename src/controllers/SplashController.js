import { useState, useEffect } from 'react';
import PermissionService from '../services/PermissionService';
import { AppRoutes } from '../utils/Constants';

const useSplashController = (navigation) => {
  const [isLoading, setIsLoading] = useState(true);
  const [permissionResults, setPermissionResults] = useState({});

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const results = await PermissionService.requestAllPermissions();
      setPermissionResults(results);

      const allGranted = Object.values(results).every(granted => granted);
      if (allGranted) {
        setIsLoading(false);
        navigateToOrientation();
      } else {
        const deniedPermissions = Object.entries(results)
          .filter(([_, granted]) => !granted)
          .map(([key]) => key)
          .join(', ');

        alert(`Permissions Required: Please grant all permissions to continue: ${deniedPermissions}`);
      }
    } catch (e) {
      alert(`Failed to request permissions: ${e}`);
    }
  };

  const navigateToOrientation = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    navigation.replace(AppRoutes.signIn);
  };

  return { isLoading, permissionResults };
};

export default useSplashController;