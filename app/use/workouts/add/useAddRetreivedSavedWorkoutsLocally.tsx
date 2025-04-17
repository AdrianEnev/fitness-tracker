import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "@use/settings/get/useGetEmail";

// Could just be renamed to addSavedWorkoutsLocally but since it has no other use it's kept like this for clarity
// Takes 1 or more missing saved workouts and adds them to asyncstorage
const useAddRetreivedSavedWorkoutsLocally = async (savedWorkoutsArray: any[]) => {
    try {
        const email = await getEmail();
        if (!email) return;

        const existingWorkouts = await AsyncStorage.getItem(`savedWorkouts_${email}`);
        const savedWorkouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        const currentLanguage = await AsyncStorage.getItem('language');

        let exerciseTitleLang = "Exercise";
        if (currentLanguage == "bg") {
            exerciseTitleLang = "Упражнение";
        } else if (currentLanguage == "de") {
            exerciseTitleLang = "Übung";
        } else if (currentLanguage == "ru") {
            exerciseTitleLang = "Упражнение";
        } else if (currentLanguage == "es") {
            exerciseTitleLang = "Ejercicio";
        } else if (currentLanguage == "it") {
            exerciseTitleLang = "Esercizio";
        } else if (currentLanguage == "fr") {
            exerciseTitleLang = "Exercice";
        }

        for (const workoutData of savedWorkoutsArray) {

            const { exercises, title, id, duration, created } = workoutData;

            const newSavedWorkout = {
                id: id,
                title: title,
                created: created,
                duration: duration,
                exercises: exercises.map((exercise: any) => ({
                    title: exercise.title || `${exerciseTitleLang} ${exercise.exerciseIndex}`,
                    description: exercise.description || "",
                    exerciseIndex: exercise.exerciseIndex,
                    note: exercise.note,
                    sets: exercise.sets.map((set: any, index: any) => ({
                        reps: set.reps,
                        weight: set.weight,
                        rpe: set.rpe !== undefined ? set.rpe : "0",
                        setIndex: index + 1,
                        intensity: set.intensity || "0"
                    }))
                }))
            };
            savedWorkouts.push(newSavedWorkout);
        }

        // Save all saved workouts at once after processing
        await AsyncStorage.setItem(`savedWorkouts_${email}`, JSON.stringify(savedWorkouts));
        console.log('Retreived saved workouts successfuly!');

    } catch (error: any) {
        console.error("Retreive saved workouts error", error);
    }
}

export default useAddRetreivedSavedWorkoutsLocally;