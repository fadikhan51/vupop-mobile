import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppTheme from '../../utils/Theme';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to the Home Screen!</Text>
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
  text: {
    color: AppTheme.primaryYellow,
    fontSize: 20,
  },
});

export default HomeScreen;