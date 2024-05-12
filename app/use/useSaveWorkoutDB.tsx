import { addDoc, collection, doc, getDocs, serverTimestamp } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import { ExerciseInterface } from "../screens/Exercises";
import { useState } from "react";

export const saveWorkoutToDB = async (currentDay: any, exercisesInfoArrays: any, time: any) => {

    try {

        console.log('Saving workout to database...');

        const currentDayTitle = currentDay?.title;

        if (currentDayTitle) {

            if (exercisesInfoArrays.length === 0) {
                console.log('No exercises to save. Workout not saved.');
                return;
            }

            // format the current duration of the workout
            const minutes = Math.floor(time / 60);
            const hours = Math.floor(minutes / 60);
            const remainingMinutes = minutes % 60;
            const remainingSeconds = time % 60;
            let timeString: string;

            if (hours == 1) {
                timeString = `${String(hours)} час и ${String(remainingMinutes)} минути`;
            }  
            else if (hours > 1) {
                timeString = `${String(hours)} часа и ${String(remainingMinutes)} минути`;
            } else if (minutes > 0) {
                timeString = `${String(minutes)} минути`;
            } else {
                timeString = `${String(remainingSeconds)} секунди`;
            }
                
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            const savedWorkoutsCollectionRef = collection(userDocRef, 'saved_workouts');
            const savedWorkoutDocRef = await addDoc(savedWorkoutsCollectionRef, {
                saved: serverTimestamp(),
                title: currentDayTitle,
            });
            const exerciseInfoCollectionRef = collection(savedWorkoutDocRef, 'info');

            const savePromises = exercisesInfoArrays.map(async (exerciseInfo: any, index: any) => {

                const exerciseDocRef = await addDoc(exerciseInfoCollectionRef, {
                    title: exerciseInfo[1].exerciseTitle,
                    exerciseIndex: exerciseInfo[1].exerciseIndex,
                    saved: serverTimestamp(),
                    workoutDuration: timeString,
                });
              
                let setIndex = 0; // Initialize set index counter

                for (const rowNumber in exerciseInfo) {
                    const rowInfo = exerciseInfo[rowNumber];
                    const setCollectionRef = collection(exerciseDocRef, 'sets');

                    const repsValue = rowInfo.reps !== undefined ? rowInfo.reps : 'N/A';
                    const weightValue = rowInfo.weight !== undefined ? rowInfo.weight : 'N/A';
                    const rpeValue = rowInfo.rpe !== undefined ? rowInfo.rpe : 'N/A';

                    await addDoc(setCollectionRef, {
                        setIndex: setIndex, // Add set index to the document
                        reps: repsValue,
                        weight: weightValue,
                        rpe: rpeValue,
                    });

                    setIndex++;
                }
            });

            await Promise.all(savePromises);

            console.log('Workout saved successfully!');
        }
    } catch (error) {
        console.error('Error saving workout:', error);
    }
    
};