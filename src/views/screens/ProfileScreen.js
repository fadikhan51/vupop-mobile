import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';
import AppTheme from '../../utils/Theme';
import useUserMediaController from '../../controllers/UserMediaController';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const THUMBNAIL_SIZE = (width - 4) / 3;

const ProfileScreen = ({ navigation }) => {
  const { user, videos, isLoading } = useUserMediaController();

  const renderReelThumbnail = ({ item }) => (
    <TouchableOpacity
      style={styles.thumbnailContainer}
      onPress={() => navigation.navigate('Reel', { video: item })}
    >
      <Image
        source={{ uri: item.thumbnailUrl }}
        style={styles.thumbnail}
        defaultSource={require('../../../assets/images/image2.png')}
      />
      <View style={styles.thumbnailOverlay}>
        <Icon name="play" size={20} color="white" />
        <Text style={styles.viewsText}>{item.views}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          style={styles.settingsButton}
        >
          <Icon name="settings-outline" size={24} color={AppTheme.primaryYellow} />
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
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Icon name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>

          <Text style={styles.username}>{user?.username}</Text>
          {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}

          {user?.passions && user.passions.length > 0 && (
            <View style={styles.passionsContainer}>
              {user.passions.map((passion, index) => (
                <View key={index} style={styles.passionChip}>
                  <Text style={styles.passionText}>{passion}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.reelsSection}>
          <Text style={styles.sectionTitle}>My Reels</Text>
          {isLoading ? (
            <Text style={styles.loadingText}>Loading reels...</Text>
          ) : videos.length === 0 ? (
            <Text style={styles.noReelsText}>No reels yet</Text>
          ) : (
            <FlatList
              data={videos}
              renderItem={renderReelThumbnail}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
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
  headerTitle: {
    color: AppTheme.primaryYellow,
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
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
  username: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'Poppins',
    fontWeight: '600',
    marginBottom: 8,
  },
  bio: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    marginBottom: 16,
  },
  passionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  passionChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  passionText: {
    color: AppTheme.primaryYellow,
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  reelsSection: {
    padding: 16,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '600',
    marginBottom: 16,
  },
  thumbnailContainer: {
    width: THUMBNAIL_SIZE,
    height: THUMBNAIL_SIZE,
    margin: 1,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewsText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins',
    marginTop: 4,
  },
  loadingText: {
    color: AppTheme.primaryYellow,
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
  noReelsText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
  },
});

export default ProfileScreen;