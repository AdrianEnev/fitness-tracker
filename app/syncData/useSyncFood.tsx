import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../use/useGetEmail";
import { collection, doc, setDoc, deleteDoc, getDocs, writeBatch } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import generateID from "../use/useGenerateID";

const syncFood = async () => {

    const email = await getEmail();
    const foodDayKeyPrefix = `${email}-foodDay-`;

    try {
        // Get all food days from asyncstorage 
        const keys = await AsyncStorage.getAllKeys();
        const foodDayKeys = keys.filter(key => key.startsWith(foodDayKeyPrefix) && !key.endsWith('-nutrients'));

        const foodDays = await Promise.all(
            foodDayKeys.map(async key => {
                const data = await AsyncStorage.getItem(key);
                return { key, data: data ? JSON.parse(data) : null };
            })
        );

        // Create firebase instance
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const foodDaysCollectionRef = collection(userDocRef, 'food_days');  

        // Use a single batch for all operations
        const batch = writeBatch(FIRESTORE_DB);

        for (const { key, data } of foodDays) {
            // Extract the date and format it as YY-MM-DD with leading zeros
            const dateParts = key.split('-').slice(-3);
            const formattedDate = `${dateParts[2].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}-${dateParts[0]}`;

            const foodDayDocRef = doc(foodDaysCollectionRef, formattedDate);

            batch.set(foodDayDocRef, { title: formattedDate }, { merge: true });

            const foodsCollectionRef = collection(foodDayDocRef, 'foods');

            // Clear existing foods in the collection (cannot be done in batch)
            const existingFoods = await getDocs(foodsCollectionRef);
            existingFoods.docs.forEach(doc => batch.delete(doc.ref));

            let totalNutrients = { calories: 0, protein: 0, carbs: 0, fat: 0 };

            if (data) {
                data.forEach((foodItem: any) => {
                    const foodDocRef = doc(foodsCollectionRef, foodItem.id);
                    batch.set(foodDocRef, foodItem);

                    // Accumulate nutrients
                    totalNutrients.calories += foodItem.calories || 0;
                    totalNutrients.protein += foodItem.protein || 0;
                    totalNutrients.carbs += foodItem.carbs || 0;
                    totalNutrients.fat += foodItem.fat || 0;
                });
            }

            // Update the parent document with the total nutrients
            batch.set(foodDayDocRef, totalNutrients, { merge: true });
        }

        // Commit the batch
        await batch.commit();

    } catch (error) {
        console.error("Error syncing food data:", error);
    }
};

export default syncFood;
