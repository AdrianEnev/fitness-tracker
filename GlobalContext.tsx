import React from 'react';

interface GlobalContextType {
    profilePicture: string;
    setupRan: boolean;
    friendRequestsNumber: string;
    receiveFriendRequests: boolean;
    faceIdEnabled: boolean;
    internetConnected: boolean;
    isAccountDeleted: boolean;
    generatingWorkout: boolean;
    generatingWorkoutInFolder: any;
    syncingInfoRunning: any;
    internetSpeed: any;
    iphoneModel: string;
    setFaceIdEnabled: (value: boolean) => void;
    setReceiveFriendRequests: (value: boolean) => void;
    setProfilePicture: (profilePicture: string) => void;
    setSetupRan: (value: boolean) => void;
    setIsAccountDeleted: (value: boolean) => void;
    setGeneratingWorkout: (value: boolean) => void;
    setGeneratingWorkoutInFolder: (value: any) => void;
    setSyncingInfoRunning: (value: any) => void;
    setAccountJustRegistered: (value: any) => void;
}

const defaultValues: GlobalContextType = {
    profilePicture: '',
    setupRan: false,
    friendRequestsNumber: "",
    receiveFriendRequests: false,
    faceIdEnabled: false,
    internetConnected: false,
    isAccountDeleted: false,
    generatingWorkout: false,
    generatingWorkoutInFolder: '',
    syncingInfoRunning: false,
    internetSpeed: 0,
    iphoneModel: "",
    setSyncingInfoRunning: () => {},
    setFaceIdEnabled: () => {},
    setReceiveFriendRequests: () => {},
    setProfilePicture: () => {},
    setSetupRan: () => {},
    setIsAccountDeleted: () => {},
    setGeneratingWorkout: () => {},
    setGeneratingWorkoutInFolder: () => {},
    setAccountJustRegistered: () => {},

};

const GlobalContext = React.createContext<GlobalContextType>(defaultValues);

export default GlobalContext;