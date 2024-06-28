import { Timestamp } from "firebase/firestore";

export interface Set {
    reps: string;
    weight: string;
    id: string;
}

export interface Exercise {
    title: string;
    sets: Set[];
    exerciseIndex: number;
    id: string;
}

export interface Workout {
    title: string;
    exercises: Exercise[];
    id: string;
    colour: string;
}

export interface Split {
    title: string;
    created: Timestamp;
    id: string;
}

export interface Friend {
    username: string;
    id: string;
}

export interface GoalNutrients {
    calories: string,
    protein: string,
    carbs: string,
    fat: string,
    id: string
}