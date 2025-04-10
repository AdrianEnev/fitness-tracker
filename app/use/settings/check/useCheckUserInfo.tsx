import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import getEmail from "@use/settings/get/useGetEmail";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@config/firebaseConfig";

export const checkLanguageDocumentLocally = async () => {

    const language = await AsyncStorage.getItem(`language`);

    if (language === null) {
        await AsyncStorage.setItem(`language`, 'en');
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

export const checkUsernameDoc = async () => {
    
    const email = await getEmail();
    const username = await AsyncStorage.getItem(`username_${email}`)
    
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);    
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const usernameDocRef = doc(userInfoCollectionRef, 'username')
    const usernameDoc = await getDoc(usernameDocRef);

    // username already added to database
    if (usernameDoc) {
        console.log('checkUsernameDoc: username already added')
        return;
    }
    
    await setDoc(usernameDocRef, { username: username });
}