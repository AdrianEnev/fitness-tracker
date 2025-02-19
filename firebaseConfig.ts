import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as firebaseAuth from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';
import Constants from "expo-constants";

const firebaseConfig = {
    apiKey: Constants.expoConfig?.extra?.EXPO_FIREBASE_API_KEY,
    authDomain: Constants.expoConfig?.extra?.EXPO_FIREBASE_AUTH_DOMAIN,
    projectId: Constants.expoConfig?.extra?.EXPO_FIREBASE_PROJECT_ID,
    storageBucket: Constants.expoConfig?.extra?.EXPO_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: Constants.expoConfig?.extra?.EXPO_FIREBASE_MESSAGING_SENDER_ID,
    appId: Constants.expoConfig?.extra?.EXPO_FIREBASE_APP_ID,
    measurementId: Constants.expoConfig?.extra?.EXPO_FIREBASE_MEASUREMENT_ID
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
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);