import React from 'react';

export const SetupContext = React.createContext({
  setupRan: false,
  setSetupRan: (value: boolean) => {},
});