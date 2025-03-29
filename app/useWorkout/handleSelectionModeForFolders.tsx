import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../use/useGetEmail";
import { Workout } from "../../interfaces";
import generateID from "../use/useGenerateID";
import i18next from "i18next";
import { FIREBASE_AUTH } from "../../firebaseConfig";

export const deleteSelectedWorkoutsInFolder = async (
    selectedWorkouts: any, folderId: string, setSelectedWorkouts: any, setSelectionMode: any, internetConnected: any
) => {
    try {
        const email = await getEmail();
        if (!email) return;

        // Retrieve folders from AsyncStorage
        const data = await AsyncStorage.getItem(`folders_${email}`);
        let folders = data ? JSON.parse(data) : [];

        // Find the folder and filter out the selected workouts
        const updatedFolders = folders.map((folder: any) => {
            if (folder.id === folderId) {
                folder.workouts = folder.workouts.filter((workout: Workout) => 
                    !selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id)
                );
            }
            return folder;
        });

        // Update AsyncStorage with the new list of folders
        await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(updatedFolders));

        // Update state
        setSelectedWorkouts([]);
        setSelectionMode(false);
        console.log('Selected workouts deleted from folder');
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
                    'Content-Type': 'application/json', // Specifies the request body is JSON
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

export const cutSelectedWorkoutsInFolder = async (
    selectedWorkouts: any, folderId: string, setSelectedWorkouts: any, setSelectionMode: any
) => {
    try {
        const email = await getEmail();
        if (!email) return;

        // Store the selected workouts in a separate AsyncStorage item
        await AsyncStorage.setItem(`cut_workouts_${email}`, JSON.stringify(selectedWorkouts));
        console.log('Selected workouts cut from folder');

        // Remove selected workouts from the folder locally but **do not delete from Firebase yet**
        const data = await AsyncStorage.getItem(`folders_${email}`);
        let folders = data ? JSON.parse(data) : [];

        const updatedFolders = folders.map((folder: any) => {
            if (folder.id === folderId) {
                folder.workouts = folder.workouts.filter(
                    (workout: any) => !selectedWorkouts.some((sw: any) => sw.id === workout.id)
                );
            }
            return folder;
        });

        // Update AsyncStorage
        await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(updatedFolders));

        // Update state
        setSelectedWorkouts([]);
        setSelectionMode(false);

        console.log('Workouts removed from folder but not deleted from Firebase yet');
    } catch (err) {
        console.error(err);
    }
};

export const pasteCutWorkoutsInFolder = async (
    folderId: string
) => {
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

        // Retrieve folders from AsyncStorage
        const data = await AsyncStorage.getItem(`folders_${email}`);
        let folders = data ? JSON.parse(data) : [];

        // Add the cut workouts to the specified folder
        const updatedFolders = folders.map((folder: any) => {
            if (folder.id === folderId) {
                folder.workouts = [...folder.workouts, ...cutWorkouts];
            }
            return folder;
        });

        // Update AsyncStorage with the new list of folders
        await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(updatedFolders));

        // Clear the cut workouts from AsyncStorage
        await AsyncStorage.removeItem(`cut_workouts_${email}`);

        console.log('Cut workouts pasted into folder and deleted from Firebase');
    } catch (err) {
        console.error(err);
    }
};

export const copySelectedWorkoutsInFolder = async (selectedWorkouts: any) => {
    try {
        const email = await getEmail();
        if (!email) return;

        // Store the selected workouts in a separate AsyncStorage item
        await AsyncStorage.setItem(`copied_workouts_${email}`, JSON.stringify(selectedWorkouts));
        console.log('Selected workouts copied from folder');
    } catch (err) {
        console.error(err);
    }
}

export const pasteCopiedWorkoutsInFolder = async (folderId: string) => {
    try {
        const email = await getEmail();
        if (!email) return;

        // Get the copied workouts from AsyncStorage
        const copiedData = await AsyncStorage.getItem(`copied_workouts_${email}`);
        const copiedWorkouts = copiedData ? JSON.parse(copiedData) : [];

        if (copiedWorkouts.length === 0) {
            console.log('No copied workouts to paste');
            return;
        }

        // Retrieve folders from AsyncStorage
        const data = await AsyncStorage.getItem(`folders_${email}`);
        let folders = data ? JSON.parse(data) : [];

        // Check for duplicates and rename if necessary
        const updatedCopiedWorkouts = copiedWorkouts.map((copiedWorkout: any) => {
            const exists = folders.some((folder: any) => 
                folder.workouts.some((workout: any) => workout.id === copiedWorkout.id)
            );
            if (exists) {
                const existingTitles = folders.flatMap((folder: any) => folder.workouts.map((workout: any) => workout.title));
                const { baseTitle } = extractBaseTitleAndCopyNumber(copiedWorkout.title);
                copiedWorkout.title = generateNewTitle(baseTitle, existingTitles);
                copiedWorkout.id = generateID();
            }
            return copiedWorkout;
        });

        // Add the copied workouts to the specified folder
        const updatedFolders = folders.map((folder: any) => {
            if (folder.id === folderId) {
                folder.workouts = [...folder.workouts, ...updatedCopiedWorkouts];
            }
            return folder;
        });

        // Update AsyncStorage with the new list of folders
        await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(updatedFolders));

        // Clear the copied workouts from AsyncStorage
        await AsyncStorage.removeItem(`copied_workouts_${email}`);

        console.log('Copied workouts pasted into folder');
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

const MAX_TITLE_LENGTH = 50;

// Helper function to generate a new title for a copied workout
const generateNewTitle = (baseTitle: string, existingTitles: string[]) => {

    const currentLanguage = i18next.language;

    let copyText = 'copy'

    if (currentLanguage === 'bg') {
        copyText = 'копие'
    }else if (currentLanguage === 'ru') {
        copyText = 'копия'
    }else if(currentLanguage === 'de') {
        copyText = 'Kopie'
    }else if(currentLanguage === 'fr') {
        copyText = 'copie'
    }else if(currentLanguage === 'es') {
        copyText = 'copia'
    }else if(currentLanguage === 'it') {
        copyText = 'copia'
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