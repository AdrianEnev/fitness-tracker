import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import generateRandomColour from './useGenerateColour';

const syncSavedWorkouts = async () => {
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userSavedWorkoutsCollectionRef = collection(userDocRef, 'saved_workouts');

    // Get the number of saved workouts inside userSavedWorkoutsCollectionRef
    const userSavedWorkoutsSnapshot = await getDocs(userSavedWorkoutsCollectionRef);
    const numDatabaseSavedWorkouts = userSavedWorkoutsSnapshot.size;

    // Get the number of saved workouts saved locally on the phone
    const localSavedWorkouts = await AsyncStorage.getItem('savedWorkouts');

    let parsedLocalSavedWorkouts = [];
    try {
        parsedLocalSavedWorkouts = localSavedWorkouts ? JSON.parse(localSavedWorkouts) : [];
    } catch (error) {
        console.error('Error parsing localSavedWorkouts:', error);
    }
    const numLocalSavedWorkouts = parsedLocalSavedWorkouts.length;

    // Check if the number of local saved workouts is higher than the number of database saved workouts
    if (numLocalSavedWorkouts > numDatabaseSavedWorkouts) {
        // Check which saved workouts are missing inside the database and add them from the local asyncstorage
        const missingSavedWorkouts = parsedLocalSavedWorkouts.filter((localSavedWorkout: any) => {
            return !userSavedWorkoutsSnapshot.docs.some((doc) => doc.id === localSavedWorkout.id);
        });

        // Add missing saved workouts to the database
        missingSavedWorkouts.forEach(async (savedWorkout: any) => {
            const savedWorkoutDocRef = doc(userSavedWorkoutsCollectionRef, savedWorkout.id);
        
            await setDoc(savedWorkoutDocRef, {
                title: savedWorkout.title?.trim() || 'Untitled Workout',
                created: savedWorkout.created || serverTimestamp(),
                duration: savedWorkout.duration || null,
            });
            const savedWorkoutInfoCollectionRef = collection(savedWorkoutDocRef, "info");
        
            try {
                savedWorkout.exercises?.forEach((exercise: any) => {
                    exercise.sets?.forEach(async (set: any, index: any) => {
                        if (exercise.title === '') {
                            exercise.title = "Exercise " + (exercise.exerciseIndex);
                        }
                        const exerciseDocRef = doc(savedWorkoutInfoCollectionRef, (exercise.exerciseIndex).toString());
            
                        await setDoc(exerciseDocRef, {
                            title: exercise.title.trim(),
                            exerciseIndex: exercise.exerciseIndex,
                            description: exercise.description || "",
                            note: exercise.note || "",
                        });
            
                        const exerciseSets = collection(exerciseDocRef, "sets");
            
                        await addDoc(exerciseSets, {
                            reps: set.reps,
                            weight: set.weight,
                            intensity: set.intensity ? set.intensity : null,
                            setIndex: index + 1
                        });
                    });
                });
            } catch (err) {
                console.error('Error inside try block:', err);
            }
        });

        console.log('Saved workouts synced');
    } else {
        console.log('No saved workouts to sync');
    }
};

export default syncSavedWorkouts;