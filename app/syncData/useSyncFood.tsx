import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc, deleteDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from "../use/useGetEmail";

type FoodItem = {
    id: string;
    date: string;
    title: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    // Add other properties if necessary
};

const syncFood = async () => {
    try {
        const email = await getEmail();
        if (!email) return;

        // Retrieve all keys from AsyncStorage
        const keys = await AsyncStorage.getAllKeys();
        const foodDayKeys = keys.filter(key => key.includes(`${email}-foodDay-`));

        // Retrieve food items from AsyncStorage
        const foodItems = await AsyncStorage.multiGet(foodDayKeys);
        const asyncStorageFoods = foodItems
            .filter(([key, value]) => !key.includes('nutrients'))
            .map(([key, value]) => JSON.parse(value || '[]'));

        // Flatten the array of arrays
        const flatAsyncStorageFoods = asyncStorageFoods.flat();

        // Retrieve food items from Firebase
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const userDaysCollectionRef = collection(userDocRef, 'food_days');
        const userDaysSnapshot = await getDocs(userDaysCollectionRef);

        const firebaseDays = userDaysSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            calories: doc.data().calories, 
            protein: doc.data().protein || 0, 
            carbs: doc.data().carbs || 0, 
            fat: doc.data().fat || 0 
        }));

        // Flag to track if any changes were made
        let changesMade = false;

        // Compare and add missing items to Firebase
        for (const food of flatAsyncStorageFoods) {
            const foodDate = new Date(food.date).toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
            let dayDocRef = firebaseDays.find(day => day.id === foodDate);

            if (!dayDocRef) {
                // Create a new day document if it doesn't exist
                await setDoc(doc(userDaysCollectionRef, foodDate), {
                    date: foodDate,
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    fat: 0,
                    timestamp: serverTimestamp()
                });
                // Add the new day document to firebaseDays
                dayDocRef = { id: foodDate, calories: 0, protein: 0, carbs: 0, fat: 0 };
                firebaseDays.push(dayDocRef);
                changesMade = true;
            }

            const dayFoodsCollectionRef = collection(userDaysCollectionRef, foodDate, 'foods');
            const dayFoodsSnapshot = await getDocs(dayFoodsCollectionRef);
            const firebaseFoods = dayFoodsSnapshot.docs.map(doc => doc.data());

            const existsInFirebase = firebaseFoods.some(fbFood => fbFood.date === food.date && fbFood.title === food.title);
            if (!existsInFirebase) {
                await addDoc(dayFoodsCollectionRef, {
                    ...food,
                    timestamp: serverTimestamp()
                });

                // Update the day's nutrient counts
                const newCalories = (dayDocRef.calories || 0) + food.calories;
                const newProtein = (dayDocRef.protein || 0) + food.protein;
                const newCarbs = (dayDocRef.carbs || 0) + food.carbs;
                const newFat = (dayDocRef.fat || 0) + food.fat;
                await setDoc(doc(userDaysCollectionRef, foodDate), {
                    calories: newCalories,
                    protein: newProtein,
                    carbs: newCarbs,
                    fat: newFat
                }, { merge: true });
                changesMade = true;
            }
        }

        // Handle deletion of foods
        for (const day of firebaseDays) {
            const dayFoodsCollectionRef = collection(userDaysCollectionRef, day.id, 'foods');
            const dayFoodsSnapshot = await getDocs(dayFoodsCollectionRef);
            const firebaseFoods: FoodItem[] = dayFoodsSnapshot.docs.map(doc => ({
                ...doc.data() as FoodItem, // Type assertion to ensure the correct structure
                id: doc.id // Ensure the id is set correctly
            }));
            
            for (const fbFood of firebaseFoods) {
                const existsInAsyncStorage = flatAsyncStorageFoods.some(food => food.date === fbFood.date && food.title === fbFood.title);
                if (!existsInAsyncStorage) {
                    await deleteDoc(doc(dayFoodsCollectionRef, fbFood.id));
                
                    // Update the day's nutrient counts
                    const newCalories = day.calories - fbFood.calories;
                    const newProtein = (day.protein || 0) - fbFood.protein;
                    const newCarbs = (day.carbs || 0) - fbFood.carbs;
                    const newFat = (day.fat || 0) - fbFood.fat;
                    await setDoc(doc(userDaysCollectionRef, day.id), {
                        calories: newCalories,
                        protein: newProtein,
                        carbs: newCarbs,
                        fat: newFat
                    }, { merge: true });
                    changesMade = true;
                }
            }
        }

        if (changesMade) {
            console.log('Sync complete');
        }
    } catch (err) {
        console.error('Error syncing food items:', err);
    }
}

export default syncFood;