import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../settings/get/useGetEmail";

const deleteFood = async (
    item: any, formattedDate: any, userId: string, 
    internetConnected: boolean, date: any, navigation: any
) => {
    
    // Remove from asyncstorage
    await removeFromAsyncStorage(date, item);
    const updatedNutrients = await recalculateNutrientsAsyncStorage(date);
    navigation.goBack();

    if (!internetConnected) {
        return;
    }

    // Remove from firebase
    try {
        const response = await fetch(`http://localhost:3000/api/foodDays/${userId}/${formattedDate}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                item: item,
                updatedNutrients: updatedNutrients
            }),
        });
        if (!response.ok) {
            console.error("deleteFoodDay: error:", response.statusText);
            return null;
        }

    } catch (error) {
        console.error("deleteFoodDay: error:", error);
        return null;
    }
}

const removeFromAsyncStorage = async (date: any, food: any) => {

    // Delete from asyncstorage
    const email = await getEmail();
    const foodDayKey = `${email}-foodDay-${date.day}-${date.month}-${date.year}`;
    const foodDayKeyNutrients = `${email}-foodDay-${date.day}-${date.month}-${date.year}-nutrients`;
    
    // Retrieve stored data from AsyncStorage
    const storedData = await AsyncStorage.getItem(foodDayKey);
    const data = storedData ? JSON.parse(storedData) : [];

    // Filter out the food item to delete
    const updatedData = data.filter((item: any) => item.id !== food.id);

    if (updatedData.length === 0) {
        
        // If no items left, remove the entire foodDay entry
        await AsyncStorage.removeItem(foodDayKeyNutrients);
        await AsyncStorage.removeItem(foodDayKey);
        console.log(foodDayKeyNutrients);
        console.log(foodDayKey);
        
    } else {
        // Save the updated data back to AsyncStorage
        await AsyncStorage.setItem(foodDayKey, JSON.stringify(updatedData));
    }
}

const recalculateNutrientsAsyncStorage = async (date: any) => {

    const email = await getEmail();
    const foodDayKey = `${email}-foodDay-${date.day}-${date.month}-${date.year}`;
    const nutrientsKey = `${foodDayKey}-nutrients`;

    // Retrieve stored data from AsyncStorage
    const storedData = await AsyncStorage.getItem(foodDayKey);
    const data = storedData ? JSON.parse(storedData) : [];

    // Initialize nutrient totals
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    // Calculate total nutrients
    data.forEach((item: any) => {
        totalCalories += item.calories ?? 0;
        totalProtein += item.protein ?? 0;
        totalCarbs += item.carbs ?? 0;
        totalFat += item.fat ?? 0;
    });

    // Create nutrient object
    const nutrients = {
        calories: totalCalories,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
    };

    // Save the recalculated nutrients back to AsyncStorage
    await AsyncStorage.setItem(nutrientsKey, JSON.stringify(nutrients));

    return nutrients;
}

export default deleteFood;