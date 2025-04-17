import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_AUTH } from "@config/firebaseConfig";
import getEmail from "@use/settings/get/useGetEmail";

const getLocalFoodDays = async (email: string | null) => {
    const foodDayKeyPrefix = `${email}-foodDay-`;
    const keys = await AsyncStorage.getAllKeys();
    const foodDayKeys = keys.filter(
        key => key.startsWith(foodDayKeyPrefix) &&
               !key.endsWith('-nutrients') &&
               !key.endsWith('-summary')
    );

    const foodDays = await Promise.all(
        foodDayKeys.map(async key => {
            const raw = await AsyncStorage.getItem(key);
            let data = null;
            try {
                data = raw ? JSON.parse(raw) : null;
                if (!Array.isArray(data)) return null;
            } catch (e) {
                console.error(`Error parsing food day for key ${key}:`, e);
                return null;
            }
            return { key, data };
        })
    );
    return foodDays.filter(Boolean);
}

const getLocalNutrients = async (email: string | null) => {

    const localNutrients = await AsyncStorage.getItem(`goal_nutrients_${email}`);
    let parsedLocalNutrients = null;
    try {
        parsedLocalNutrients = localNutrients ? JSON.parse(localNutrients) : null;
    } catch (error) {
        console.error('Error parsing local nutrients:', error);
    }

    return parsedLocalNutrients;
}

const getLocalWorkouts = async (email: string | null) => {
    const localWorkouts = await AsyncStorage.getItem(`workouts_${email}`);

    let parsedLocalWorkouts = [];
    try {
        parsedLocalWorkouts = localWorkouts ? JSON.parse(localWorkouts) : [];
    } catch (error) {
        console.error('Error parsing localWorkouts:', error);
    }

    return parsedLocalWorkouts;
}

const getLocalSavedWorkouts = async (email: string | null) => {
    // Get the user's saved workouts from local storage
    const localSavedWorkouts = await AsyncStorage.getItem(`savedWorkouts_${email}`);

    let parsedLocalSavedWorkouts = [];
    try {
        parsedLocalSavedWorkouts = localSavedWorkouts ? JSON.parse(localSavedWorkouts) : [];
    } catch (error) {
        console.error('Error parsing localSavedWorkouts:', error);
    }

    return parsedLocalSavedWorkouts;
}

const getLocalFolders = async (email: string | null) => {

    const localFolders = await AsyncStorage.getItem(`folders_${email}`);
    const parsedLocalFolders = localFolders ? JSON.parse(localFolders) : [];

    return parsedLocalFolders;
}

const syncInformation = async () => {

    const userId = FIREBASE_AUTH.currentUser?.uid;
    const email = await getEmail();

    const localFoodDays = await getLocalFoodDays(email);
    const localNutrients = await getLocalNutrients(email);
    const localWorkouts = await getLocalWorkouts(email);
    const localSavedWorkouts = await getLocalSavedWorkouts(email);
    const localFolders = await getLocalFolders(email);

    console.log('Syncing info...');
    try {
        const response = await fetch(`http://172.20.10.5:3000/api/users/${userId}/sync`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                localWorkouts: localWorkouts,
                localSavedWorkouts: localSavedWorkouts,
                localFolders: localFolders,
                localFoodDays: localFoodDays,
                localNutrients: localNutrients
            }),
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            console.error("syncing data error:", errorData.message);
            return null;
        }

        console.log('Synced all info!');

    } catch (error) {
        console.error("Error syncing", error);
        return null;
    }
}

export default syncInformation;