
import { addDoc, collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Exercise } from '../../interfaces';
import { useState } from 'react';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';

const addWorkout = async (exercises: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");
    const workoutDocRef = await addDoc(userWorkoutsCollectionRef, {
        title: Math.random().toString(36).substring(7),
        created: serverTimestamp()
    });
    const workoutInfoCollectionRef = collection(workoutDocRef, "info");

    try {
        exercises.forEach((exercise: any) => {
            exercise.sets.forEach(async (set: any, index: any) => {

                // set a document with the name equal to the index of the exercise
                // inside that create a collection called "sets" and documents, each with a name equal to the set index

                const exerciseDocRef = doc(workoutInfoCollectionRef, (exercise.exerciseIndex + 1).toString());
                setDoc(exerciseDocRef, {
                    title: exercise.title,
                    description: exercise.description,
                    exerciseIndex: exercise.exerciseIndex + 1,
                })

                const exerciseSets = collection(exerciseDocRef, "sets");
                const setDocRef = await addDoc(exerciseSets, {
                    reps: set.reps,
                    weight: set.weight,
                });
                
            });
            
        });


        
    }catch (err) {
        console.error(err);
    }
    
}

export default addWorkout;