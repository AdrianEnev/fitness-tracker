import AsyncStorage from '@react-native-async-storage/async-storage';

const getSavedWorkoutInfoLocally = async (workoutId: string) => {
    try {
        const savedWorkouts = await AsyncStorage.getItem('savedWorkouts');
        if (!savedWorkouts) {
            console.log('No saved workouts found in local storage.');
            return null;
        }

        const savedWorkoutsArray = JSON.parse(savedWorkouts);
        console.log('Saved Workouts:', savedWorkoutsArray);

        const workout = savedWorkoutsArray.find((workout: any) => workout.id === workoutId);
        if (!workout) {
            console.log(`WorkoutID ${workoutId} not found in local storage.`);
            return null;
        }

        return {
            exercisesData: workout.exercises,
            workoutTitle: workout.title,
        };
    } catch (err) {
        console.error('Error retrieving saved workout info:', err);
        return null;
    }
};

export default getSavedWorkoutInfoLocally;