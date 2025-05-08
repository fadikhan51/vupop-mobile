import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import AppTheme from '../../utils/Theme';

const CustomButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: AppTheme.primaryYellow,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: AppTheme.primaryBlack,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins',
  },
});

export default CustomButton;