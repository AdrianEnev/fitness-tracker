import { collection, doc, setDoc, serverTimestamp, addDoc, getDoc } from 'firebase/firestore'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig'; 
import generateRandomColour from '../use/useGenerateColour';
import getEmail from '../use/useGetEmail';

const syncWorkoutsInFolders = async () => { 
    
    // Get the user's email
    const email = await getEmail(); 
    if (!email) return;

    // Retrieve local folders from AsyncStorage
    const localFolders = await AsyncStorage.getItem(`folders_${email}`);
    const parsedLocalFolders = localFolders ? JSON.parse(localFolders) : [];

    // Iterate through each folder
    for (const folder of parsedLocalFolders) {
        const folderWorkouts = folder.workouts || [];

        // Iterate through each workout in the folder
        for (const localWorkout of folderWorkouts) {
            const usersCollectionRef = collection(FIRESTORE_DB, "users");
            const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            const userWorkoutsCollectionRef = collection(userDocRef, "workouts");
            const workoutDocRef = doc(userWorkoutsCollectionRef, localWorkout.id);

            // Check if the workout already exists in Firestore
            const workoutSnapshot = await getDoc(workoutDocRef);
            if (!workoutSnapshot.exists()) {
                // If it doesn't exist, create a new document for the workout
                await setDoc(workoutDocRef, {
                    title: localWorkout.title?.trim() || 'Untitled Workout',
                    created: localWorkout.created || serverTimestamp(),
                    colour: localWorkout.colour || generateRandomColour(), 
                    numberOfExercises: localWorkout.numberOfExercises || 0,
                    folderId: folder.id
                });

                const workoutInfoCollectionRef = collection(workoutDocRef, "info");

                // Iterate through each exercise in the workout
                for (const exercise of localWorkout.info || []) {
                    const exerciseDocRef = doc(workoutInfoCollectionRef, (exercise.exerciseIndex).toString());
                    await setDoc(exerciseDocRef, {
                        title: exercise.title?.trim() || `Exercise ${exercise.exerciseIndex}`,
                        exerciseIndex: exercise.exerciseIndex,
                    });

                    const exerciseSetsCollectionRef = collection(exerciseDocRef, "sets");
                    // Iterate through each set in the exercise
                    for (const [index, set] of (exercise.sets || []).entries()) {
                        await addDoc(exerciseSetsCollectionRef, {
                            reps: set.reps,
                            weight: set.weight,
                            intensity: set.intensity || null,
                            setIndex: index + 1
                        });
                    }
                }
            }
        }
    }

};

export default syncWorkoutsInFolders;