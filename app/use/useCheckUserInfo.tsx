import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, doc, getDoc, setDoc } from "firebase/firestore";
import getEmail from "./useGetEmail";

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
