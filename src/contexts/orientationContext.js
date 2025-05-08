import React, { createContext, useState } from 'react';

export const OrientationContext = createContext();


export const OrientationProvider = ({ children }) => {
    const [orientation, setOrientation] = useState('portrait');
  
    const changeOrientation = (orientation) => {
      setOrientation(orientation);
    };
  
    return (
      <OrientationContext.Provider value={{orientation, changeOrientation }}>
        {children}
      </OrientationContext.Provider>
    );
  };