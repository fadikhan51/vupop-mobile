import React from 'react';
import SplashScreen from '../views/screens/SplashScreen';
import OrientationSelectionScreen from '../views/screens/OrientationSelectionScreen';
import CameraScreen from '../views/screens/CameraScreen';
import PostVideoScreen from '../views/screens/PostVideoScreen';
import SignInScreen from '../views/screens/SignInScreen';
import SettingsScreen from '../views/screens/SettingsScreen';
import EditProfileScreen from '../views/screens/EditProfileScreen';
import ProfilePictureCameraScreen from '../views/screens/ProfilePictureCameraScreen';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from '../navigation/TabNavigator';

const Stack = createStackNavigator();

const AppRoutes = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrientationSelection"
        component={OrientationSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Camera"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PostVideo"
        component={PostVideoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfilePictureCamera"
        component={ProfilePictureCameraScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppRoutes;