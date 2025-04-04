import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

const syncNutrients = async () => {
    
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const nutrientsDocRef = doc(userInfoCollectionRef, 'nutrients');

    // Check if the nutrients document exists
    const nutrientsDocSnapshot = await getDoc(nutrientsDocRef);
    const remoteNutrients = nutrientsDocSnapshot.exists() ? nutrientsDocSnapshot.data() : null;

    // Retrieve local nutrients
    const localNutrients = await AsyncStorage.getItem(`goal_nutrients_${FIREBASE_AUTH.currentUser?.email}`);
    let parsedLocalNutrients = null;
    try {
        parsedLocalNutrients = localNutrients ? JSON.parse(localNutrients) : null;
    } catch (error) {
        console.error('Error parsing local nutrients:', error);
    }

    // Function to sort JSON object properties
    const sortObject = (obj: { [key: string]: any }) => {
        return Object.keys(obj).sort().reduce((result, key) => {
            result[key as keyof typeof result] = obj[key];
            return result;
        }, {} as { [key: string]: any });
    };

    // Compare local and remote nutrients
    if (parsedLocalNutrients && (!remoteNutrients || JSON.stringify(sortObject(parsedLocalNutrients)) !== JSON.stringify(sortObject(remoteNutrients)))) {
        // Sync local nutrients to Firestore
        await setDoc(nutrientsDocRef, parsedLocalNutrients, { merge: true });
        //console.log('Nutrients synced');
    } else {
        //console.log('No nutrients to sync');
    }
};

export default syncNutrients;