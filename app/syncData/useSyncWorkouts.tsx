import { FIREBASE_AUTH } from "../../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from "../use/useGetEmail";

const syncWorkouts = async () => {

    const userId = FIREBASE_AUTH.currentUser?.uid;

    // Get the user's email
    const email = await getEmail();
    if (!email) return;

    // Get the local workouts from AsyncStorage
    const localWorkouts = await AsyncStorage.getItem(`workouts_${email}`);

    let parsedLocalWorkouts = [];
    try {
        parsedLocalWorkouts = localWorkouts ? JSON.parse(localWorkouts) : [];
    } catch (error) {
        console.error('Error parsing localWorkouts:', error);
    }

    try {
        const response = await fetch(`http://localhost:3000/api/workouts/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            },
            body: JSON.stringify({
                parsedLocalWorkouts: parsedLocalWorkouts
            }),
        });
        
        if (!response.ok) {
            console.error("syncWorkouts: Error fetching data:", response.statusText);
            return null;
        }

    } catch (error) {
        console.error("syncWorkouts: Error fetching data:", error);
        return null;
    }

};

export default syncWorkouts;