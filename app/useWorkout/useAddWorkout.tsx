import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import generateRandomColour from '../use/useGenerateColour';
import AsyncStorage from '@react-native-async-storage/async-storage';

const addWorkout = async (exercises: any, workoutTitle: string, id: any, folder?: any) => {
    
    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");
    const workoutDocRef = doc(userWorkoutsCollectionRef, id);

    let exerciseTitle = "Exercise "
    const currentLanguage = await AsyncStorage.getItem('language')
    if (currentLanguage == "bg") {
        exerciseTitle = "Упражнение "
    }
    else if (currentLanguage == "de") {
        exerciseTitle = "Übung "
    }
    else if (currentLanguage == "ru") {
        exerciseTitle = "Упражнение "
    }
    else if (currentLanguage == "es") {
        exerciseTitle = "Ejercicio "
    }
    else if (currentLanguage == "it") {
        exerciseTitle = "Esercizio "
    }

    if (exercises.length === 0) {
        // Add rest day workout
        await setDoc(workoutDocRef, {
            title: workoutTitle.trim(),
            created: serverTimestamp(),
            colour: generateRandomColour(),
            numberOfExercises: 0,
            folderId: folder ? folder.id : null
        });
    } else {
        // Add regular workout
        await setDoc(workoutDocRef, {
            title: workoutTitle.trim(),
            created: serverTimestamp(),
            colour: generateRandomColour(),
            numberOfExercises: exercises.length,
            folderId: folder ? folder.id : null
        });

        const workoutInfoCollectionRef = collection(workoutDocRef, "info");

        try {
            exercises.forEach((exercise: any) => {
                exercise.sets.forEach(async (set: any, index: any) => {
                    if (exercise.title === '') {
                        exercise.title = exerciseTitle + (exercise.exerciseIndex + 1);
                    }

                    const exerciseDocRef = doc(workoutInfoCollectionRef, (exercise.exerciseIndex + 1).toString());
                    await setDoc(exerciseDocRef, {
                        title: exercise.title.trim(),
                        exerciseIndex: exercise.exerciseIndex + 1,
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
            console.error(err);
        }
    }
}

export default addWorkout;