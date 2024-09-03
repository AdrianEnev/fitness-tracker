import { Workout } from "../../interfaces";
import getWorkoutInfoLocally from "./useGetWorkoutInfoLocally";

const startWorkout = async (workout: Workout, navigation: any) => {

    const workoutInfo = await getWorkoutInfoLocally(workout.id);
    if (workoutInfo) {

        const { exercisesData, workoutTitle } = workoutInfo;
        navigation.navigate("Активна-Тренировка", {exercises: exercisesData, workoutTitle: workoutTitle, workout: workout});

    }
}

export default startWorkout