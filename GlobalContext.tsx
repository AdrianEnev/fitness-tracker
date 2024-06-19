import React from 'react';
import { GoalNutrients } from './interfaces';

interface GlobalContextType {
  username: string;
  profilePicture: string;
  setupRan: boolean;
  friendRequestsNumber: string;
  goalNutrients: GoalNutrients | null; // Changed to a single object or null
  setUsername: (username: string) => void;
  setProfilePicture: (profilePicture: string) => void;
  setSetupRan: (value: boolean) => void;
  setGoalNutrients: (value: GoalNutrients | null) => void; // Updated the type here as well
}

const defaultValues: GlobalContextType = {
  username: '',
  profilePicture: '',
  setupRan: false,
  friendRequestsNumber: "",
  goalNutrients: null, // Now null, indicating no goalNutrients set initially
  setUsername: () => {},
  setProfilePicture: () => {},
  setSetupRan: () => {},
  setGoalNutrients: () => {},
};

const GlobalContext = React.createContext<GlobalContextType>(defaultValues);

export default GlobalContext;