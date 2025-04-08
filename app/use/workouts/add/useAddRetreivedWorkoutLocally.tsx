import AsyncStorage from '@react-native-async-storage/async-storage';
import generateRandomColour from '@use/settings/add/useGenerateColour';
import getEmail from '@use/settings/get/useGetEmail'

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

const addEmptyFolder = async (folderId: string) => {
    
    let folderTitle = "New Folder";
    const currentLanguage = await AsyncStorage.getItem('language');
    if (currentLanguage == "bg") {
        folderTitle = "Нова Папка";
    } else if (currentLanguage == "de") {
        folderTitle = "Neuer Ordner";
    } else if (currentLanguage == "ru") {
        folderTitle = "Новая папка";
    }

    try {
        const email = await getEmail();
        if (!email) return;

        const newFolder = {
            id: folderId,
            title: folderTitle,
            type: 'folder',
            workouts: []
        };

        const data = await AsyncStorage.getItem(`folders_${email}`);
        let folders = data ? JSON.parse(data) : [];

        folders.push(newFolder);

        await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(folders));
        console.log('New folder added');
        return newFolder;
    } catch (err) {
        console.error(err);
    }
};

const addRetrievedWorkoutLocally = async (exercises: any, workoutTitle: string, id: any, folderId: any) => {
    try {
        const email = await getEmail();
        if (!email) return;

        const existingWorkouts = await AsyncStorage.getItem(`workouts_${email}`);
        const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        // if the exercise title wasn't able to be retreived, it falls back to an automatically generated one
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

        const newWorkout = {
            id: id,
            title: workoutTitle.trim(),
            created: new Date().toISOString(),
            colour: generateRandomColour(),
            numberOfExercises: exercises.length,
            info: [] as ExerciseInfo[],
            folderId: folderId ? folderId : null
        };

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

        if (!folderId) {
            workouts.push(newWorkout);
            await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(workouts));
        } else {
            const data = await AsyncStorage.getItem(`folders_${email}`);
            let folders = data ? JSON.parse(data) : [];
            let folder = folders.find((f: any) => f.id === folderId);

            if (!folder) {
                folder = await addEmptyFolder(folderId);
                folders.push(folder);
            }

            // Check if workout with the same id already exists in the folder
            const workoutExists = folder.workouts.some((workout: any) => workout.id === id);
            if (!workoutExists) {
                folder.workouts.push(newWorkout);
                await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(folders));
            } else {
                console.log('Workout with the same id already exists in the folder');
            }
        }

        console.log('Retrieved workout saved locally:', newWorkout);
    } catch (err) {
        console.error('Error saving retrieved workout locally:', err);
    }
};

export default addRetrievedWorkoutLocally;