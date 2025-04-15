import getEmail from "@app/use/settings/get/useGetEmail";
import { FIREBASE_AUTH } from "@config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Deletes folder from asyncstorage and all workouts with its id from firebase
const deleteFolder = async (folder: any, navigation: any, internetConnected: boolean) => {

    try {
        const email = await getEmail();
        if (!email) return;

        const data = await AsyncStorage.getItem(`folders_${email}`);
        let folders = data ? JSON.parse(data) : [];

        folders = folders.filter((f: any) => f.id !== folder.id);

        await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(folders));
        navigation.goBack();
    } catch (err) {
        console.error(err);
    }

    // Delete workouts inside folder using already-created "deleteWorkouts" function by just passing foler.workouts
    if (internetConnected) {

        const userId = FIREBASE_AUTH.currentUser?.uid;

        try {
            const response = await fetch(`http://localhost:3000/api/workouts/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    workouts: folder.workouts
                }),
            });
            if (!response.ok) {
                console.error("response ERROR deleting folder", response);
                return null;
            }
        } catch (error) {
            console.error("ERROR deleting folder", error);
            return null;
        }
    }

}

export default deleteFolder;