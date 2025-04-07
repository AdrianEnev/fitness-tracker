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
    lungeCoinsAmount: number;
    setFaceIdEnabled: (value: boolean) => void;
    setReceiveFriendRequests: (value: boolean) => void;
    setProfilePicture: (profilePicture: string) => void;
    setFriendRequestsNumber: (friendRequestsNumber: string) => void;
    setSetupRan: (value: boolean) => void;
    setIsAccountDeleted: (value: boolean) => void;
    setGeneratingWorkout: (value: boolean) => void;
    setGeneratingWorkoutInFolder: (value: any) => void;
    setSyncingInfoRunning: (value: any) => void;
    setAccountJustRegistered: (value: any) => void;
    setLoggingIn: (value: boolean) => void;
    setLungeCoinsAmount: (value: number) => void;
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
    lungeCoinsAmount: 0,
    setSyncingInfoRunning: () => {},
    setFaceIdEnabled: () => {},
    setReceiveFriendRequests: () => {},
    setFriendRequestsNumber: () => {},
    setProfilePicture: () => {},
    setSetupRan: () => {},
    setIsAccountDeleted: () => {},
    setGeneratingWorkout: () => {},
    setGeneratingWorkoutInFolder: () => {},
    setAccountJustRegistered: () => {},
    setLoggingIn: () => {},
    setLungeCoinsAmount: () => {}

};

const GlobalContext = React.createContext<GlobalContextType>(defaultValues);

export default GlobalContext;