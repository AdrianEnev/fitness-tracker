import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '@use/settings/get/useGetEmail';

export const checkWorkoutsCountFolder = async (folderId: string) => {
    try {
        const email = await getEmail();
        if (!email) return false;

        const data = await AsyncStorage.getItem(`folders_${email}`);
        const folders = data ? JSON.parse(data) : [];

        const folder = folders.find((f: any) => f.id === folderId);
        if (folder && folder.workouts.length === 9) {
            return true;
        }
    } catch (err) {
        console.error('Error checking workouts count in folder:', err);
    }

    return false;
};
export const checkWorkoutsCountTotal = async () => {
    try {
        const email = await getEmail();
        if (!email) return false;

        const data = await AsyncStorage.getItem(`workouts_${email}`);
        const foldersData = await AsyncStorage.getItem(`folders_${email}`);
        const workouts = data ? JSON.parse(data) : [];
        const folders = foldersData ? JSON.parse(foldersData) : [];

        let totalWorkouts = workouts.length;
        folders.forEach((folder: any) => {
            totalWorkouts += folder.workouts.length;
        });

        return totalWorkouts >= 30;
    } catch (err) {
        console.error('Error checking total workouts count:', err);
        return false;
    }
};