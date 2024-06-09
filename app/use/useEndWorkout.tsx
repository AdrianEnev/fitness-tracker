import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import generateRandomColour from "./useGenerateColour";
import { Exercise } from "../../interfaces";

const endWorkout = async (navigation: any, exercises: any, workoutTitle: string) => {

    if (!exercises.length || exercises.every((exercise: any) => 
        !exercise.sets || 
        exercise.sets.length === 0 || 
        exercise.sets.every((set: any) => set.reps === ''))) {
        console.log("Cannot end workout: no exercises provided or all exercises have no sets or all sets have empty reps.");
        return;
    }

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userSavedWorkoutsCollectionRef = collection(userDocRef, "saved_workouts");
    const userInfoCollectionRef = collection(userDocRef, "user_info");

    const savedWorkoutDocRef = await addDoc(userSavedWorkoutsCollectionRef, {
        title: workoutTitle,
        created: serverTimestamp(),
        colour: generateRandomColour()
    });

    let totalWeight = 0;

    try {
        await Promise.all(exercises.map(async (exercise: any) => {
            const savedWorkoutInfo = collection(savedWorkoutDocRef, "info");
            const exerciseDocRef = doc(savedWorkoutInfo, (exercise.exerciseIndex).toString());
            await setDoc(exerciseDocRef, {
                title: exercise.title,
                description: exercise.description,
                exerciseIndex: exercise.exerciseIndex,
            });

            await Promise.all(exercise.sets.map(async (set: any, index: any) => {
                const exerciseSets = collection(exerciseDocRef, "sets");
                await addDoc(exerciseSets, {
                    reps: set.reps,
                    weight: set.weight,
                    setIndex: index + 1
                });

                totalWeight += parseFloat(set.weight);
            }));
        }));

        // Dobavqne na tejestta povdignata prez cqlata trenirovka kum tova koeto e zapazeno v bazata danni
        const weightLiftedDocRef = doc(userInfoCollectionRef, "weight_lifted");
        const weightLiftedDoc = await getDoc(weightLiftedDocRef);

        if (weightLiftedDoc.exists()) {
            totalWeight += weightLiftedDoc.data().weight;
        }

        await setDoc(weightLiftedDocRef, {
            weight: totalWeight
        });

        navigation.navigate('Главна Страница');
        
    } catch (err) {
        console.error(err);
    }
}

export default endWorkout;