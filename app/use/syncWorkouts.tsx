import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import generateRandomColour from './useGenerateColour';

const syncWorkouts = async () => {
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, 'workouts');

    // Get the number of workouts inside userWorkoutsCollectionRef
    const userWorkoutsSnapshot = await getDocs(userWorkoutsCollectionRef);
    const numDatabaseWorkouts = userWorkoutsSnapshot.size;

    // Get the number of workouts saved locally on the phone
    const localWorkouts = await AsyncStorage.getItem('workouts');

    let parsedLocalWorkouts = [];
    try {
        parsedLocalWorkouts = localWorkouts ? JSON.parse(localWorkouts) : [];
    } catch (error) {
        console.error('Error parsing localWorkouts:', error);
    }
    const numLocalWorkouts = parsedLocalWorkouts.length;

    //console.log('numDatabaseWorkouts', numDatabaseWorkouts);
    //console.log('numLocalWorkouts', numLocalWorkouts);

    // Check if the number of local workouts is higher than the number of database workouts
    if (numLocalWorkouts > numDatabaseWorkouts) {
        // Check which workouts are missing inside the database and add them from the local asyncstorage
        const missingWorkouts = parsedLocalWorkouts.filter((localWorkout: any) => {
            return !userWorkoutsSnapshot.docs.some((doc) => doc.id === localWorkout.id);
        });

        // Add missing workouts to the database
        missingWorkouts.forEach(async (workout: any) => {
            const workoutDocRef = doc(userWorkoutsCollectionRef, workout.id);
        
            await setDoc(workoutDocRef, {
                title: workout.title?.trim() || 'Untitled Workout',
                created: workout.created || serverTimestamp(),
                colour: workout.colour || generateRandomColour(),
                numberOfExercises: workout.numberOfExercises || 0
            });
            const workoutInfoCollectionRef = collection(workoutDocRef, "info");
        
            //console.log(workout)
            
            try {
                workout.info?.forEach((exercise: any) => { // Change workout.exercises to workout.info
                    //console.log('Processing exercise:', exercise);
            
                    exercise.sets?.forEach(async (set: any, index: any) => {
                        //console.log('Processing set:', set);
            
                        if (exercise.title === '') {
                            exercise.title = "Exercise " + (exercise.exerciseIndex);
                        }
                        const exerciseDocRef = doc(workoutInfoCollectionRef, (exercise.exerciseIndex).toString());
                        //console.log('Creating exercise document:', exerciseDocRef);
            
                        await setDoc(exerciseDocRef, {
                            title: exercise.title.trim(),
                            exerciseIndex: exercise.exerciseIndex,
                        });
                        //console.log('Exercise document created');
            
                        const exerciseSets = collection(exerciseDocRef, "sets");
                        //console.log('Creating set document in:', exerciseSets);
            
                        await addDoc(exerciseSets, {
                            reps: set.reps,
                            weight: set.weight,
                            intensity: set.intensity ? set.intensity : null,
                            setIndex: index + 1
                        });
                        //console.log('Set document created');
                    });
                });
            } catch (err) {
                console.error('Error inside try block:', err);
            }
        });

        console.log('Workouts synced');
    } else {
        console.log('No workouts to sync');
    }
};

export default syncWorkouts;