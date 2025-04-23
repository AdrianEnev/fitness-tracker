import AsyncStorage from "@react-native-async-storage/async-storage"
import { FIREBASE_AUTH } from "@config/firebaseConfig";
import getEmail from "@use/settings/get/useGetEmail";

const userAddedThemself = async (username: string) => {

    const email = await getEmail();
    const asyncStorageUsername = await AsyncStorage.getItem(`username_${email}`);

    if (asyncStorageUsername == username) {
        return true
    }else {
        return false
    }
}

export const validateFriendSearch = async (userToCheck: any) => {

    const userAddedThemselfBool = await userAddedThemself(userToCheck.username);
    if (userAddedThemselfBool) {
        console.log('You cannot add yourself!')
        return null
    }

    const loggedUserId = FIREBASE_AUTH.currentUser?.uid;
    const userToCheckId = userToCheck.id;

    // checks: hasUserDisabledFriendRequests, isRequestPending, isFriendAlready
    try {
        const response = await fetch(`http://localhost:3000/api/friends/${loggedUserId}/${userToCheckId}`);
        if (!response.ok) {
            console.error("error updating nutrients: ", response.statusText);
            return null;
        }

        const data = await response.json() as boolean;
        
        if (data) {
            console.log('User passed all checks')
            return userToCheck;
        } else {
            console.log('User failed at least one check')
            return null;
        }

    } catch (error) {
        console.error("error updating nutrients: ", error);
        return null;
    }
}