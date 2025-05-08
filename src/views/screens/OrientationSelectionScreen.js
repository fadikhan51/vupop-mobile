import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import useOrientationController from '../../controllers/OrientationController';
import AppTheme from '../../utils/Theme';
import { AppRoutes } from '../../utils/Constants';

const OrientationSelectionScreen = ({ navigation }) => {
  const { selectedOrientation, setOrientation } = useOrientationController();

  const handleOrientationSelect = (orientation) => {
    setOrientation(orientation);
    navigation.navigate(AppRoutes.camera);
  };

  const OrientationCard = ({ orientation, icon, title, subtitle }) => {
    const isSelected = selectedOrientation === orientation;
    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: isSelected ? AppTheme.primaryYellow : AppTheme.secondaryBlack,
            shadowColor: isSelected
              ? AppTheme.primaryYellow
              : 'black',
            shadowOpacity: isSelected ? 0.3 : 0.2,
          },
        ]}
        onPress={() => handleOrientationSelect(orientation)}
      >
        <Icon
          name={icon}
          size={64}
          color={isSelected ? AppTheme.primaryBlack : AppTheme.primaryYellow}
        />
        <Text
          style={[
            styles.cardTitle,
            { color: isSelected ? AppTheme.primaryBlack : 'white' },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.cardSubtitle,
            {
              color: isSelected
                ? AppTheme.primaryBlack
                : 'rgba(255, 255, 255, 0.7)',
            },
          ]}
        >
          {subtitle}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Video Orientation</Text>
        <Text style={styles.headerSubtitle}>
          Choose how you want to record your video
        </Text>
      </View>
      <View style={styles.cardContainer}>
        <OrientationCard
          orientation="portrait"
          icon="phone-android"
          title="Portrait"
          subtitle="Vertical video (9:16)"
        />
        <OrientationCard
          orientation="landscape"
          icon="phone-android"
          title="Landscape"
          subtitle="Horizontal video (16:9)"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.primaryBlack,
    padding: 24,
  },
  header: {
    marginTop: 24,
  },
  headerTitle: {
    color: AppTheme.primaryYellow,
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginTop: 8,
  },
  cardContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 48,
  },
  card: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  cardSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default OrientationSelectionScreen;