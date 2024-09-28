import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../use/useGetEmail";
import { collection, doc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import generateID from "../use/useGenerateID";

const syncFood = async () => {

    /*
    
    All food items: [["enevadrian@gmail.com-foodDay-27-9-2024-nutrients", "{\"calories\":4,\"protein\":4,\"carbs\":4,\"fat\":4}"], ["enevadrian@gmail.com-foodDay-25-9-2024", "[{\"id\":\"s3iez1c48j8123mc5k298e\",\"title\":\"S\",\"date\":\"2024-09-28T12:30:43.533Z\",\"calories\":4,\"protein\":4,\"carbs\":4,\"fat\":4,\"grams\":0,\"timestamp\":{\"_methodName\":\"serverTimestamp\"}},{\"id\":\"wxeyl0yftfolvrjphtkf\",\"title\":\"S\",\"date\":\"2024-09-28T12:30:47.797Z\",\"calories\":4,\"protein\":4,\"carbs\":4,\"fat\":4,\"grams\":4,\"timestamp\":{\"_methodName\":\"serverTimestamp\"}}]"], ["enevadrian@gmail.com-foodDay-27-9-2024", "[{\"id\":\"56zb875ljsb2btc5hy8cym\",\"title\":\"Sf\",\"date\":\"2024-09-28T12:30:31.322Z\",\"calories\":4,\"protein\":4,\"carbs\":4,\"fat\":4,\"grams\":4,\"timestamp\":{\"_methodName\":\"serverTimestamp\"}}]"], ["enevadrian@gmail.com-foodDay-28-9-2024", "[{\"id\":\"1ad8qrm4l2m6mgwwslg1xq\",\"title\":\"Sx\",\"date\":\"2024-09-28T12:24:41.357Z\",\"calories\":4,\"protein\":4,\"carbs\":4,\"fat\":4,\"grams\":4,\"timestamp\":{\"_methodName\":\"serverTimestamp\"}},{\"id\":\"30fwd4wd48pazglvcw7oy\",\"title\":\"Ss\",\"date\":\"2024-09-28T12:24:45.573Z\",\"calories\":4,\"protein\":4,\"carbs\":4,\"fat\":4,\"grams\":4,\"timestamp\":{\"_methodName\":\"serverTimestamp\"}},{\"id\":\"dgoiotapgxwqyjhy4q53m\",\"title\":\"Sf\",\"date\":\"2024-09-28T12:24:50.804Z\",\"calories\":4,\"protein\":4,\"carbs\":4,\"fat\":5,\"grams\":5,\"timestamp\":{\"_methodName\":\"serverTimestamp\"}}]"], ["enevadrian@gmail.com-foodDay-28-9-2024-nutrients", "{\"calories\":12,\"protein\":12,\"carbs\":12,\"fat\":13}"], ["enevadrian@gmail.com-foodDay-25-9-2024-nutrients", "{\"calories\":8,\"protein\":8,\"carbs\":8,\"fat\":8}"], ["enevadrian@gmail.com-foodDay-17-9-2024-nutrients", "{}"]]

    */

    /*
     
    const foodDayDocRef = doc(foodDaysCollectionRef, date);
    const foodDayFoodsCollectionRef = collection(foodDayDocRef, 'foods');
     
    */

    const email = await getEmail();
    const foodDayKeyPrefix = `${email}-foodDay-`;

    try {
        // Get all food days from asyncstorage 
        //Example:  [{"data": [[Object], [Object]], "key": "enevadrian@gmail.com-foodDay-25-9-2024"}, {"data": [[Object]], "key": "enevadrian@gmail.com-foodDay-27-9-2024"}, {"data": [[Object], [Object], [Object]], "key": "enevadrian@gmail.com-foodDay-28-9-2024"}]
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
        
        // Add or update a document for each food day and add a "foods" collection inside each document
        await Promise.all(
            foodDays.map(async ({ key, data }) => {
                // Extract the date and format it as YY-MM-DD with leading zeros
                const dateParts = key.split('-').slice(-3);
                const formattedDate = `${dateParts[2].padStart(2, '0')}-${dateParts[1].padStart(2, '0')}-${dateParts[0]}`;

                const foodDayDocRef = doc(foodDaysCollectionRef, formattedDate);

                await setDoc(foodDayDocRef, { title: formattedDate }, { merge: true });

                const foodsCollectionRef = collection(foodDayDocRef, 'foods');

                // Clear existing foods in the collection
                const existingFoods = await getDocs(foodsCollectionRef);
                await Promise.all(existingFoods.docs.map(doc => deleteDoc(doc.ref)));

                let totalNutrients = { calories: 0, protein: 0, carbs: 0, fat: 0 };

                if (data) {
                    await Promise.all(
                        data.map(async (foodItem: any, index: any) => {
                            const foodDocRef = doc(foodsCollectionRef, generateID());
                            await setDoc(foodDocRef, foodItem);

                            // Accumulate nutrients
                            totalNutrients.calories += foodItem.calories || 0;
                            totalNutrients.protein += foodItem.protein || 0;
                            totalNutrients.carbs += foodItem.carbs || 0;
                            totalNutrients.fat += foodItem.fat || 0;
                        })
                    );
                }

                // Update the parent document with the total nutrients
                await setDoc(foodDayDocRef, totalNutrients, { merge: true });
            })
        );

    } catch (error) {
        console.error("Error fetching food days from AsyncStorage:", error);
    }

}

export default syncFood;