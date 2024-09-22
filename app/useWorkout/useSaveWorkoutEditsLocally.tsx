import AsyncStorage from '@react-native-async-storage/async-storage';
import generateID from '../use/useGenerateID';
import getEmail from '../use/useGetEmail';

const saveWorkoutEditsLocally = async (workout: any, userInputs: any, newExercises: any, newWorkoutTitle: any, folder?: any) => {
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

        // Check for exercises to add
        newExercises.forEach((newExercise: any, exerciseIndex: number) => {
            const existingExerciseIndex = updatedWorkout.info.findIndex((ex: any) => ex.id === newExercise.id);
            if (existingExerciseIndex === -1) {
                const newExerciseInfo = {
                    id: newExercise.id || generateID(),
                    title: newExercise.title.trim() || `Exercise ${exerciseIndex + 1}`,
                    exerciseIndex: updatedWorkout.info.length + 1,
                    sets: newExercise.sets.map((set: any, index: number) => ({
                        id: set.id || generateID(),
                        reps: set.reps,
                        weight: set.weight,
                        intensity: set.intensity || null,
                        setIndex: index + 1
                    })),
                    numberOfExercises: newExercise.sets.length
                };
                updatedWorkout.info.push(newExerciseInfo);
            }
        });

        // Check for exercises to remove
        const existingExerciseIds = updatedWorkout.info.map((ex: any) => ex.id);
        const newExerciseIds = newExercises.map((ex: any) => ex.id);
        const deletedExerciseIds = existingExerciseIds.filter((id: any) => !newExerciseIds.includes(id));

        updatedWorkout.info = updatedWorkout.info.filter((ex: any) => !deletedExerciseIds.includes(ex.id));

        // Update exerciseIndex to be sequential
        updatedWorkout.info.forEach((ex: any, index: number) => {
            ex.exerciseIndex = index + 1;
        });

        // Update numberOfExercises property
        updatedWorkout.numberOfExercises = updatedWorkout.info.length;

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