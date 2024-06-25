import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";

const getWorkoutInfo = async (workoutID: string) => {
    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

    try {
        const workoutDocRef = doc(userWorkoutsCollectionRef, workoutID);

        const workoutTitle = await getDoc(workoutDocRef);
        const workoutTitleData = workoutTitle.data()?.title;

        const workoutInfoCollectionRef = collection(workoutDocRef, "info");

        // Get all exercises inside workoutInfoCollectionRef
        const data = await getDocs(workoutInfoCollectionRef);
        const exercisesData: any[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        // Fetch and sort sets for each exercise
        for (let exercise of exercisesData) {
            const setsCollectionRef = collection(workoutInfoCollectionRef, exercise.id, "sets");
            const setsData = await getDocs(setsCollectionRef);
            const sets: any[] = setsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            
            // Sort sets by setIndex
            sets.sort((a, b) => a.setIndex - b.setIndex);
            exercise.sets = sets;
        }

        return { workoutTitle: workoutTitleData, exercisesData: exercisesData };
    } catch (err) {
        console.error('WorkoutID not found in database: ' + err);
    }
}

export default getWorkoutInfo;