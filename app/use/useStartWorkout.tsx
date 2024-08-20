import { Workout } from "../../interfaces";
import getWorkoutInfo from "./useGetWorkoutInfo";

const startWorkout = async (workout: Workout, navigation: any) => {

    const workoutInfo = await getWorkoutInfo(workout.id);
    if (workoutInfo) {

        const { exercisesData, workoutTitle } = workoutInfo;
        navigation.navigate("Активна-Тренировка", {exercises: exercisesData, workoutTitle: workoutTitle, workout: workout});

    }
}

export default startWorkout