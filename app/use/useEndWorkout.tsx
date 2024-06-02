import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import generateRandomColour from "./useGenerateColour";

const endWorkout = async (navigation: any, exercises: any, workoutTitle: string) => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userSavedWorkoutsCollectionRef = collection(userDocRef, "saved_workouts");

    const savedWorkoutDocRef = await addDoc(userSavedWorkoutsCollectionRef, {
        title: workoutTitle,
        created: serverTimestamp(),
        colour: generateRandomColour()
    });

    try {
        exercises.forEach((exercise: any) => {
            exercise.sets.forEach(async (set: any, index: any) => {

                const savedWorkoutInfo = collection(savedWorkoutDocRef, "info");

                const exerciseDocRef = doc(savedWorkoutInfo, (exercise.exerciseIndex).toString());
                setDoc(exerciseDocRef, {
                    title: exercise.title,
                    description: exercise.description,
                    exerciseIndex: exercise.exerciseIndex,
                })

                const exerciseSets = collection(exerciseDocRef, "sets");
                await addDoc(exerciseSets, {
                    reps: set.reps,
                    weight: set.weight,
                    setIndex: index + 1
                });
                
            });
            
        });

        navigation.navigate('Главна Страница');
        
    }catch (err) {
        console.error(err);
    }
}

export default endWorkout;