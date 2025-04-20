import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "@use/settings/get/useGetEmail";
import { FIREBASE_AUTH } from "@config/firebaseConfig";

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

    const userId = FIREBASE_AUTH.currentUser?.uid;

    try {
        // Get firebase username
        const response = await fetch(`http://localhost:3000/api/users/${userId}/username`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            },
        });

        if (!response.ok) {
            console.error("Error checking username match:", response);
            return null;
        }

        const firebaseUsername = await response.json() as string;

        if (!firebaseUsername) {
            console.log('No username found in database')
            return null;
        }

        // Update asyncstorage username if it doesn't match
        if (firebaseUsername !== asyncStorageUsername) {
            await AsyncStorage.setItem(`username_${email}`, firebaseUsername);
        }
    } catch (error) {
        console.error("Error checking username match:", error);
        return null;
    }
}

// Runs when the user verifies their email
// Used to add the local username to the database after account verification
export const checkUsernameDoc = async () => {
    
    const email = await getEmail();
    const username = await AsyncStorage.getItem(`username_${email}`)
    const userId = FIREBASE_AUTH.currentUser?.uid;
    
    try {
        // Get firebase username
        const response = await fetch(`http://localhost:3000/api/users/${userId}/username`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            },
        });

        if (!response.ok) {
            console.error("Error checking username match:", response);
            return null;
        }

        const firebaseUsername = await response.json() as string;

        // username already added to database
        if (firebaseUsername) {
            console.log('Username already exists!')
            return;
        }
        
        // Username does not exist in firebase, add it
        await setFirebaseUsername(String(username));

    } catch (error) {
        console.error("Error checking username match:", error);
        return null;
    }
}

const setFirebaseUsername = async (username: string) => {

    const userId = FIREBASE_AUTH.currentUser?.uid;
    
    try {
        // Get firebase username
        const response = await fetch(`http://localhost:3000/api/users/${userId}/username?username=${username}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            },
        });

        if (!response.ok) {
            console.error("Error checking username match:", response);
            return null;
        }

        console.log('Username successfuly updated on firebase!')

    } catch (error) {
        console.error("Error checking username match:", error);
        return null;
    }
}