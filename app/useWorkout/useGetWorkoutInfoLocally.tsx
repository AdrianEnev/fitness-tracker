import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '../use/useGetEmail';

const getWorkoutInfoLocally = async (workoutId: string) => {
    try {
        const email = await getEmail();
        if (!email) return null;

        const data = await AsyncStorage.getItem(`workouts_${email}`);
        const workouts = data ? JSON.parse(data) : [];

        const workout = workouts.find((w: any) => w.id === workoutId);

        if (workout) {
            const { title: workoutTitle, info: exercisesData } = workout;
            return { workoutTitle, exercisesData };
        } else {
            console.error('Workout not found locally', workoutId);
        }
    } catch (err) {
        console.error('Error fetching workout info locally: ' + err);
    }
    return null;
};

export default getWorkoutInfoLocally;