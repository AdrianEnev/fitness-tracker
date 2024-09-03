import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import generateRandomColour from "../use/useGenerateColour";

const endWorkout = async (exercises: any, workoutTitle: string, duration: any, id: any) => {

    //console.log('endWorkout.tsx: ', duration);

    if (!exercises.length || exercises.every((exercise: any) => 
        !exercise.sets || 
        exercise.sets.length === 0 || 
        exercise.sets.every((set: any) => set.reps === ''))) {
        
        return;
    }

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userSavedWorkoutsCollectionRef = collection(userDocRef, "saved_workouts");
    const userInfoCollectionRef = collection(userDocRef, "user_info");

    const savedWorkoutDocRef = doc(userSavedWorkoutsCollectionRef, id);
    await setDoc(savedWorkoutDocRef, {
        title: workoutTitle,
        created: serverTimestamp(),
        duration: duration,
    });

    let totalWeight = 0;

    try {
        await Promise.all(exercises.map(async (exercise: any) => {
            const savedWorkoutInfo = collection(savedWorkoutDocRef, "info");
            const exerciseDocRef = doc(savedWorkoutInfo, (exercise.exerciseIndex).toString());
            await setDoc(exerciseDocRef, {
                title: exercise.title,
                description: exercise.description || "",
                exerciseIndex: exercise.exerciseIndex,
                note: exercise.note,
            });
    
            let exerciseTotalWeight = 0; // Temporary variable to accumulate weight for each exercise
    
            await Promise.all(exercise.sets.map(async (set: any, index: any) => {
                const exerciseSets = collection(exerciseDocRef, "sets");
                await addDoc(exerciseSets, {
                    reps: set.reps,
                    weight: set.weight,
                    rpe: set.rpe !== undefined ? set.rpe : "0",
                    setIndex: index + 1
                });
    
                const weight = parseFloat(set.weight);
                if (!isNaN(weight)) { // Ensure weight is a number
                    exerciseTotalWeight += weight;
                }
            }));
    
            totalWeight += exerciseTotalWeight; // Update totalWeight after all sets of an exercise are processed
        }));
    
        // Ensure totalWeight is a number before updating the document
        if (!isNaN(totalWeight)) {
            // Update the document with totalWeight
            const statisticsDocRef = doc(userInfoCollectionRef, "statistics");
            const statisticsDoc = await getDoc(statisticsDocRef);

            let finishedWorkouts = 0; // Default to 0 if not found
            let existingWeight = 0;

            if (statisticsDoc.exists()) {
                const data = statisticsDoc.data();
                existingWeight = typeof data.weight === 'number' ? data.weight : 0;
                finishedWorkouts = typeof data.finishedWorkouts === 'number' ? data.finishedWorkouts : 0;
            }

            totalWeight += existingWeight; // Add existing weight to totalWeight

            // Increment finishedWorkouts count
            finishedWorkouts += 1;

            // Update the document with new totalWeight and finishedWorkouts count
            await setDoc(statisticsDocRef, {
                weightLifted: totalWeight,
                finishedWorkouts: finishedWorkouts
            });

            console.log('Workout saved in database');
        } else {
            console.error('Total weight is NaN');
        }
    } catch (err) {
        console.error(err);
    }
}

export default endWorkout;