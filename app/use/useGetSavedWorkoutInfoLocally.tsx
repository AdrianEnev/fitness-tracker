import AsyncStorage from '@react-native-async-storage/async-storage';
import generateID from './useGenerateID';
import getEmail from './useGetEmail';

const getSavedWorkoutInfoLocally = async (workoutID: string) => {
    try {
        const email = await getEmail();
        if (!email) return null;

        const savedWorkouts = await AsyncStorage.getItem(`savedWorkouts_${email}`);
        const savedWorkoutsArray = savedWorkouts ? JSON.parse(savedWorkouts) : [];

        const workout = savedWorkoutsArray.find((workout: any) => workout.id === workoutID);

        if (!workout) {
            console.error('WorkoutID not found in local storage');
            return null;
        }

        const workoutTitle = workout.title;
        const exercisesData = workout.exercises.map((exercise: any) => ({
            ...exercise,
            sets: exercise.sets.map((set: any) => ({
                ...set,
                id: generateID()
            }))
        }));

        return { workoutTitle, exercisesData };
    } catch (err) {
        console.error('Error retrieving workout from local storage: ' + err);
        return null;
    }
};

export default getSavedWorkoutInfoLocally;