import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../use/useGetEmail";
import { Workout } from "../../interfaces";
import generateID from "../use/useGenerateID";
import { deleteDoc, doc } from "firebase/firestore";

export const deleteSelectedWorkoutsInFolder = async (
    selectedWorkouts: any, folderId: string, setSelectedWorkouts: any, setSelectionMode: any,
    firebaseWorkouts: any, internetConnected: any, userWorkoutsCollectionRef: any
) => {
    try {
        const email = await getEmail();
        if (!email) return;

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
        //setFolders(updatedFolders);
        setSelectedWorkouts([]);
        setSelectionMode(false);
        console.log('Selected workouts deleted from folder');
    } catch (err) {
        console.error(err);
    }

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

export const cutSelectedWorkoutsInFolder = async (
    selectedWorkouts: any, folderId: string, setSelectedWorkouts: any, setSelectionMode: any,
    firebaseWorkouts: any, internetConnected: any, userWorkoutsCollectionRef: any
) => {
    try {
        const email = await getEmail();
        if (!email) return;

        // Store the selected workouts in a separate AsyncStorage item
        await AsyncStorage.setItem(`cut_workouts_${email}`, JSON.stringify(selectedWorkouts));
        console.log('Selected workouts cut from folder');

        // Delete the selected workouts from the folder
        await deleteSelectedWorkoutsInFolder(selectedWorkouts, folderId, setSelectedWorkouts, setSelectionMode, firebaseWorkouts, internetConnected, userWorkoutsCollectionRef);
    } catch (err) {
        console.error(err);
    }
};

export const pasteCutWorkoutsInFolder = async (folderId: string) => {
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

        // Update state
        //setFolders(updatedFolders);

        console.log('Cut workouts pasted into folder');
    } catch (err) {
        console.error(err);
    }
};

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

        // Update state
        //setFolders(updatedFolders);

        console.log('Copied workouts pasted into folder');
    } catch (err) {
        console.error(err);
    }
};

const extractBaseTitleAndCopyNumber = (title: string) => {
    const regex = /^(.*?)( copy(?: \((\d+)\))?)?$/;
    const match = title.match(regex);
    const baseTitle = match ? match[1] : title;
    const copyNumber = match && match[3] ? parseInt(match[3], 10) : (match && match[2] ? 1 : 0);
    return { baseTitle, copyNumber };
};

const generateNewTitle = (baseTitle: string, existingTitles: string[]) => {
    let maxCopyNumber = 0;
    existingTitles.forEach(title => {
        const { baseTitle: existingBaseTitle, copyNumber } = extractBaseTitleAndCopyNumber(title);
        if (existingBaseTitle === baseTitle && copyNumber > maxCopyNumber) {
            maxCopyNumber = copyNumber;
        }
    });
    return `${baseTitle} copy${maxCopyNumber > 0 ? ` (${maxCopyNumber + 1})` : ''}`;
};