import AsyncStorage from '@react-native-async-storage/async-storage';
import generateID from '../use/useGenerateID';
import getEmail from '../use/useGetEmail';

const saveWorkoutEditsLocally = async (workout: any, userInputs: any, newExercises: any, newWorkoutTitle: any) => {

    try {
        const email = await getEmail();
        if (!email) return;

        const existingWorkouts = await AsyncStorage.getItem(`workouts_${email}`);
        const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        const workoutIndex = workouts.findIndex((w: any) => w.id === workout.id);
        if (workoutIndex === -1) return;

        const updatedWorkout = { ...workouts[workoutIndex] };

        // Update workout title if a new title is provided
        if (newWorkoutTitle) {
            updatedWorkout.title = newWorkoutTitle.trim();
        }

        // Update exercises and sets
        userInputs.forEach((input: any) => {
            const exerciseIndex = updatedWorkout.info.findIndex((ex: any) => ex.id === input.id);
            if (exerciseIndex !== -1) {
                const updatedExercise = { ...updatedWorkout.info[exerciseIndex] };
                updatedExercise.sets = input.sets.map((set: any, index: number) => ({
                    id: set.id || generateID(),
                    reps: set.reps,
                    weight: set.weight,
                    intensity: set.intensity || null,
                    setIndex: index + 1
                }));
                updatedWorkout.info[exerciseIndex] = updatedExercise;
            }
        });

        // Add new exercises
        newExercises.forEach((newExercise: any, exerciseIndex: number) => {
            const newExerciseInfo = {
                id: generateID(),
                title: newExercise.title.trim() || `Упражнение ${exerciseIndex + 1}`,
                exerciseIndex: updatedWorkout.info.length + 1,
                sets: newExercise.sets.map((set: any, index: number) => ({
                    id: generateID(),
                    reps: set.reps,
                    weight: set.weight,
                    intensity: set.intensity || null,
                    setIndex: index + 1
                }))
            };
            updatedWorkout.info.push(newExerciseInfo);
        });

        // Update the workout in the list
        workouts[workoutIndex] = updatedWorkout;

        // Save updated workouts list to local storage
        await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(workouts));

        console.log('Workout edits saved locally:', updatedWorkout);
    } catch (err) {
        console.error('Error saving workout edits locally:', err);
    }
};

export default saveWorkoutEditsLocally;