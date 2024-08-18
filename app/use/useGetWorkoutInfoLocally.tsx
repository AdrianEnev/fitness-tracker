import AsyncStorage from '@react-native-async-storage/async-storage';

const getWorkoutInfoLocally = async (workoutId: string) => {
    try {
        console.log('Fetching workout info locally...');
        
        // Retrieve workouts from local storage
        const data = await AsyncStorage.getItem('workouts');
        const workouts = data ? JSON.parse(data) : [];

        // Ensure each workout has a unique key
        workouts.forEach((workout: any, index: number) => {
            if (!workout.key) {
                workout.key = workout.id || index.toString();
            }
        });

        // Find the specific workout by ID
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
}

export default getWorkoutInfoLocally;