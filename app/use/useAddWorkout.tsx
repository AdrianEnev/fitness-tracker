
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Exercise } from '../../interfaces';
import { useState } from 'react';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';

const addWorkout = async (exercises: any, navigation: any, workoutTitle: string) => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");
    const workoutDocRef = await addDoc(userWorkoutsCollectionRef, {
        title: workoutTitle,
        created: serverTimestamp()
    });
    const workoutInfoCollectionRef = collection(workoutDocRef, "info");

    try {
        exercises.forEach((exercise: any) => {
            exercise.sets.forEach(async (set: any, index: any) => {

                const exerciseDocRef = doc(workoutInfoCollectionRef, (exercise.exerciseIndex + 1).toString());
                setDoc(exerciseDocRef, {
                    title: exercise.title,
                    description: exercise.description,
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