import AsyncStorage from '@react-native-async-storage/async-storage';
import generateID from './useGenerateID';
import { serverTimestamp } from 'firebase/firestore';

const endWorkoutLocally = async (exercises: any, workoutTitle: string, duration: any, id: any) => {

    if (!exercises.length || exercises.every((exercise: any) => 
        !exercise.sets || 
        exercise.sets.length === 0 || 
        exercise.sets.every((set: any) => set.reps === ''))) {
        
        return;
    }

    const workoutObj = {
        id: id,
        title: workoutTitle,
        created: new Date().toISOString(),
        duration: duration,
        exercises: exercises.map((exercise: any) => ({
            title: exercise.title,
            description: exercise.description || "",
            exerciseIndex: exercise.exerciseIndex,
            note: exercise.note,
            sets: exercise.sets.map((set: any, index: any) => ({
                reps: set.reps,
                weight: set.weight,
                rpe: set.rpe !== undefined ? set.rpe : "0",
                setIndex: index + 1
            }))
        }))
    };

    try {
        // Retrieve existing workouts from AsyncStorage
        const savedWorkouts = await AsyncStorage.getItem('savedWorkouts');
        const savedWorkoutsArray = savedWorkouts ? JSON.parse(savedWorkouts) : [];

        // Add new workout to the array
        savedWorkoutsArray.push(workoutObj);

        // Save updated workouts array back to AsyncStorage
        await AsyncStorage.setItem('savedWorkouts', JSON.stringify(savedWorkoutsArray));

        // Update local statistics
        let totalWeight = 0;
        exercises.forEach((exercise: any) => {
            exercise.sets.forEach((set: any) => {
                const weight = parseFloat(set.weight);
                if (!isNaN(weight)) {
                    totalWeight += weight;
                }
            });
        });

        const statistics = await AsyncStorage.getItem('statistics');
        const statisticsData = statistics ? JSON.parse(statistics) : { weightLifted: 0, finishedWorkouts: 0 };

        statisticsData.weightLifted += totalWeight;
        statisticsData.finishedWorkouts += 1;

        await AsyncStorage.setItem('statistics', JSON.stringify(statisticsData));
        console.log('Workout saved locally');
    } catch (err) {
        console.error(err);
    }
}

export default endWorkoutLocally;