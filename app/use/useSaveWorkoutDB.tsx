import { addDoc, collection, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import { ExerciseInterface } from "../screens/Exercises";
import { useEffect, useState } from "react";

export const saveWorkoutToDB = async (
    currentDay: any, 
    exercisesInfoArrays: any, 
    time: any, 
    notes: any
) => {

    try {

        console.log('Saving workout to database...');

        const currentDayTitle = currentDay?.title;

        let allEmpty = true;

        // Loop through each object in the array
        for (const exerciseInfo of exercisesInfoArrays) {
            // Loop through each row in the object
            for (const rowNumber in exerciseInfo) {
                const rowInfo = exerciseInfo[rowNumber];
                // Check if reps, rpe, and weight are all empty strings
                if (rowInfo.hasOwnProperty('reps') && rowInfo.reps !== "" || 
                    rowInfo.hasOwnProperty('rpe') && rowInfo.rpe !== "" || 
                    rowInfo.hasOwnProperty('weight') && rowInfo.weight !== "") {
                    allEmpty = false;
                    break;
                }
            }
            // If we found a non-empty field, break out of the outer loop as well
            if (!allEmpty) {
                break;
            }
        }

        if (allEmpty) {
            console.log('No exercises to save. Workout not saved.');
            return;
        }

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
                duration: timeString,
            });
            const exerciseInfoCollectionRef = collection(savedWorkoutDocRef, 'info');

            const savePromises = exercisesInfoArrays.map(async (exerciseInfo: any, index: any) => {

                const exerciseDocRef = await addDoc(exerciseInfoCollectionRef, {
                    title: exerciseInfo[1].exerciseTitle,
                    exerciseIndex: exerciseInfo[1].exerciseIndex,
                });

                  // Find the corresponding note for the current exercise
                const note = notes.find((note: any) => note.index === index + 1);

                // If a note exists, add it to the exercise document
                if (note) {
                    await updateDoc(exerciseDocRef, {
                        note: note.note,
                    });
                }
              
                let setIndex = 0; // Initialize set index counter

                for (const rowNumber in exerciseInfo) {
                    const rowInfo = exerciseInfo[rowNumber];
                    const setCollectionRef = collection(exerciseDocRef, 'sets');

                    // ako nishto ne e vuvedeno go zapisva kato not a number (N/A)
                    // ako neshto e vuvedeno i posle iztrito ostava kato prazen string
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