import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { Camera } from 'react-native-vision-camera';
import Icon from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import useProfilePictureCameraController from '../../controllers/ProfilePictureCameraController';
import AppTheme from '../../utils/Theme';

const ProfilePictureCameraScreen = ({ navigation }) => {
  const {
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
  } = useProfilePictureCameraController(navigation);

  // Animation for capture effect
  const flashOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (triggerCaptureAnimation) {
      Animated.sequence([
        Animated.timing(flashOpacity, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(flashOpacity, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [triggerCaptureAnimation]);

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={AppTheme.primaryYellow} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={Camera.getAvailableCameraDevices().find(d => d.position === (isFrontCamera ? 'front' : 'back'))}
        isActive={true}
        photo={true}
        torch={isFlashEnabled ? 'on' : 'off'}
        zoom={currentZoom}
      />
      {/* Capture animation overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.captureFlash,
          { opacity: flashOpacity },
        ]}
      />
      {/* Loader overlay */}
      {isUploading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color={AppTheme.primaryYellow} />
        </View>
      )}
      <View style={styles.overlay}>
        <LinearGradient
          colors={[AppTheme.primaryBlack + 'CC', AppTheme.primaryBlack + '00']}
          style={styles.topBar}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="chevron-back-circle"
              size={32}
              color={AppTheme.primaryYellow}
            />
          </TouchableOpacity>
          <View style={styles.topBarRight}>
            {!isFrontCamera && (
              <TouchableOpacity onPress={toggleFlash} style={styles.iconSpacing}>
                <Icon
                  name={isFlashEnabled ? 'flash' : 'flash-off'}
                  size={32}
                  color={AppTheme.primaryYellow}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={toggleCamera}>
              <Icon
                name="camera-reverse"
                size={32}
                color={AppTheme.primaryYellow}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={styles.rightControls}>
          <Slider
            style={styles.zoomSlider}
            minimumValue={1}
            maximumValue={5}
            value={currentZoom}
            onValueChange={setZoom}
            minimumTrackTintColor={AppTheme.primaryYellow}
            maximumTrackTintColor={AppTheme.primaryYellow + '4D'}
            thumbTintColor={AppTheme.primaryYellow}
          />
        </View>
        <LinearGradient
          colors={[AppTheme.primaryBlack + '00', AppTheme.primaryBlack + 'CC']}
          style={styles.bottomControls}
        >
          <View style={{ width: 34 }} />
          <TouchableOpacity onPress={capturePhoto} disabled={isUploading}>
            <View style={styles.captureButton}>
              <View style={styles.innerCycle} />
            </View>
          </TouchableOpacity>
          <View style={{ width: 34 }} />
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.primaryBlack,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  captureFlash: {
    backgroundColor: 'white',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 20,
    marginRight: 20,
  },
  rightControls: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -100 }],
  },
  zoomSlider: {
    width: 200,
    right: -90,
    top: 90,
    transform: [{ rotate: '-90deg' }],
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: AppTheme.primaryYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: AppTheme.primaryYellow,
  },
});

export default ProfilePictureCameraScreen;