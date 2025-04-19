import { FIREBASE_AUTH } from "@config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../settings/get/useGetEmail";
import { formatDate } from "../settings/change/useFormatDate";
import generateID from "../settings/add/useGenerateID";

const addFood = async (
    date: any,
    foodInfo: any,
    internetConnected: boolean,
    navigation: any,
    isCustomFood: boolean
) => {

    const email = await getEmail();

    // Add food to asyncstorage
    const foodDayKey = `${email}-foodDay-${date.day}-${date.month}-${date.year}`;

    const storedData = await AsyncStorage.getItem(foodDayKey);
    const data = storedData ? JSON.parse(storedData) : [];

    const formattedDate = formatDate(date); // Example format: 2024-11-15

    let newCalories = Number(String(foodInfo.calories).replace(',', '.'));
    newCalories = Math.ceil(newCalories);

    let newProtein = Number(String(foodInfo.protein).replace(',', '.'));
    newProtein = Math.ceil(newProtein);
    
    let newCarbs = Number(String(foodInfo.carbs).replace(',', '.'));
    newCarbs = Math.ceil(newCarbs);
    
    let newFat = Number(String(foodInfo.fat).replace(',', '.'));
    newFat = Math.ceil(newFat);
    
    const documentInfo = {
        id: generateID(),
        title: foodInfo.foodName,
        date: new Date().toISOString(),
        calories: newCalories,
        protein: newProtein,
        carbs: newCarbs,
        fat: newFat,
        grams: Math.round(foodInfo.grams),
    };

    data.push(documentInfo);
    await AsyncStorage.setItem(foodDayKey, JSON.stringify(data));

    // Calculate new total nutrients for the day, after the new food is added
    const newTotalNutrients = getNewTotalNutrients(data);

    // Update total nutrients for the day inside asyncstorage
    await AsyncStorage.setItem(`${email}-foodDay-${date.day}-${date.month}-${date.year}-nutrients`, JSON.stringify(newTotalNutrients));
    
    // If food was added from customFoodPage, navigate back once
    // If food was searched from searchFoodPage, navigate back twice to also close the search bar page
    if (isCustomFood) {
        navigation.goBack();
    }
    else {
        navigation.goBack();
        navigation.goBack();
    }

    if (!internetConnected) {
        return;
    }

    // add to firebase
    const userId = FIREBASE_AUTH.currentUser?.uid;
                
    try {
        const response = await fetch(`http://localhost:3000/api/foodDays/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                itemInfo: documentInfo,
                formattedDate: formattedDate
            }),
        });
        
        if (!response.ok) {
            console.error("addFoodDay: error:", response.statusText);
            return null;
        }

        // Update total nutrients for the day in firebase
        await updateCurrentNutrients(formattedDate, newTotalNutrients);

    } catch (error) {
        console.error("addFoodDay: error:", error);
        return null;
    }

} 

const getNewTotalNutrients = (data: any) => {
    
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    data.forEach((food: any) => {
        totalCalories += food.calories || 0;
        totalProtein += food.protein || 0;
        totalCarbs += food.carbs || 0;
        totalFat += food.fat || 0;
    });

    return {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
    };
};

const updateCurrentNutrients = async (formattedDate: string, newTotalNutrients: any) => {

    // Update inside database as well
    const userId = FIREBASE_AUTH.currentUser?.uid;
        
    try {
        const response = await fetch(`http://localhost:3000/api/foodDays/${userId}/${formattedDate}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                updatedNutrients: newTotalNutrients
            }),
        });
        if (!response.ok) {
            console.error("error updating nutrients: ", response.statusText);
            return null;
        }
    } catch (error) {
        console.error("error updating nutrients: ", error);
        return null;
    }

};

export default addFood;