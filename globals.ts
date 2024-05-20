import { Split } from './app/screens/Splits';
import { Day } from './app/screens/Days';
import { ExerciseInterface } from './app/screens/Exercises';
import { SavedWorkout } from './app/screens/SavedWorkouts';

let currentSplit: Split | null = null;

export const setCurrentSplit = (newSplit: Split) => {
    currentSplit = newSplit;
};
export const getCurrentSplit = () => {
    return (currentSplit);
}

//--------------------------------------

let currentDay: Day | null = null;

export const setCurrentDay = (newDay: Day) => {
    currentDay = newDay;
};
export const getCurrentDay = () => {
    return (currentDay);
}

//--------------------------------------

let currentExercise: ExerciseInterface | null = null;

export const setCurrentExercise = (newExercise: ExerciseInterface) => {
    currentExercise = newExercise;
};
export const getCurrentExercise = () => {
    return (currentExercise);
}
//--------------------------------------

let currentSavedWorkout: SavedWorkout | null = null;

export const setCurrentSavedWorkout = (newSavedWorkout: SavedWorkout) => {
    currentSavedWorkout = newSavedWorkout;
};
export const getCurrentSavedWorkout = () => {
    return (currentSavedWorkout);
}
