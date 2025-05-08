import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppRoutes from './src/routes/AppRoutes';
import { OrientationProvider } from './src/contexts/orientationContext';

const App = () => {
  return (
    <NavigationContainer>
      <OrientationProvider>
      <AppRoutes />
      </OrientationProvider>
    </NavigationContainer>
  );
};

export default App;