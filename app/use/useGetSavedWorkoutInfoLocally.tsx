import AsyncStorage from '@react-native-async-storage/async-storage';
import generateID from './useGenerateID';

const getSavedWorkoutInfoLocally = async (workoutID: string) => {
    try {
        // Retrieve existing workouts from AsyncStorage
        const savedWorkouts = await AsyncStorage.getItem('savedWorkouts');
        const savedWorkoutsArray = savedWorkouts ? JSON.parse(savedWorkouts) : [];

        // Find the workout with the given workoutID
        const workout = savedWorkoutsArray.find((workout: any) => workout.id === workoutID);

        if (!workout) {
            console.error('WorkoutID not found in local storage');
            return null;
        }

        // Extract the workout title and exercises
        const workoutTitle = workout.title;
        const exercisesData = workout.exercises.map((exercise: any) => ({
            ...exercise,
            sets: exercise.sets.map((set: any) => ({
                ...set,
                id: generateID() // Assuming you have a function to generate unique IDs
            }))
        }));

        return { workoutTitle, exercisesData };
    } catch (err) {
        console.error('Error retrieving workout from local storage: ' + err);
        return null;
    }
}

export default getSavedWorkoutInfoLocally;