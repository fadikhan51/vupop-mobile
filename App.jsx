import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppRoutes from './src/routes/AppRoutes';
import { OrientationProvider } from './src/contexts/orientationContext';
import { UserProvider } from './src/contexts/UserContext';

const App = () => {
  return (
    <NavigationContainer>
      <UserProvider>
        <OrientationProvider>
          <AppRoutes />
        </OrientationProvider>
      </UserProvider>
    </NavigationContainer>
  );
};

export default App;