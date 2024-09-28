import { addDoc, collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import generateRandomColour from "../use/useGenerateColour";
import getEmail from "../use/useGetEmail";

const syncWorkouts = async () => {
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, 'workouts');

    const userWorkoutsSnapshot = await getDocs(userWorkoutsCollectionRef);
    const numDatabaseWorkouts = userWorkoutsSnapshot.size;

    const email = await getEmail();
    if (!email) return;

    const localWorkouts = await AsyncStorage.getItem(`workouts_${email}`);

    let parsedLocalWorkouts = [];
    try {
        parsedLocalWorkouts = localWorkouts ? JSON.parse(localWorkouts) : [];
    } catch (error) {
        console.error('Error parsing localWorkouts:', error);
    }
    const numLocalWorkouts = parsedLocalWorkouts.length;

    if (numLocalWorkouts > numDatabaseWorkouts) {
        const missingWorkouts = parsedLocalWorkouts.filter((localWorkout: any) => {
            return !userWorkoutsSnapshot.docs.some((doc) => doc.id === localWorkout.id);
        });

        missingWorkouts.forEach(async (workout: any) => {
            const workoutDocRef = doc(userWorkoutsCollectionRef, workout.id);

            await setDoc(workoutDocRef, {
                title: workout.title?.trim() || 'Untitled Workout',
                created: workout.created || serverTimestamp(),
                colour: workout.colour || generateRandomColour(),
                numberOfExercises: workout.numberOfExercises || 0
            });
            const workoutInfoCollectionRef = collection(workoutDocRef, "info");

            try {
                workout.info?.forEach((exercise: any) => {
                    exercise.sets?.forEach(async (set: any, index: any) => {
                        if (exercise.title === '') {
                            exercise.title = "Exercise " + (exercise.exerciseIndex);
                        }
                        const exerciseDocRef = doc(workoutInfoCollectionRef, (exercise.exerciseIndex).toString());

                        await setDoc(exerciseDocRef, {
                            title: exercise.title.trim(),
                            exerciseIndex: exercise.exerciseIndex,
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

        console.log('Workouts synced');
    } 
};

export default syncWorkouts;