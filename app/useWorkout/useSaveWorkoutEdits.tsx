import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import generateID from "../use/useGenerateID";

const saveWorkoutEdits = async (workout: any, userInputs: any, newExercises: any, newWorkoutTitle: any) => {

    // check if any workout changes have been made before continuing... (unimplemented)
    // workout and userInputs seem to be tied and have the same values
    // both are passed though, to avoid confusion for now

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");
    const workoutDocRef = doc(userWorkoutsCollectionRef, workout.id);
    const workoutInfoCollectionRef = collection(workoutDocRef, "info");

    const data = await getDocs(workoutInfoCollectionRef);
    const exercisesData: any[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    for (let exercise of exercisesData) {
        const setsCollectionRef = collection(workoutInfoCollectionRef, exercise.id, "sets");
        const setsData = await getDocs(setsCollectionRef);
        const sets: any[] = setsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        exercise.sets = sets;

        const currentExercise = userInputs.find((input: any) => input.id === exercise.id);
        if (currentExercise) {
            for (let set of exercise.sets) {
                const currentSet = currentExercise.sets.find((inputSet: any) => inputSet.id === set.id);
                if (currentSet) {
                    const setDocData: any = {
                        reps: currentSet.reps,
                        weight: currentSet.weight,
                        setIndex: currentSet.setIndex,
                    };

                    // Include intensity if it exists
                    if (currentSet.intensity) {
                        setDocData.intensity = currentSet.intensity;
                    }

                    await setDoc(doc(setsCollectionRef, set.id), setDocData);
                }
            }

            // Adding new sets
            const addedSets = currentExercise.sets.filter((set: any) => !sets.some((dbSet: any) => dbSet.id === set.id));
            let nextIndex = sets.length; // Start indexing for new sets after the existing ones
            for (let addedSet of addedSets) {
                const newSetRef = doc(setsCollectionRef);
                const newSetDocData: any = {
                    reps: addedSet.reps,
                    weight: addedSet.weight,
                    setIndex: nextIndex + 1,
                };

                // Include intensity if it exists
                if (addedSet.intensity) {
                    newSetDocData.intensity = addedSet.intensity;
                }

                await setDoc(newSetRef, newSetDocData);
                nextIndex++;
            }

            // Check if any sets were removed (and not added)
            const removedSetsExist = sets.length > currentExercise.sets.length;
            if (removedSetsExist) {
                // First, delete all existing sets in Firestore to start fresh
                for (let set of sets) {
                    const setDocRef = doc(setsCollectionRef, set.id);
                    await deleteDoc(setDocRef);
                }

                // Then, add back all current sets with new indexes
                currentExercise.sets.forEach(async (set: any, index: number) => {
                    const newSetRef = doc(setsCollectionRef, set.id ? set.id : generateID()); // Use existing ID or generate a new one
                    const newSetDocData: any = {
                        reps: set.reps,
                        weight: set.weight,
                        setIndex: index + 1, // Re-index starting from 1
                    };

                    // Include intensity if it exists
                    if (set.intensity) {
                        newSetDocData.intensity = set.intensity;
                    }

                    await setDoc(newSetRef, newSetDocData);
                });
            }

            // check if any of the exercise titles have been updated
            const currentExerciseTitle = newExercises.find((ex: any) => ex.id === exercise.id);
            if (currentExerciseTitle) {
                await setDoc(doc(workoutInfoCollectionRef, exercise.id), {
                    title: currentExerciseTitle.title,
                    exerciseIndex: currentExerciseTitle.exerciseIndex
                });
            }
        }
    }

    // check if any new exercises have been added to the workout
    const addedExercises = userInputs.filter((input: any) => !exercisesData.some((dbExercise: any) => dbExercise.id === input.id));
    let nextIndex = 0;

    for (let addedExercise of addedExercises) {
        // Generate title if empty, similar to useAddWorkout.tsx logic
        if (addedExercise.title === '') {
            addedExercise.title = "Упражнение " + (nextIndex + 1);
        }

        const newExerciseRef = doc(workoutInfoCollectionRef, (nextIndex + 1).toString());
        await setDoc(newExerciseRef, {
            title: addedExercise.title.trim(),
            exerciseIndex: nextIndex + 1
        });

        const setsCollectionRef = collection(newExerciseRef, "sets");
        let setIndex = 1;

        for (let set of addedExercise.sets) {

            const newSetDocData: any = {
                reps: set.reps,
                weight: set.weight,
                intensity: set.intensity ? set.intensity : null,
                setIndex: setIndex,
            };

            await addDoc(setsCollectionRef, newSetDocData);
            setIndex++;
        }
        nextIndex++;
    }

    //workout.created gets converted from timestamp to string when saving edits
    if (newWorkoutTitle === '') {
        await setDoc(workoutDocRef, {
            title: workout.title,
            created: workout.created,
            colour: workout.colour,
            numberOfExercises: userInputs.length
        });
    } else {
        await setDoc(workoutDocRef, {
            title: newWorkoutTitle,
            created: workout.created,
            colour: workout.colour,
            numberOfExercises: userInputs.length
        });
    }
};

export default saveWorkoutEdits;