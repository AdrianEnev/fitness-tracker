import { FIREBASE_AUTH } from "@config/firebaseConfig";
import getEmail from "../get/useGetEmail";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const changeUsername = async (
    username: string, trimmedUsername: string, setChangingUsernameRunning: any,
    t: any, setUsername: any
) => {
    
    const userId = FIREBASE_AUTH.currentUser?.uid;
    setChangingUsernameRunning(true);

    console.log('attempting to change username to:', trimmedUsername);

    const params = new URLSearchParams({
        username: username,
        newUsername: trimmedUsername
    });

    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/username?${params.toString()}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error("Changing username response ERROR: ", response);
            return null;
        }

        const data = await response.json();

        if (data.message.includes('cooldown')) {

            //return 'cooldown' + (7 - Math.floor(daysDifference));
            const cooldownLeft = data.message.split('cooldown')[1].trim();

            Alert.alert(t('change-name-delay') + cooldownLeft + t('change-name-days'));
            setChangingUsernameRunning(false);
            return;

        }else if(data.message === "nsfw-username") {
            Alert.alert(t('nsfw-username'));
            setChangingUsernameRunning(false);
            return;
        }else if (data.message === "error") {
            Alert.alert(t('error'));
            setChangingUsernameRunning(false);
            return;
        }else if (data.message === 'username-at-least-three-symbols' ){
            Alert.alert(t('username-at-least-three-symbols'));
            setChangingUsernameRunning(false);
            return;
        }else if (data.message === 'new username same as old one') {
            Alert.alert(t('new-username-same-as-old'));
            setChangingUsernameRunning(false);
            return;
        }else if (data.message === 'username-no-emojis') {
            Alert.alert(t('username-no-emojis'));
            setChangingUsernameRunning(false);
            return;
        }else if (data.message === 'username-taken') {
            Alert.alert(t('username-taken'));
            setChangingUsernameRunning(false);
            return;
        }

        AsyncStorage.setItem(`username_${await getEmail()}`, String(trimmedUsername));
        setUsername(String(trimmedUsername));
        setChangingUsernameRunning(false);

    } catch (error) {
        console.error("Changing username ERROR:", error);
        return null;
    }
}

export default changeUsername;