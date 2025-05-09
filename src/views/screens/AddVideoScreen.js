import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AppTheme from '../../utils/Theme';

const AddVideoScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add Video Screen</Text>
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
    fontFamily: 'Poppins',
    fontWeight: '600',
  },
});

export default AddVideoScreen; 