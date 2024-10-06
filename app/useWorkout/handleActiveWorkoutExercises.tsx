export const removeSet = (exerciseIndex: number, setId: string, setUserInputs: any, setNewExercises: any, userInputs: any, newExercises: any) => {
    // Update newExercises
    const updatedExercises = [...newExercises];
    const currentExercise = updatedExercises.find((exercise: any) => exercise.exerciseIndex === exerciseIndex);
    if (currentExercise) {
        currentExercise.sets = currentExercise.sets.filter((set: any) => set.id !== setId);
    }
    setNewExercises(updatedExercises);

    // Update userInputs to reflect the change
    const updatedUserInputs = [...userInputs];
    const currentUserInputExercise = updatedUserInputs.find((input: any) => input.exerciseIndex === exerciseIndex);
    if (currentUserInputExercise) {
        currentUserInputExercise.sets = currentUserInputExercise.sets.filter((set: any) => set.id !== setId);
    }
    setUserInputs(updatedUserInputs);
};

export const addExercise = (
    newExercises: any,
    userInputs: any, 
    setNewExercises: any, 
    setUserInputs: any, 
    exercises: any, 
    exercisesAdded: any, 
    setCurrentIndex: any, 
    setExercisesAdded: any
) => {
    // Use newExercises for updates to ensure UI consistency
    const updatedExercises = [...newExercises];
    const updatedUserInputs = [...userInputs]; // Clone userInputs for updates

    if (updatedExercises.length >= 9) return;

    /**
     * reps: set.reps,
                weight: set.weight,
                rpe: set.rpe !== undefined ? set.rpe : "0",
                setIndex: index + 1,
                intensity: set.intensity,
     */

    const newExercise = {
        id: Math.random().toString(),
        title: "New Exercise " + "(" + Number(updatedExercises.length + 1) + ")",
        sets: [{id: Math.random().toString(), reps: "", weight: "", rpe: "", intensity: 0}],
        exerciseIndex: updatedExercises.length + 1
    };

    updatedExercises.push(newExercise);
    updatedUserInputs.push({
        ...newExercise,
        sets: [{id: Math.random().toString(), reps: "", weight: "", rpe: "", intensity: 0}],
        note: ""
    });

    setNewExercises(updatedExercises);
    setUserInputs(updatedUserInputs);

    
    // Ensure currentIndex is within bounds
    const newIndex = exercises.length + exercisesAdded; // Calculate new index
    if (newIndex < updatedExercises.length) {
        setCurrentIndex(newIndex);
    } else {
        setCurrentIndex(updatedExercises.length - 1); // Set to last valid index
    }

    setExercisesAdded(exercisesAdded + 1);
}

export const addSet = (
    newExercises: any,
    userInputs: any,
    currentIndex: any,
    setNewExercises: any,
    setUserInputs: any
) => {
    // Use newExercises for updates to ensure UI consistency
    const updatedExercises = [...newExercises];
    const updatedUserInputs = [...userInputs]; // Clone userInputs for updates

    const currentExerciseIndex = updatedExercises.findIndex((exercise: any) => exercise.exerciseIndex === currentIndex + 1);
    if (currentExerciseIndex !== -1) {
        // Check if the current number of sets is less than 20
        if (updatedExercises[currentExerciseIndex].sets.length < 15) {
            const newSet = {
                id: Math.random().toString(),
                reps: "",
                weight: "",
                rpe: "",
                intensity: 0
            };

            // Update both exercises and userInputs
            updatedExercises[currentExerciseIndex].sets.push(newSet);
            updatedUserInputs[currentExerciseIndex].sets.push({...newSet}); // Clone newSet for userInputs

            setNewExercises(updatedExercises);
            setUserInputs(updatedUserInputs); // Update userInputs to reflect the new set
        } else {
            // Optionally, you can show a message to the user indicating the max limit has been reached
            console.log("Maximum number of sets reached");
        }
    }
}

export const handleEndWorkoutVisibility = (
    userInputs: any,
    setIsEndWorkoutModalVisible: any,
    navigation: any
) => {
    // Check if userInputs are not empty and at least one userInput has sets with meaningful input
    const shouldShowModal = userInputs.length && userInputs.some((userInput: any) => {
        return userInput.sets && 
        userInput.sets.length > 0 && 
        userInput.sets.some((set: any) => set.reps !== '' || set.weight !== '');
    });

    // Additional check: Consider workout empty if all sets in all userInputs have no reps and weight input
    const isEverySetEmpty = userInputs.every((userInput: any) => {
        return userInput.sets.every((set: any) => set.reps === '' && set.weight === '');
    });

    if (shouldShowModal && !isEverySetEmpty) {
        setIsEndWorkoutModalVisible(true);
    } else {
        // If the condition is not met or all sets are empty, navigate to the main page directly
        navigation.navigate('Главна Страница');
    }
};