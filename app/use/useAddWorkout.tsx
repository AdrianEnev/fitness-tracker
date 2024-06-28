
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import generateRandomColour from './useGenerateColour';

const addWorkout = async (exercises: any, navigation: any, workoutTitle: string) => {

    // check if workout is empty
    // check if workout is empty
    // check if workout is empty
    // check if workout is empty
    // check if workout is empty
    // check if workout is empty
    // check if workout is empty
    // check if workout is empty
    // check if workout is empty



    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");
    const workoutDocRef = await addDoc(userWorkoutsCollectionRef, {
        title: workoutTitle.trim(),
        created: serverTimestamp(),
        colour: generateRandomColour(),
        numberOfExercises: exercises.length
    });
    const workoutInfoCollectionRef = collection(workoutDocRef, "info");

    try {
        exercises.forEach((exercise: any) => {
            exercise.sets.forEach(async (set: any, index: any) => {

                if (exercise.title === '') {
                    exercise.title = "Упражнение " + (exercise.exerciseIndex + 1);
                }

                const exerciseDocRef = doc(workoutInfoCollectionRef, (exercise.exerciseIndex + 1).toString());
                setDoc(exerciseDocRef, {
                    title: exercise.title.trim(),
                    exerciseIndex: exercise.exerciseIndex + 1,
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

export default addWorkout;