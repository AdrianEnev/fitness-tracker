import { FIREBASE_AUTH } from '@config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const addWorkout = async (exercises: any, workoutTitle: string, workoutId: any, folder?: any) => {
    
    const userId = FIREBASE_AUTH.currentUser?.uid;
    const currentLanguage = await AsyncStorage.getItem('language');

    try {
        const response = await fetch(`http://localhost:3000/api/workouts/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                language: currentLanguage,
                exercises: exercises,
                workoutTitle: workoutTitle,
                workoutId: workoutId,
                folder: folder || null
            }),
        });
        
        if (!response.ok) {
            console.error("addWorkout: error:", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("addWorkout: error:", error);
        return null;
    }
}

export default addWorkout;