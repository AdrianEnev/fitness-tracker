import { Timestamp } from "firebase/firestore";

export interface Set {
    reps: number;
    weight: number;
    id: string;
}

export interface Exercise {
    title: string;
    sets: Set[];
    reps: number;
    weight: number;
    description: string;
    exerciseIndex: number;
    id: string;
}

export interface Workout {
    title: string;
    exercises: Exercise[];
    id: string;
}

export interface Split {
    title: string;
    created: Timestamp;
    id: string;
}