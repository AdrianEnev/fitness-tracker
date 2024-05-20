
import { addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import { Exercise } from '../../interfaces';
import { useState } from 'react';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';

const addWorkout = async (exercises: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");
    const workoutDocRef = await addDoc(userWorkoutsCollectionRef, {
        title: "Workout",
        createdAt: serverTimestamp()
    });
    const workoutInfoCollectionRef = collection(workoutDocRef, "info");

    try{
        exercises.forEach(async (exercise: Exercise) => {
            await addDoc(workoutInfoCollectionRef, {
                title: exercise.title,
                sets: exercise.sets,
                reps: exercise.reps,
                weight: exercise.weight,
                description: exercise.description,
                exerciseIndex: 0,
            });

        });

    }catch (err) {
        console.error(err);
    }
    
}

export default addWorkout;