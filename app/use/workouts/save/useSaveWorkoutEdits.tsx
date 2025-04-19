import { FIREBASE_AUTH } from "@config/firebaseConfig";

const saveWorkoutEdits = async (workout: any, userInputs: any, newExercises: any, newWorkoutTitle: any) => {

    const userId = FIREBASE_AUTH.currentUser?.uid;
    const workoutData = {
        workout: workout,
        userInputs: userInputs,
        newExercises: newExercises,
        newWorkoutTitle: newWorkoutTitle
    }

    console.log(workoutData);

    try {
        const response = await fetch(`http://localhost:3000/api/workouts/${userId}/saveWorkoutEdits/${workout.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                workoutData: workoutData
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to save workout edits');
        }
    } catch (error) {
        console.error('Error saving workout edits:', error);
    }

};

export default saveWorkoutEdits;