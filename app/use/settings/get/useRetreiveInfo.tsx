import { FIREBASE_AUTH } from "@config/firebaseConfig";
import getEmail from "./useGetEmail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import addRetrievedWorkoutsLocally from "@app/use/workouts/add/useAddRetreivedWorkoutsLocally";
import addRetrievedSavedWorkoutsLocally from "@app/use/workouts/add/useAddRetreivedSavedWorkoutsLocally";
import addRetreivedFoodDays from "@app/use/food/addRetreivedFoodDays";

const retreiveInfo = async (setIsLoadingModalVisible: any, internetConnected: number, t: any) => {

    if (!internetConnected) {
        alert(t('unstable-connection'));
        setIsLoadingModalVisible(false);
        return;
    }

    const email = await getEmail();
    const keys = await AsyncStorage.getAllKeys();

    const asyncStorageWorkouts = await AsyncStorage.getItem(`workouts_${email}`);
    const asyncStorageSavedWorkouts = await AsyncStorage.getItem(`savedWorkouts_${email}`);
    const asyncStorageFoodDayKeys = keys.filter((key: string) => key.includes(`${email}-foodDay`) && !key.includes('nutrients'));

    const userId = FIREBASE_AUTH.currentUser?.uid;

    try {
        const response = await fetch(`http://172.20.10.5:3000/api/users/${userId}/retreive`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            },
            body: JSON.stringify({
                asyncStorageWorkouts: asyncStorageWorkouts,
                asyncStorageSavedWorkouts: asyncStorageSavedWorkouts,
                asyncStorageFoodDayKeys: asyncStorageFoodDayKeys
            }),
        });
        if (!response.ok) {
            console.error("Retrieving info response ERROR:", response);
            return null;
        }

        const data = await response.json();

        // If no data was returned -> everything is already synced
        if (data.missingWorkouts.length > 0) {
            await addRetrievedWorkoutsLocally(data.missingWorkouts); 
        }
        if (data.missingSavedWorkouts.length > 0) {
            await addRetrievedSavedWorkoutsLocally(data.missingSavedWorkouts);
        }
        if (data.missingFoodDays.length > 0) {
            await addRetreivedFoodDays(data.missingFoodDays);
        }

        setIsLoadingModalVisible(false);
    } catch (error) {
        console.error("Retrieving info ERROR:", error);
        return null;
    }

};

const logAllFoodDays = async () => {
    // Get from asyncstorage again
    const email = await getEmail();
    const foodDays = await AsyncStorage.getItem(`foodDays_${email}`);
    const parsedFoodDays = foodDays ? JSON.parse(foodDays) : [];
    console.log('All food days:', parsedFoodDays);
};

const clearAllFoodDays = async () => {
    const email = await getEmail();
    await AsyncStorage.removeItem(`foodDays_${email}`);
};

export default retreiveInfo;
