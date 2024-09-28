import React from 'react';
import { GoalNutrients } from './interfaces';

interface GlobalContextType {
    profilePicture: string;
    setupRan: boolean;
    friendRequestsNumber: string;
    receiveFriendRequests: boolean;
    faceIdEnabled: boolean;
    internetConnected: boolean;
    isAccountDeleted: boolean;
    setFaceIdEnabled: (value: boolean) => void;
    setReceiveFriendRequests: (value: boolean) => void;
    setProfilePicture: (profilePicture: string) => void;
    setSetupRan: (value: boolean) => void;
    setIsAccountDeleted: (value: boolean) => void;
}

const defaultValues: GlobalContextType = {
    profilePicture: '',
    setupRan: false,
    friendRequestsNumber: "",
    receiveFriendRequests: false,
    faceIdEnabled: false,
    internetConnected: false,
    isAccountDeleted: false,
    setFaceIdEnabled: () => {},
    setReceiveFriendRequests: () => {},
    setProfilePicture: () => {},
    setSetupRan: () => {},
    setIsAccountDeleted: () => {},
};

const GlobalContext = React.createContext<GlobalContextType>(defaultValues);

export default GlobalContext;