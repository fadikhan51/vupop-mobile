import React, { useState } from 'react';
import { getFirestore, doc, updateDoc } from '@react-native-firebase/firestore';
import { useUser } from '../contexts/UserContext';
import * as ImagePicker from 'react-native-image-picker';
import { Alert } from 'react-native';

const useProfileController = () => {
  const { user, updateUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);

  const updateProfile = async (updates) => {
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);

      await updateDoc(userRef, {
        bio: updates.bio,
        passions: updates.passions,
      });

      updateUser({
        ...user,
        bio: updates.bio,
        passions: updates.passions,
      });

      return true;
    } catch (error) {
      throw new Error('Failed to update profile: ' + error.message);
    }
  };

  const uploadProfilePicture = async (source) => {
    try {
      setIsUploading(true); // Show loader
      let result;

      if (source === 'gallery') {
        console.log('gallery confirmed');
        result = await ImagePicker.launchImageLibrary({
          mediaType: 'photo',
          quality: 0.8,
        });
      } else if (source === 'camera') {
        console.log('camera confirmed');
        result = await ImagePicker.launchCamera({
          mediaType: 'photo',
          quality: 0.8,
        });
      } else {
        throw new Error('Invalid source specified');
      }

      if (result.didCancel || !result.assets) {
        return false;
      }

      const asset = result.assets[0];

      const formData = new FormData();
      formData.append('file', {
        uri: asset.uri,
        type: asset.type,
        name: `${user.uid}_profile.jpg`,
      });
      formData.append('upload_preset', 'ml_default');
      formData.append('cloud_name', 'drwhka2v6');
      formData.append('api_key', '892343994781167');

      const response = await fetch('https://api.cloudinary.com/v1_1/drwhka2v6/image/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }

      const db = getFirestore();
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        profilePicture: data.secure_url,
      });

      updateUser({
        ...user,
        profilePicture: data.secure_url,
      });

      return true;
    } catch (error) {
      throw new Error('Failed to upload profile picture: ' + error.message);
    } finally {
      setIsUploading(false); // Hide loader
    }
  };

  return {
    updateProfile,
    uploadProfilePicture,
    isUploading,
  };
};

export default useProfileController;