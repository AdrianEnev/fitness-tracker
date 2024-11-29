import AsyncStorage from '@react-native-async-storage/async-storage';
import generateRandomColour from '../use/useGenerateColour';
import getEmail from '../use/useGetEmail';

interface SetInfo {
    id: string;
    reps: any;
    weight: any;
    intensity: any | null;
    setIndex: number;
}

interface ExerciseInfo {
    id: string;
    title: string;
    exerciseIndex: number;
    sets: SetInfo[];
}

const addWorkoutLocally = async (exercises: any, workoutTitle: string, id: any, folder: any) => {
    try {
        const email = await getEmail();
        if (!email) return;

        const existingWorkouts = await AsyncStorage.getItem(`workouts_${email}`);
        const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        let exerciseTitleLang = "Exercise"
        const currentLanguage = await AsyncStorage.getItem('language')
        if (currentLanguage == "bg") {
            exerciseTitleLang = "Упражнение"
        }
        else if (currentLanguage == "de") {
            exerciseTitleLang = "Übung"
        }
        else if (currentLanguage == "ru") {
            exerciseTitleLang = "Упражнение"
        }
        else if (currentLanguage == "es") {
            exerciseTitleLang = "Ejercicio"
        }
        else if (currentLanguage == "it") {
            exerciseTitleLang = "Esercizio"
        }

        // Create new workout object
        const newWorkout = {
            id: id,
            title: workoutTitle.trim(),
            created: new Date().toISOString(),
            colour: generateRandomColour(),
            numberOfExercises: exercises.length,
            info: [] as ExerciseInfo[],
            folderId: folder ? folder.id : null
        };

        // Add exercises and sets to the workout
        exercises.forEach((exercise: any) => {
            const exerciseInfo: ExerciseInfo = {
                id: Math.random().toString(),
                title: exercise.title.trim() || exerciseTitleLang + ` ${exercise.exerciseIndex + 1}`,
                exerciseIndex: exercise.exerciseIndex + 1,
                sets: []
            };

            exercise.sets.forEach((set: any, index: any) => {
                const setInfo: SetInfo = {
                    id: Math.random().toString(),
                    reps: set.reps,
                    weight: set.weight,
                    intensity: set.intensity ? set.intensity : null,
                    setIndex: index + 1
                };
                exerciseInfo.sets.push(setInfo);
            });

            newWorkout.info.push(exerciseInfo);
        });

        // Add new workout to the list of workouts
        workouts.push(newWorkout);

        // Save updated workouts list to local storage
        if (!folder) {
            await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(workouts));
        }else{
            // folder object:  {"id": "folder_1726759925197", "title": "New Folder", "type": "folder", "workouts": []}
            const data = await AsyncStorage.getItem(`folders_${email}`);
            let folders = data ? JSON.parse(data) : [];
            const index = folders.findIndex((f: any) => f.id === folder.id);
            folders[index].workouts.push(newWorkout);
            await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(folders));
        }

        console.log('Workout saved locally:', newWorkout);
    } catch (err) {
        console.error('Error saving workout locally:', err);
    }
};

export default addWorkoutLocally;