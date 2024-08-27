import React from 'react';
import { GoalNutrients } from './interfaces';

interface GlobalContextType {
    profilePicture: string;
    setupRan: boolean;
    friendRequestsNumber: string;
    //goalNutrients: GoalNutrients | null; // Changed to a single object or null
    receiveFriendRequests: boolean;
    faceIdEnabled: boolean;
    internetConnected: boolean;
    setFaceIdEnabled: (value: boolean) => void;
    setReceiveFriendRequests: (value: boolean) => void;
    setProfilePicture: (profilePicture: string) => void;
    setSetupRan: (value: boolean) => void;
    setGoalNutrients: (value: GoalNutrients | null) => void; // Updated the type here as well
}

const defaultValues: GlobalContextType = {
    profilePicture: '',
    setupRan: false,
    friendRequestsNumber: "",
    //goalNutrients: null,
    receiveFriendRequests: false,
    faceIdEnabled: false,
    internetConnected: false,
    setFaceIdEnabled: () => {},
    setReceiveFriendRequests: () => {},
    setProfilePicture: () => {},
    setSetupRan: () => {},
    setGoalNutrients: () => {},
};

const GlobalContext = React.createContext<GlobalContextType>(defaultValues);

export default GlobalContext;