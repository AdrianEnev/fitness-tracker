import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_AUTH } from "../../firebaseConfig";

const getEmail = async () => {
    try {
        const email = await AsyncStorage.getItem(`email_${FIREBASE_AUTH.currentUser?.uid}`);
        //console.log(email)
        return email;
    } catch (err) {
        console.error('Error retrieving email:', err);
        return null;
    }
};

export default getEmail;