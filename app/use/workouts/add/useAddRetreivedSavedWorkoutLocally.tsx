import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "@use/settings/get/useGetEmail";

const useAddRetreivedWorkoutLocally = async (exercises: any, workoutTitle: string, id: any, workoutDuration: any) => {
    try {
        const email = await getEmail();
        if (!email) return;

        const existingWorkouts = await AsyncStorage.getItem(`savedWorkouts_${email}`);
        const savedWorkouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        let exerciseTitleLang = "Exercise";
        const currentLanguage = await AsyncStorage.getItem('language');
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
        }

        const newSavedWorkout = {
            id: id,
            title: workoutTitle.trim(),
            created: new Date().toISOString(),
            duration: workoutDuration,
            exercises: exercises.map((exercise: any) => ({
                title: exercise.title || `${exerciseTitleLang} ${exercise.exerciseIndex + 1}`,
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
        await AsyncStorage.setItem(`savedWorkouts_${email}`, JSON.stringify(savedWorkouts));
        console.log('Retrieved workout saved locally');
    } catch (error: any) {
        console.error(error);
    }
}

export default useAddRetreivedWorkoutLocally;