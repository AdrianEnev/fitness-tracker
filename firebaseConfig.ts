import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as firebaseAuth from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

import { 
    EXPO_FIREBASE_API_KEY, EXPO_FIREBASE_AUTH_DOMAIN, EXPO_FIREBASE_PROJECT_ID,
    EXPO_FIREBASE_STORAGE_BUCKET, EXPO_FIREBASE_MESSAGING_SENDER_ID, EXPO_FIREBASE_APP_ID,
    EXPO_FIREBASE_MEASUREMENT_ID
} from '@env';

const firebaseConfig = {
    apiKey: EXPO_FIREBASE_API_KEY,
    authDomain: EXPO_FIREBASE_AUTH_DOMAIN,
    projectId: EXPO_FIREBASE_PROJECT_ID,
    storageBucket: EXPO_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: EXPO_FIREBASE_MESSAGING_SENDER_ID,
    appId: EXPO_FIREBASE_APP_ID,
    measurementId: EXPO_FIREBASE_MEASUREMENT_ID
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