import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection, doc, getDoc, setDoc } from "firebase/firestore";
import getEmail from "./useGetEmail";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";

export const checkUserDocument = async (userDocRef: any, user: any, userInfoCollectionRef: any) => {
    try {
        const userDocSnapshot = await getDoc(userDocRef);
        if (!userDocSnapshot.exists()) {
            console.log("User document does not exist. Creating new document...");
            await setDoc(userDocRef, { 
                userID: user.uid, 
                lastLogin: new Date(), 
                registrationDate: new Date()
            });
            console.log("User document created with userID, lastLogin, and registrationDate.");
        } else {
            console.log("User document exists. Updating lastLogin...");
            await setDoc(userDocRef, { 
                userID: user.uid, 
                lastLogin: new Date() 
            }, { merge: true });
            console.log("User document updated with lastLogin.");
        }
    } catch (err) {
        console.error("Error in checkUserDocument:", err);
    }
};

export const checkLanguageDocument = async (userInfoCollectionRef: any) => {
    try {
        const languageDocRef = doc(userInfoCollectionRef, 'language');
        const languageDocSnapshot = await getDoc(languageDocRef);
        if (!languageDocSnapshot.exists()) {
            await setDoc(languageDocRef, { language: 'en' });
        }
    } catch (err) {
        console.error(err);
    }
};

export const checkLanguageDocumentLocally = async () => {

    const language = await AsyncStorage.getItem(`language`);

    if (language === null) {
        await AsyncStorage.setItem(`language`, 'en');
    }   
}

export const checkUserInfoCollection = async (userInfoCollectionRef: any) => {
    try {
        const nutrientsDocRef = doc(userInfoCollectionRef, 'nutrients');
        const docSnapshot = await getDoc(nutrientsDocRef);
        return docSnapshot.exists();
    } catch (err) {
        console.error(err);
        return false;
    }
}

export const checkUserGoalNutrientsLocally = async () => {

    const email = await getEmail()
    const nutrients = await AsyncStorage.getItem(`goal_nutrients_${email}`);

    // return true if nutrients exists
    return nutrients !== null;
}

// check if asyncstorage username matches database one, if they do not match, set the asyncstorage username to the database one
export const checkUsernamesMatch = async () => {

    // get asyncstorage username
    const email = await getEmail()
    const asyncStorageUsername = await AsyncStorage.getItem(`username_${email}`)

    // get database username
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const usernameDocRef = doc(userInfoCollectionRef, 'username');
    const usernameDocSnapshot = await getDoc(usernameDocRef);
    const username = usernameDocSnapshot.data()?.username;

    if (username !== asyncStorageUsername) {
        await AsyncStorage.setItem(`username_${email}`, username);
    }
}
