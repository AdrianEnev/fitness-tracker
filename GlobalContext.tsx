import React from 'react';
import getFriendRequests from './app/use/useGetFriendRequestsRecieved';
import { collection } from 'firebase/firestore';
import { FIRESTORE_DB } from './firebaseConfig';

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