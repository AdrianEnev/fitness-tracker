import AsyncStorage from '@react-native-async-storage/async-storage';
import generateRandomColour from '../use/useGenerateColour';
import getEmail from '../use/useGetEmail';
import addWorkoutLocally from './useAddWorkoutLocally';

const addGeneratedWorkoutLocally = async (generatedWorkout: any) => {
    try {
        const email = await getEmail();
        if (!email) return;

        if (!generatedWorkout || !generatedWorkout.days) {
            console.error('Invalid generated workout structure:', generatedWorkout);
            return;
        }

        const existingWorkouts = await AsyncStorage.getItem(`workouts_${email}`);
        const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        generatedWorkout.days.forEach((day: any, index: number) => {
            const workoutTitle = day.day;
            const exercises = day.exercises ? day.exercises.map((exercise: any, exerciseIndex: number) => ({
                id: Math.random().toString(),
                title: exercise.name,
                exerciseIndex: exerciseIndex + 1,
                sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
                    id: Math.random().toString(),
                    reps: exercise.reps,
                    weight: "", // Assuming weight is not provided by the AI model
                    intensity: null, // Assuming intensity is not provided by the AI model
                    setIndex: setIndex + 1
                }))
            })) : [];

            const newWorkout = {
                id: Math.random().toString(),
                title: workoutTitle,
                created: new Date().toISOString(),
                colour: generateRandomColour(),
                numberOfExercises: exercises.length,
                info: exercises
            };

            workouts.push(newWorkout);
        });

        await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(workouts));
        console.log('Generated workouts saved locally:', workouts);
    } catch (err) {
        console.error('Error saving generated workouts locally:', err);
    }
};

export default addGeneratedWorkoutLocally;