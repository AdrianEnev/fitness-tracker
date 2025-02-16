import AsyncStorage from "@react-native-async-storage/async-storage";
import generateRandomColour from "../use/useGenerateColour";
import getEmail from "../use/useGetEmail";
import generateID from "../use/useGenerateID";
import { serverTimestamp } from "firebase/firestore";

const addGeneratedWorkoutLocally = async (generatedWorkout: any, setGeneratingWorkout: any, folder?: any) => {
    
    const usedColours: string[] = [];

    // Function to generate a unique colour
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
        const email = await getEmail(); // Get the user's email
        if (!email) return;

        if (!generatedWorkout || !generatedWorkout.days) {
            console.error('Invalid generated workout structure:', generatedWorkout);
            return;
        }

        // Retrieve existing workouts from AsyncStorage
        const existingWorkouts = await AsyncStorage.getItem(`workouts_${email}`);
        const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        // Process each day in the generated workout
        generatedWorkout.days.forEach((day: any, index: number) => {
            const workoutTitle = day.day;

            let newWorkoutTitle = workoutTitle;
            // If workoutTitle contains "Day x - " then remove it
            const dayMatch = workoutTitle.match(/^Day (\d) - /);
            if (dayMatch && dayMatch[1] >= '1' && dayMatch[1] <= '8') {
                newWorkoutTitle = workoutTitle.replace(/^Day (\d) - /, '');
            }

            // Handle rest or active recovery days
            if (newWorkoutTitle.includes('Rest') || newWorkoutTitle.includes('Active Recovery')) {
                newWorkoutTitle = "Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($";
            }

            // Map exercises to the required structure
            const exercises = day.exercises ? day.exercises.map((exercise: any, exerciseIndex: number) => ({
                id: Math.random().toString(),
                title: exercise.name,
                exerciseIndex: exerciseIndex + 1,
                sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
                    id: Math.random().toString(),
                    reps: exercise.reps,
                    weight: exercise.weight, 
                    intensity: null, // Assuming intensity is not provided by the AI model
                    setIndex: setIndex + 1
                }))
            })) : [];

            // Create a new workout object
            const newWorkout = {
                id: generateID(),
                title: newWorkoutTitle,
                previousTitle: workoutTitle,
                created: serverTimestamp(), //new Date().toISOString() - ako ne raboti timestamp
                colour: getUniqueColour(),
                numberOfExercises: exercises.length,
                info: exercises,
                folderId: folder ? folder.id : null
            };

            workouts.push(newWorkout); // Add the new workout to the workouts array
        });

        if (!folder) {
            // Save workouts to AsyncStorage if no folder is specified
            await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(workouts));
        } else {
            // Handle saving workouts to a specific folder
            const data = await AsyncStorage.getItem(`folders_${email}`);
            let folders = data ? JSON.parse(data) : [];
            const folderIndex = folders.findIndex((f: any) => f.id === folder.id);
            if (folderIndex !== -1) {
                generatedWorkout.days.forEach((day: any, index: number) => {
                    
                    const workoutTitle = day.day;

                    let newWorkoutTitle = workoutTitle;
                    // If workoutTitle contains "Day x - " then remove it
                    const dayMatch = workoutTitle.match(/^Day (\d) - /);
                    if (dayMatch && dayMatch[1] >= '1' && dayMatch[1] <= '8') {
                        newWorkoutTitle = workoutTitle.replace(/^Day (\d) - /, '');
                    }
        
                    // Handle rest or active recovery days
                    if (newWorkoutTitle === "Rest" || newWorkoutTitle === "Rest Day" || newWorkoutTitle === "Rest/Active Recovery") {
                        newWorkoutTitle = "Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($";
                    }

                    // Map exercises to the required structure
                    const exercises = day.exercises ? day.exercises.map((exercise: any, exerciseIndex: number) => ({
                        id: Math.random().toString(),
                        title: exercise.name,
                        exerciseIndex: exerciseIndex + 1,
                        sets: Array.from({ length: exercise.sets }, (_, setIndex) => ({
                            id: Math.random().toString(),
                            reps: exercise.reps,
                            weight: exercise.weight,
                            intensity: null, // Assuming intensity is not provided by the AI model
                            setIndex: setIndex + 1
                        }))
                    })) : [];

                    // Create a new workout object
                    const newWorkout = {
                        id: generateID(),
                        title: newWorkoutTitle,
                        previousTitle: workoutTitle,
                        created: new Date().toISOString(),
                        colour: getUniqueColour(),
                        numberOfExercises: exercises.length,
                        info: exercises
                    };

                    folders[folderIndex].workouts.push(newWorkout); // Add the new workout to the folder
                });
                await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(folders)); // Save folders to AsyncStorage
            }
        }

        setGeneratingWorkout(false); // Set generating workout to false
        console.log('Generated workouts saved locally:', workouts);
    } catch (err) {
        console.error('Error saving generated workouts locally:', err);
    }
};

export default addGeneratedWorkoutLocally;