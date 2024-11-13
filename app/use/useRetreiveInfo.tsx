import { collection, doc, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "./useGetEmail";
import addWorkoutLocally from "../useWorkout/useAddWorkoutLocally";

const retreiveInfo = async () => {

    console.log('retreiveInfo');
    
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const workoutsCollectionRef = collection(userDocRef, 'workouts');
    const workoutsSnapshot = await getDocs(workoutsCollectionRef);

    // get number of documents inside the workouts collection
    const workoutsCountDB = workoutsSnapshot.size;

    const email = await getEmail();
    const asyncStorageWorkouts = await AsyncStorage.getItem(`workouts_${email}`);

    // get number of workouts in async storage
    const workoutsCountAS = asyncStorageWorkouts ? JSON.parse(asyncStorageWorkouts).length : 0;

    console.log('workoutsCountDB', workoutsCountDB);
    console.log('workoutsCountAS', workoutsCountAS);

    if (workoutsCountDB > workoutsCountAS) { 

        // compare workout ids and anything missing in asyncstorage should be console logged
        const workouts = workoutsSnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title, folderId: doc.data().folderId, ...doc.data() }));
        const workoutsAS = asyncStorageWorkouts ? JSON.parse(asyncStorageWorkouts) : [];

        const missingWorkouts = workouts.filter((workout: any) => {
            return !workoutsAS.some((workoutAS: any) => workoutAS.id === workout.id);
        });
        
        for (const workout of missingWorkouts) {
            const workoutInfoCollectionRef = collection(workoutsCollectionRef, workout.id, 'info');
            const workoutInfoSnapshot = await getDocs(workoutInfoCollectionRef);
            let exercises = [];
        
            for (const exerciseDoc of workoutInfoSnapshot.docs) {
                const exerciseData = exerciseDoc.data();
                const setsCollectionRef = collection(workoutInfoCollectionRef, exerciseDoc.id, 'sets');
                const setsSnapshot = await getDocs(setsCollectionRef);
                let sets = setsSnapshot.docs.map(setDoc => setDoc.data());
        
                // Sort sets by setIndex
                sets = sets.sort((a, b) => a.setIndex - b.setIndex);
        
                exercises.push({
                    id: exerciseDoc.id,
                    ...exerciseData,
                    sets,
                    exerciseIndex: (exerciseData.exerciseIndex || 1) - 1 // Decrement exerciseIndex by 1
                });
            }
        
            // Sort exercises by exerciseIndex
            exercises = exercises.sort((a, b) => a.exerciseIndex - b.exerciseIndex);
        
            console.log('Missing Workout:', {
                ...workout,
                exercises
            });
        
            // Add missing workout to AsyncStorage
            await addWorkoutLocally(exercises, workout.title, workout.id, workout.folderId);
            console.log(exercises);
        }
    }

}

export default retreiveInfo;