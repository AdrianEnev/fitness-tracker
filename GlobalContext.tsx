import React from 'react';

const GlobalContext = React.createContext({
  username: '',
  profilePicture: '',
  setupRan: false,
  friendRequestsNumber: "",
  setUsername: (username: string) => {},
  setProfilePicture: (profilePicture: string) => {},
  setSetupRan: (value: boolean) => {},
});

export default GlobalContext;