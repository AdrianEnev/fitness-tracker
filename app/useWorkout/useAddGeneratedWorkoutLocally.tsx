import AsyncStorage from "@react-native-async-storage/async-storage";
import generateRandomColour from "../use/useGenerateColour";
import getEmail from "../use/useGetEmail";

const addGeneratedWorkoutLocally = async (generatedWorkout: any, folder?: any) => {
    const usedColours: string[] = [];

    const getUniqueColour = () => {
        let colour;
        do {
            colour = generateRandomColour();
        } while (usedColours.includes(colour) && usedColours.length < 7);

        if (usedColours.length >= 7) {
            usedColours.length = 0; // Reset the used colours array
        }

        usedColours.push(colour);
        return colour;
    };

    try {
        const email = await getEmail();
        if (!email) return;

        if (!generatedWorkout || !generatedWorkout.days) {
            console.error('Invalid generated workout structure:', generatedWorkout);
            return;
        }

        const existingWorkouts = await AsyncStorage.getItem(`workouts_${email}`);
        const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        generatedWorkout.days.forEach((day: any, index: number) => {
            const workoutTitle = day.day;

            let newWorkoutTitle = workoutTitle;
            // if workoutTitle contains "Day x - " then remove it
            const dayMatch = workoutTitle.match(/^Day (\d) - /);
            if (dayMatch && dayMatch[1] >= '1' && dayMatch[1] <= '8') {
                newWorkoutTitle = workoutTitle.replace(/^Day (\d) - /, '');
            }

            if (newWorkoutTitle === "Rest") {
                newWorkoutTitle = "Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($";
            }

            const exercises = day.exercises ? day.exercises.map((exercise: any, exerciseIndex: number) => ({
                id: Math.random().toString(),
                title: exercise.name,
                exerciseIndex: exerciseIndex + 1,
                sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
                    id: Math.random().toString(),
                    reps: exercise.reps,
                    weight: "", // Assuming weight is not provided by the AI model
                    intensity: null, // Assuming intensity is not provided by the AI model
                    setIndex: setIndex + 1
                }))
            })) : [];

            const newWorkout = {
                id: Math.random().toString(),
                title: newWorkoutTitle,
                previousTitle: workoutTitle,
                created: new Date().toISOString(),
                colour: getUniqueColour(),
                numberOfExercises: exercises.length,
                info: exercises
            };

            workouts.push(newWorkout);
        });

        if (!folder) {
            await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(workouts));
        } else {
            const data = await AsyncStorage.getItem(`folders_${email}`);
            let folders = data ? JSON.parse(data) : [];
            const folderIndex = folders.findIndex((f: any) => f.id === folder.id);
            if (folderIndex !== -1) {
                generatedWorkout.days.forEach((day: any, index: number) => {
                    
                    const workoutTitle = day.day;

                    let newWorkoutTitle = workoutTitle;
                    // if workoutTitle contains "Day x - " then remove it
                    const dayMatch = workoutTitle.match(/^Day (\d) - /);
                    if (dayMatch && dayMatch[1] >= '1' && dayMatch[1] <= '8') {
                        newWorkoutTitle = workoutTitle.replace(/^Day (\d) - /, '');
                    }
        
                    if (newWorkoutTitle === "Rest" || newWorkoutTitle === "Rest Day" || newWorkoutTitle === "Rest/Active Recovery") {
                        newWorkoutTitle = "Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($";
                    }

                    const exercises = day.exercises ? day.exercises.map((exercise: any, exerciseIndex: number) => ({
                        id: Math.random().toString(),
                        title: exercise.name,
                        exerciseIndex: exerciseIndex + 1,
                        sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
                            id: Math.random().toString(),
                            reps: exercise.reps,
                            weight: "", // Assuming weight is not provided by the AI model
                            intensity: null, // Assuming intensity is not provided by the AI model
                            setIndex: setIndex + 1
                        }))
                    })) : [];

                    const newWorkout = {
                        id: Math.random().toString(),
                        title: newWorkoutTitle,
                        previousTitle: workoutTitle,
                        created: new Date().toISOString(),
                        colour: getUniqueColour(),
                        numberOfExercises: exercises.length,
                        info: exercises
                    };

                    folders[folderIndex].workouts.push(newWorkout);
                });
                await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(folders));
            }
        }
        console.log('Generated workouts saved locally:', workouts);
    } catch (err) {
        console.error('Error saving generated workouts locally:', err);
    }
};

export default addGeneratedWorkoutLocally;