import AsyncStorage from '@react-native-async-storage/async-storage';
import generateRandomColour from './useGenerateColour';

interface SetInfo {
    id: string;
    reps: any;
    weight: any;
    intensity: any | null;
    setIndex: number;
}

interface ExerciseInfo {
    id: string;
    title: string;
    exerciseIndex: number;
    sets: SetInfo[];
}

const addWorkoutLocally = async (exercises: any, workoutTitle: string, id: any) => {
    try {
        // Get existing workouts from local storage
        const existingWorkouts = await AsyncStorage.getItem('workouts');
        const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        // Create new workout object
        const newWorkout = {
            id: id,
            title: workoutTitle.trim(),
            created: new Date().toISOString(),
            colour: generateRandomColour(),
            numberOfExercises: exercises.length,
            info: [] as ExerciseInfo[]
        };

        // Add exercises and sets to the workout
        exercises.forEach((exercise: any) => {
            const exerciseInfo: ExerciseInfo = {
                id: Math.random().toString(),
                title: exercise.title.trim() || `Упражнение ${exercise.exerciseIndex + 1}`,
                exerciseIndex: exercise.exerciseIndex + 1,
                sets: []
            };

            exercise.sets.forEach((set: any, index: any) => {
                const setInfo: SetInfo = {
                    id: Math.random().toString(),
                    reps: set.reps,
                    weight: set.weight,
                    intensity: set.intensity ? set.intensity : null,
                    setIndex: index + 1
                };
                exerciseInfo.sets.push(setInfo);
            });

            newWorkout.info.push(exerciseInfo);
        });

        // Add new workout to the list of workouts
        workouts.push(newWorkout);

        // Save updated workouts list to local storage
        await AsyncStorage.setItem('workouts', JSON.stringify(workouts));

        console.log('Workout saved locally:', newWorkout);
    } catch (err) {
        console.error('Error saving workout locally:', err);
    }
};

export default addWorkoutLocally;