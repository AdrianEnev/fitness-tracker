import { initializeApp } from 'firebase/app';
import { getAuth  } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import * as firebaseAuth from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { Split } from './app/screens/Splits';
import { Day } from './app/screens/Days';
import { ExerciseInterface } from './app/screens/Exercises';
import { SavedWorkout } from './app/screens/SavedWorkouts';

const firebaseConfig = {
  apiKey: "AIzaSyCU2y_-Elwo74ZyKy8CjQytK-BedpsX-o0",
  authDomain: "todo-mobile-app-3dcbc.firebaseapp.com",
  projectId: "todo-mobile-app-3dcbc",
  storageBucket: "todo-mobile-app-3dcbc.appspot.com",
  messagingSenderId: "418018705359",
  appId: "1:418018705359:web:45d6427d74cd12ec471cba",
  measurementId: "G-L8LBR0BEZ4"
};

const AsyncStorage = ReactNativeAsyncStorage;
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
const auth = firebaseAuth.initializeAuth(FIREBASE_APP, {
    persistence: reactNativePersistence(AsyncStorage),
});
export const FIREBASE_AUTH = auth;

// keep track of IDs
let currentSplit: Split | null = null;

export const setCurrentSplit = (newSplit: Split) => {
  currentSplit = newSplit;
};
export const getCurrentSplit = () => {
  return (currentSplit);
}

//--------------------------------------

let currentDay: Day | null = null;

export const setCurrentDay = (newDay: Day) => {
  currentDay = newDay;
};
export const getCurrentDay = () => {
  return (currentDay);
}

//--------------------------------------

let currentExercise: ExerciseInterface | null = null;

export const setCurrentExercise = (newExercise: ExerciseInterface) => {
  currentExercise = newExercise;
};
export const getCurrentExercise = () => {
  return (currentExercise);
}
//--------------------------------------

let currentSavedWorkout: SavedWorkout | null = null;

export const setCurrentSavedWorkout = (newSavedWorkout: SavedWorkout) => {
  currentSavedWorkout = newSavedWorkout;
};
export const getCurrentSavedWorkout = () => {
  return (currentSavedWorkout);
}