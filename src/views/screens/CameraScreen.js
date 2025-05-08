import React from 'react';
import { View, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import Slider from '@react-native-community/slider';
import { Camera } from 'react-native-vision-camera';
import Icon from '@react-native-vector-icons/ionicons';
import LinearGradient from 'react-native-linear-gradient';
import useCameraController from '../../controllers/CameraController';
import AppTheme from '../../utils/Theme';

const CameraScreen = ({ navigation }) => {
  const {
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
  } = useCameraController(navigation);

  const isLandscapeForIcons = orientation === 'landscape';
  const isLandscapeForPreview = orientation === 'landscape';

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={AppTheme.primaryYellow} />
      </View>
    );
  }

  return (
    <>
    {console.log(orientation)}
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={Camera.getAvailableCameraDevices().find(d => d.position === (isFrontCamera ? 'front' : 'back'))}
        isActive={true}
        video={true}
        audio={isAudioEnabled}
        torch={isFlashEnabled ? 'on' : 'off'}
        zoom={currentZoom}
        orientation={orientation}
      />
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
              style={{ transform: [{ rotate: isLandscapeForIcons ? '90deg' : '0deg' }] }}
            />
          </TouchableOpacity>
          <View style={styles.topBarRight}>
            {!isFrontCamera && (
              <TouchableOpacity onPress={toggleFlash} style={styles.iconSpacing}>
                <Icon
                  name={isFlashEnabled ? 'flash' : 'flash-off'}
                  size={32}
                  color={AppTheme.primaryYellow}
                  style={{ transform: [{ rotate: isLandscapeForIcons ? '90deg' : '0deg' }] }}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={toggleCamera}>
              <Icon
                name="camera-reverse"
                size={32}
                color={AppTheme.primaryYellow}
                style={{ transform: [{ rotate: isLandscapeForIcons ? '90deg' : '0deg' }] }}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        <View style={styles.rightControls}>
            <>
            {console.log("The value for is landscape is ", isLandscapeForIcons)}
          <Slider
            style={{width:200, transform: [{ rotate:'-90deg' }] }}
            minimumValue={1}
            maximumValue={5}
            value={currentZoom}
            onValueChange={setZoom}
            minimumTrackTintColor={AppTheme.primaryYellow}
            maximumTrackTintColor={AppTheme.primaryYellow + '4D'}
            thumbTintColor={AppTheme.primaryYellow}
          />
          </>
        </View>
        <LinearGradient
          colors={[AppTheme.primaryBlack + '00', AppTheme.primaryBlack + 'CC']}
          style={styles.bottomControls}
        >
          <TouchableOpacity onPress={toggleAudio}>
            <Icon
              name={isAudioEnabled ? 'volume-high' : 'volume-mute'}
              size={34}
              color={AppTheme.primaryYellow}
              style={{ transform: [{ rotate: isLandscapeForIcons ? '90deg' : '0deg' }] }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleRecording}>
            <View
              style={[
                styles.recordButton,
                {
                  backgroundColor: isRecording ? AppTheme.primaryYellow : 'transparent',
                  transform: [{ rotate: isLandscapeForIcons ? '90deg' : '0deg' }],
                },
              ]}
            >
              <View
                style={[
                  styles.innerCircle,
                  { backgroundColor: isRecording ? AppTheme.primaryBlack : AppTheme.primaryYellow },
                ]}
              />
            </View>
          </TouchableOpacity>
          <View style={{ width: 34 }} />
        </LinearGradient>
      </View>
    </View>
    </>
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
  },
  rightControls: {
    position: 'absolute',
    right: -70,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  recordButton: {
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
  },
});

export default CameraScreen;