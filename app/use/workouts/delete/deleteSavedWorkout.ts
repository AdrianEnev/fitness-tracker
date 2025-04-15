import getEmail from "@app/use/settings/get/useGetEmail";
import { FIREBASE_AUTH } from "@config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const deleteSavedWorkout = async (workout: any, navigation: any, internetConnected: boolean) => {

    const email = await getEmail();

    // Delete the workout from AsyncStorage
    const savedWorkouts = await AsyncStorage.getItem(`savedWorkouts_${email}`);
    const savedWorkoutsArray = savedWorkouts ? JSON.parse(savedWorkouts) : [];

    const updatedWorkoutsArray = savedWorkoutsArray.filter((savedWorkout: any) => savedWorkout.id !== workout.id);
    await AsyncStorage.setItem(`savedWorkouts_${email}`, JSON.stringify(updatedWorkoutsArray));

    navigation.goBack();

    if (internetConnected) {
        const userId = FIREBASE_AUTH.currentUser?.uid;

        // Delete the saved workout from the server
        try {
            const response = await fetch(`http://localhost:3000/api/savedWorkouts/${userId}/${workout.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${workout.token}`,
                },
            });
            if (!response.ok) {
                console.error("ERROR deleting saved workout:", response);
                return null;
            }
        } catch (error) {
            console.error('Error deleting saved workout:', error);
        }
    }

}

export default deleteSavedWorkout;