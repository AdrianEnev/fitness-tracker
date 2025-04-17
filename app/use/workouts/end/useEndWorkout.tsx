import { FIREBASE_AUTH } from "@config/firebaseConfig";

const endWorkout = async (exercises: any, workoutTitle: string, duration: any, id: any) => {

    // if workout is empty, do not save
    // A check inside "handleEndWorkoutVisibility" runs before this (checks user inputs), but another check is added just in case
    if (!exercises.length || exercises.every((exercise: any) => 
        !exercise.sets || 
        exercise.sets.length === 0 || 
        exercise.sets.every((set: any) => set.reps === ''))) {
        return;
    }

    const workoutData = {
        exercises: exercises,
        workoutTitle: workoutTitle,
        duration: duration,
        id: id,
    };

    const userId = FIREBASE_AUTH.currentUser?.uid;

    try {
        const response = await fetch(`http://172.20.10.5:3000/api/savedWorkouts/${userId}/endWorkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            },
            body: JSON.stringify({
                workoutData: workoutData
            }),
        });

        if (!response.ok) {
            console.error("ERROR saving completed workout", response);
            return null;
        }
    } catch (error) {
        console.error("ERROR saving completed workout", error);
        return null;
    }
    
}

export default endWorkout;