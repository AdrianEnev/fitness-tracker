import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";

const endWorkout = async (navigation: any, exercises: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userSavedWorkoutsCollectionRef = collection(userDocRef, "saved_workouts");

    try {
        exercises.forEach((exercise: any) => {
            exercise.sets.forEach(async (set: any, index: any) => {

                if (!set.reps && !set.weight) {
                    console.log('empty')
                    return;
                }

                const savedWorkoutDocRef = await addDoc(userSavedWorkoutsCollectionRef, {
                    title: "Saved Workout",
                    created: serverTimestamp()
                });
                const savedWorkoutInfoCollectionRef = collection(savedWorkoutDocRef, "info");

                const exerciseDocRef = doc(savedWorkoutInfoCollectionRef, (exercise.exerciseIndex).toString());
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

        navigation.navigate('Тренировки');
        
    }catch (err) {
        console.error(err);
    }
}

export default endWorkout;