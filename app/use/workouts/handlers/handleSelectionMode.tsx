import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "@use/settings/get/useGetEmail";
import { Workout } from "@config/interfaces";
import generateID from "@use/settings/add/useGenerateID";
import i18next from "i18next";
import { FIREBASE_AUTH } from "@config/firebaseConfig";

export const deleteSelectedWorkouts = async (
    selectedWorkouts: any, setWorkouts: any, setSelectedWorkouts: any, setSelectionMode: any, internetConnected: any
) => {

    // Remove workouts from  asyncstorage
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

    // Remove workouts from firebase
    const userId = FIREBASE_AUTH.currentUser?.uid;

    if (internetConnected) {
        // Request workout deletion by sending userId and workouts to delete
        try {
            const response = await fetch(`http://localhost:3000/api/workouts/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    selectedWorkouts: selectedWorkouts,
                    userId: userId
                }),
            });

            if (!response.ok) {
                console.error("deleteWorkout: error deleting workout/s", response.statusText);
                return null;
            }

            console.log('Successfuly removed workout/s from firebase');
        } catch (error) {
            console.error("deleteWorkout: error deleting workout/s", error);
            return null;
        }
    }
};

export const cutSelectedWorkouts = async (
    selectedWorkouts: any, setWorkouts: any, setSelectedWorkouts: any, setSelectionMode: any) => 
{
    try {
        const email = await getEmail();
        if (!email) return;

        const data = await AsyncStorage.getItem(`workouts_${email}`);
        let workouts = data ? JSON.parse(data) : [];

        // Filter out selected workouts
        const selectedWorkoutsData = workouts.filter((workout: Workout) => 
            selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id)
        );

        // Store cut workouts in AsyncStorage
        await AsyncStorage.setItem(`cut_workouts_${email}`, JSON.stringify(selectedWorkoutsData));

        // Remove them from local storage but **NOT Firebase**
        const remainingWorkouts = workouts.filter((workout: Workout) => 
            !selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id)
        );
        await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(remainingWorkouts));

        // Update state
        setWorkouts(remainingWorkouts);
        setSelectedWorkouts([]);
        setSelectionMode(false);

        console.log('Selected workouts cut (but not deleted from Firebase)');
    } catch (err) {
        console.error(err);
    }
};

export const pasteCutWorkouts = async (setWorkouts: any) => {
    try {
        const email = await getEmail();
        if (!email) return;

        // Get cut workouts from AsyncStorage
        const cutData = await AsyncStorage.getItem(`cut_workouts_${email}`);
        const cutWorkouts = cutData ? JSON.parse(cutData) : [];

        if (cutWorkouts.length === 0) {
            console.log('No cut workouts to paste');
            return;
        }

        // Get current workouts
        const data = await AsyncStorage.getItem(`workouts_${email}`);
        let workouts = data ? JSON.parse(data) : [];

        // Add cut workouts back
        const updatedWorkouts = [...workouts, ...cutWorkouts];

        // Update AsyncStorage
        await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(updatedWorkouts));
        setWorkouts(updatedWorkouts);

        // Clear cut workouts from AsyncStorage
        await AsyncStorage.removeItem(`cut_workouts_${email}`);

        console.log('Cut workouts pasted and deleted from Firebase');
    } catch (err) {
        console.error(err);
    }
};

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
