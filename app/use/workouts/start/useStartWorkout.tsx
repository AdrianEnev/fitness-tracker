import { Workout } from "@config/interfaces";
import getWorkoutInfoLocally from "@use/workouts/get/useGetWorkoutInfoLocally";

const startWorkout = async (workout: Workout, navigation: any) => {

    const workoutInfo = await getWorkoutInfoLocally(workout.id);
    if (workoutInfo) {

        const { exercisesData, workoutTitle } = workoutInfo;
        navigation.navigate("Активна-Тренировка", {exercises: exercisesData, workoutTitle: workoutTitle, workout: workout});

    }
}

export default startWorkout