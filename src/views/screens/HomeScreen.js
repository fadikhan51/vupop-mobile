import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AppTheme from '../../utils/Theme';
import useAuthController from '../../controllers/AuthController';
import { AppRoutes } from '../../utils/Constants';

const HomeScreen = ({ navigation }) => {
  const { signOut, isLoading } = useAuthController(navigation);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigation.replace(AppRoutes.signIn); // Navigate to SignInScreen after sign-out
    } catch (e) {
      alert(`Sign-out failed: ${e.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen!</Text>
      <TouchableOpacity
        style={styles.signOutButton}
        onPress={handleSignOut}
        disabled={isLoading}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AppTheme.primaryYellow} />
            <Text style={styles.loadingText}>Signing out...</Text>
          </View>
        </View>
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
    padding: 20,
  },
  text: {
    color: AppTheme.primaryYellow,
    fontSize: 20,
    fontFamily: 'Poppins',
    fontWeight: '600',
    marginBottom: 20,
  },
  signOutButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    backgroundColor: AppTheme.primaryYellow,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: AppTheme.primaryYellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  signOutButtonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.9)',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    color: AppTheme.primaryYellow,
    fontSize: 16,
    fontFamily: 'Poppins',
    marginTop: 16,
  },
});

export default HomeScreen;