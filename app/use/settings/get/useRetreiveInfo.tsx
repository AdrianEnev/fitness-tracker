import { FIREBASE_AUTH } from "@config/firebaseConfig";
import getEmail from "./useGetEmail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import addRetrievedWorkoutsLocally from "@app/use/workouts/add/useAddRetreivedWorkoutsLocally";
import addRetrievedSavedWorkoutsLocally from "@app/use/workouts/add/useAddRetreivedSavedWorkoutsLocally";
import addRetreivedFoodDays from "@app/use/food/addRetreivedFoodDays";

const retreiveInfo = async (
    onRetreiveInfoComplete: () => void,
    internetConnected: boolean, t: any
) => {
    if (!internetConnected) {
        alert(t('unstable-connection'));
        return;
    }

    const email = await getEmail();
    const keys = await AsyncStorage.getAllKeys();

    const asyncStorageWorkouts = await AsyncStorage.getItem(`workouts_${email}`);
    const asyncStorageSavedWorkouts = await AsyncStorage.getItem(`savedWorkouts_${email}`);
    const asyncStorageFoodDayKeys = keys.filter((key: string) => key.includes(`${email}-foodDay`) && !key.includes('nutrients'));

    const userId = FIREBASE_AUTH.currentUser?.uid;

    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/retreive`, {
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
        console.log(data);

        // If no data was returned -> everything is already synced
        if (data.missingWorkouts && data.missingWorkouts.length > 0) {
            await addRetrievedWorkoutsLocally(data.missingWorkouts); 
        }
        if (data.missingSavedWorkouts && data.missingSavedWorkouts.length > 0) {
            await addRetrievedSavedWorkoutsLocally(data.missingSavedWorkouts);
        }
        if (data.missingFoodDays && data.missingFoodDays.length > 0) {
            await addRetreivedFoodDays(data.missingFoodDays);
        }

        // Set retreiveInfo as ran, since it should one be used once per device
        await AsyncStorage.setItem('retreiveInfo', 'true');
        onRetreiveInfoComplete();
        return;
    } catch (error) {
        console.error("Retrieving info ERROR:", error);
        return null;
    }
};

export default retreiveInfo;
