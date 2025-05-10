import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import AppTheme from '../../utils/Theme';
import { useUser } from '../../contexts/UserContext';
import useProfileController from '../../controllers/ProfileController';

const PASSIONS = [
  'Music', 'Dance', 'Art', 'Sports', 'Travel', 'Food', 'Fashion',
  'Technology', 'Gaming', 'Photography', 'Fitness', 'Reading',
  'Movies', 'Cooking', 'Nature', 'Science', 'History', 'Languages'
];

const EditProfileScreen = ({ navigation }) => {
  const { user } = useUser();
  const { updateProfile, uploadProfilePicture, isUploading } = useProfileController();
  const [bio, setBio] = useState(user?.bio || '');
  const [passions, setPassions] = useState(user?.passions || []);
  const [newPassion, setNewPassion] = useState('');

  const handleSave = async () => {
    try {
      await updateProfile({ bio, passions });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const togglePassion = (passion) => {
    if (passions.includes(passion)) {
      setPassions(passions.filter(p => p !== passion));
    } else {
      setPassions([...passions, passion]);
    }
  };

  const addCustomPassion = () => {
    if (newPassion.trim() && !passions.includes(newPassion.trim())) {
      setPassions([...passions, newPassion.trim()]);
      setNewPassion('');
    }
  };

  const showImagePicker = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose an option',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Take Photo',
          onPress: () => navigation.navigate('ProfilePictureCamera'),
        },
        {
          text: 'Choose from Gallery',
          onPress: async () => {
            try {
              const result = await uploadProfilePicture('gallery');
              if (result) {
                Alert.alert('Success', 'Profile picture updated');
              }
            } catch (error) {
              Alert.alert('Error', error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={AppTheme.primaryYellow} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={
                user?.profilePicture
                  ? { uri: user.profilePicture }
                  : require('../../../assets/icons/profilepic.png')
              }
              style={styles.avatar}
            />
            <TouchableOpacity
              style={styles.editAvatarButton}
              onPress={showImagePicker}
              disabled={isUploading}
            >
              <Icon name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={styles.bioInput}
            value={bio}
            onChangeText={setBio}
            placeholder="Write something about yourself..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            multiline
            maxLength={150}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Passions</Text>
          <View style={styles.passionsContainer}>
            {PASSIONS.map((passion) => (
              <TouchableOpacity
                key={passion}
                style={[
                  styles.passionChip,
                  passions.includes(passion) && styles.selectedPassionChip,
                ]}
                onPress={() => togglePassion(passion)}
              >
                <Text
                  style={[
                    styles.passionText,
                    passions.includes(passion) && styles.selectedPassionText,
                  ]}
                >
                  {passion}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Add Custom Passion</Text>
          <View style={styles.customPassionContainer}>
            <TextInput
              style={styles.customPassionInput}
              value={newPassion}
              onChangeText={setNewPassion}
              placeholder="Enter custom passion..."
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={addCustomPassion}
            >
              <Icon name="add" size={24} color={AppTheme.primaryYellow} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Loader overlay */}
      {isUploading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={AppTheme.primaryYellow} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.primaryBlack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  title: {
    color: AppTheme.primaryYellow,
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    color: AppTheme.primaryYellow,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: AppTheme.primaryYellow,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: AppTheme.primaryYellow,
    fontSize: 16,
    fontFamily: 'Poppins',
    marginBottom: 8,
  },
  bioInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: 'white',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  passionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  passionChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  selectedPassionChip: {
    backgroundColor: AppTheme.primaryYellow,
  },
  passionText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  selectedPassionText: {
    color: AppTheme.primaryBlack,
  },
  customPassionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customPassionInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: 'white',
  },
  addButton: {
    padding: 8,
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProfileScreen;