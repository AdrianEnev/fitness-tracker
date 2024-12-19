import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../use/useGetEmail";
import { Workout } from "../../interfaces";
import generateID from "../use/useGenerateID";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import i18next from "i18next";

const deleteSubcollections = async (docRef: any) => {
    const subcollections = await getDocs(collection(docRef, 'info'));
    for (const subcollectionDoc of subcollections.docs) {
        const setsCollection = await getDocs(collection(subcollectionDoc.ref, 'sets'));
        for (const setDoc of setsCollection.docs) {
            await deleteDoc(setDoc.ref);
        }
        await deleteDoc(subcollectionDoc.ref);
    }
};

export const deleteSelectedWorkouts = async (
    selectedWorkouts: any, setWorkouts: any, setSelectedWorkouts: any, setSelectionMode: any, firebaseWorkouts: any, internetConnected: any,
    userWorkoutsCollectionRef: any
) => {
    try {
        const email = await getEmail();
        if (!email) return;

        const data = await AsyncStorage.getItem(`workouts_${email}`);
        let workouts = data ? JSON.parse(data) : [];

        // Filter out the selected workouts
        const updatedWorkouts = workouts.filter((workout: Workout) => 
            !selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id)
        );

        // Update AsyncStorage with the new list of workouts
        await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(updatedWorkouts));

        // Update state
        setWorkouts(updatedWorkouts);
        setSelectedWorkouts([]);
        setSelectionMode(false);
        console.log('Selected workouts deleted');
    } catch (err) {
        console.error(err);
    }

    if (internetConnected) {
        try {
            for (const selectedWorkout of selectedWorkouts) {
                const selectedWorkoutID = selectedWorkout.id;
                const selectedWorkoutDoc = doc(userWorkoutsCollectionRef, selectedWorkoutID);

                // Delete all subcollections and their documents
                await deleteSubcollections(selectedWorkoutDoc);

                // Delete the workout document
                await deleteDoc(selectedWorkoutDoc);
                console.log(`Workout with ID ${selectedWorkoutID} deleted from Firebase`);
            }
        } catch (err) {
            console.error(err);
        }
    }
};

// Function to copy selected workouts
export const copySelectedWorkouts = async (selectedWorkouts: any) => {
    try {
        const email = await getEmail();
        if (!email) return;

        const data = await AsyncStorage.getItem(`workouts_${email}`);
        let workouts = data ? JSON.parse(data) : [];

        // Filter out the selected workouts
        const selectedWorkoutsData = workouts.filter((workout: Workout) => 
            selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id)
        );

        // Store the selected workouts in a separate AsyncStorage item
        await AsyncStorage.setItem(`copied_workouts_${email}`, JSON.stringify(selectedWorkoutsData));

        console.log('Selected workouts copied');
    } catch (err) {
        console.error(err);
    }
}

// Function to cut selected workouts
export const cutSelectedWorkouts = async (
    selectedWorkouts: any, setWorkouts: any, setSelectedWorkouts: any, setSelectionMode: any, firebaseWorkouts: any, internetConnected: any,
    userWorkoutsCollectionRef: any
) => {
    try {
        const email = await getEmail();
        if (!email) return;

        const data = await AsyncStorage.getItem(`workouts_${email}`);
        let workouts = data ? JSON.parse(data) : [];

        // Filter out the selected workouts
        const selectedWorkoutsData = workouts.filter((workout: Workout) => 
            selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id)
        );

        // Store the selected workouts in a separate AsyncStorage item
        await AsyncStorage.setItem(`cut_workouts_${email}`, JSON.stringify(selectedWorkoutsData));

        // Delete the selected workouts from the main workouts list
        await deleteSelectedWorkouts(selectedWorkouts, setWorkouts, setSelectedWorkouts, setSelectionMode, firebaseWorkouts, internetConnected, userWorkoutsCollectionRef);

        if (internetConnected) {
            try {
                for (const selectedWorkout of selectedWorkouts) {
                    const selectedWorkoutID = selectedWorkout.id;
                    const selectedWorkoutDoc = doc(userWorkoutsCollectionRef, selectedWorkoutID);
                    await deleteDoc(selectedWorkoutDoc);
                    console.log(`Workout with ID ${selectedWorkoutID} deleted from Firebase`);
                }
            } catch (err) {
                console.error(err);
            }
        }

        console.log('Selected workouts cut');
    } catch (err) {
        console.error(err);
    }
};

// Function to paste cut workouts
export const pasteCutWorkouts = async (setWorkouts: any) => {
    try {
        const email = await getEmail();
        if (!email) return;

        // Get the cut workouts from AsyncStorage
        const cutData = await AsyncStorage.getItem(`cut_workouts_${email}`);
        const cutWorkouts = cutData ? JSON.parse(cutData) : [];

        if (cutWorkouts.length === 0) {
            console.log('No cut workouts to paste');
            return;
        }

        // Get the current workouts from AsyncStorage
        const data = await AsyncStorage.getItem(`workouts_${email}`);
        let workouts = data ? JSON.parse(data) : [];

        // Add the cut workouts to the current workouts
        const updatedWorkouts = [...workouts, ...cutWorkouts];

        // Update AsyncStorage with the new list of workouts
        await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(updatedWorkouts));

        // Clear the cut workouts from AsyncStorage
        await AsyncStorage.removeItem(`cut_workouts_${email}`);

        // Update state
        setWorkouts(updatedWorkouts);

        console.log('Cut workouts pasted');
    } catch (err) {
        console.error(err);
    }
};

// Helper function to extract base title and copy number from a title
const extractBaseTitleAndCopyNumber = (title: string) => {
    const regex = /^(.*?)( copy(?: \((\d+)\))?)?$/;
    const match = title.match(regex);
    const baseTitle = match ? match[1] : title;
    const copyNumber = match && match[3] ? parseInt(match[3], 10) : (match && match[2] ? 1 : 0);
    return { baseTitle, copyNumber };
};

const MAX_TITLE_LENGTH = 50; // Set your desired maximum character limit

const generateNewTitle = (baseTitle: string, existingTitles: string[]) => {
    const currentLanguage = i18next.language;

    let copyText = 'copy';

    if (currentLanguage === 'bg') {
        copyText = 'копие';
    } else if (currentLanguage === 'ru') {
        copyText = 'копия';
    } else if (currentLanguage === 'de') {
        copyText = 'Kopie';
    } else if (currentLanguage === 'fr') {
        copyText = 'copie';
    } else if (currentLanguage === 'es') {
        copyText = 'copia';
    } else if (currentLanguage === 'it') {
        copyText = 'copia';
    }

    let maxCopyNumber = 0;
    existingTitles.forEach(title => {
        const { baseTitle: existingBaseTitle, copyNumber } = extractBaseTitleAndCopyNumber(title);
        if (existingBaseTitle === baseTitle && copyNumber > maxCopyNumber) {
            maxCopyNumber = copyNumber;
        }
    });

    let newTitle = `${baseTitle} ${copyText}${maxCopyNumber > 0 ? ` (${maxCopyNumber + 1})` : ''}`;

    // Truncate the title if it exceeds the maximum length
    if (newTitle.length > MAX_TITLE_LENGTH) {
        newTitle = newTitle.substring(0, MAX_TITLE_LENGTH);
    }

    return newTitle;
};

// Function to paste copied workouts
export const pasteCopiedWorkouts = async () => {
    try {
        const email = await getEmail();
        if (!email) return;

        // Get the copied workouts from AsyncStorage
        const cutData = await AsyncStorage.getItem(`copied_workouts_${email}`);
        const copiedWorkouts = cutData ? JSON.parse(cutData) : [];

        if (copiedWorkouts.length === 0) {
            console.log('No copied workouts to paste');
            return;
        }

        // Get the current workouts from AsyncStorage
        const data = await AsyncStorage.getItem(`workouts_${email}`);
        let workouts = data ? JSON.parse(data) : [];

        // Check for duplicates and rename if necessary
        const updatedCopiedWorkouts = copiedWorkouts.map((copiedWorkout: any) => {
            const exists = workouts.some((workout: any) => workout.id === copiedWorkout.id);
            if (exists) {
                const existingTitles = workouts.map((workout: any) => workout.title);
                const { baseTitle } = extractBaseTitleAndCopyNumber(copiedWorkout.title);
                copiedWorkout.title = generateNewTitle(baseTitle, existingTitles);
                copiedWorkout.id = generateID();
            }
            return copiedWorkout;
        });

        // Add the copied workouts to the current workouts
        const updatedWorkouts = [...workouts, ...updatedCopiedWorkouts];

        // Update AsyncStorage with the new list of workouts
        await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(updatedWorkouts));

        // Clear the copied workouts from AsyncStorage
        await AsyncStorage.removeItem(`copied_workouts_${email}`);

        console.log('Copied workouts pasted');
    } catch (err) {
        console.error(err);
    }
};
