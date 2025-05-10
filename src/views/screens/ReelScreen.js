import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import Video from 'react-native-video';
import Icon from '@react-native-vector-icons/material-icons';
import * as Progress from 'react-native-progress';
import AppTheme from '../../utils/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReelScreen = ({ route, navigation }) => {
  const { video } = route.params;
  const [paused, setPaused] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
  const iconOpacity = useState(new Animated.Value(0))[0];

  // Handle tap to toggle play/pause with icon animation
  const handleTap = () => {
    setPaused(!paused);
    setShowPlayPauseIcon(true);
    iconOpacity.setValue(1);
    Animated.timing(iconOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => setShowPlayPauseIcon(false));
  };

  // Calculate loading progress based on video buffering
  const handleProgress = ({ playableDuration, currentTime }) => {
    if (playableDuration && currentTime) {
      const progress = Math.min(playableDuration / currentTime, 1);
      setLoadingProgress(progress * 100);
    }
  };

  // Reset loading state when video is fully loaded
  const handleLoad = () => {
    setIsLoading(false);
    setLoadingProgress(100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: video.url }}
            style={styles.video}
            resizeMode="cover"
            repeat={true}
            paused={paused}
            onLoadStart={() => setIsLoading(true)}
            onProgress={handleProgress}
            onLoad={handleLoad}
            onError={(error) => {
              console.error('Video error:', error);
              alert('Failed to play video');
            }}
          />
          {isLoading && (
            <View style={styles.loadingContainer}>
              <Progress.Circle
                progress={loadingProgress / 100}
                size={60}
                thickness={4}
                color={AppTheme.primaryYellow}
                unfilledColor="rgba(255, 255, 255, 0.3)"
                borderWidth={0}
                showsText={true}
                formatText={() => `${Math.round(loadingProgress)}%`}
                textStyle={styles.progressText}
              />
            </View>
          )}
          {showPlayPauseIcon && (
            <Animated.View style={[styles.playPauseIcon, { opacity: iconOpacity }]}>
              <Icon
                name={paused ? 'play-arrow' : 'pause'}
                size={60}
                color="white"
              />
            </Animated.View>
          )}
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={28} color={AppTheme.primaryYellow} />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <Text style={styles.caption}>{video.caption || 'No caption'}</Text>
          {video.location && (
            <Text style={styles.location}>
              <Icon name="location-on" size={16} color={AppTheme.primaryYellow} />{' '}
              {video.location}
            </Text>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.primaryBlack,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  infoContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 12,
    alignSelf: 'stretch',
    marginBottom: 16,
  },
  caption: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Poppins',
    marginBottom: 4,
  },
  location: {
    color: AppTheme.primaryYellow,
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  loadingContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressText: {
    color: 'white',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  playPauseIcon: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 40,
    width: 80,
    height: 80,
  },
});

export default ReelScreen;