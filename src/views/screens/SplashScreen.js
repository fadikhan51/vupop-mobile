import React from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet } from 'react-native';
import useSplashController from '../../controllers/SplashController';
import AppTheme from '../../utils/Theme';

const SplashScreen = ({ navigation }) => {
  const { isLoading } = useSplashController(navigation);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/logo.png')}
        style={styles.logo}
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppTheme.primaryYellow} />
          <Text style={styles.loadingText}>Checking permissions...</Text>
        </View>
      ) : (
        <Text style={styles.successText}>All permissions granted!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.primaryBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
  },
  successText: {
    color: AppTheme.primaryYellow,
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default SplashScreen;