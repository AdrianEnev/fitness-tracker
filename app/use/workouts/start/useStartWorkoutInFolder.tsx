const startWorkoutInFolder = async (workout: any, folder: any, navigation: any) => {
    
    // Find the workout in the folder
    const workoutInfo = folder.workouts.find((w: any) => w.id === workout.id);

    if (workoutInfo) {
        // Log the keys of workoutInfo to understand its structure
        console.log('Workout Info Keys:', Object.keys(workoutInfo));

        const exercisesData = workoutInfo.info;
        const workoutTitle = workoutInfo.title;

        navigation.navigate("Active-Workout", {exercises: exercisesData, workoutTitle: workoutTitle, workout: workout});
    } else {
        console.log("Workout not found in the folder");
    }
}

export default startWorkoutInFolder;