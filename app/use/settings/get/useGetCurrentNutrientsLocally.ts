import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "./useGetEmail";

const getCurrentNutrientsLocally = async (currentFormattedDate: any) => {
    try {
        const email = await getEmail();
        const storedData = await AsyncStorage.getItem(`${email}-foodDay-${currentFormattedDate.day}-${currentFormattedDate.month}-${currentFormattedDate.year}`);
        const data = storedData ? JSON.parse(storedData) : [];

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

        const updatedNutrients = {
            calories: totalCalories,
            protein: totalProtein,
            carbs: totalCarbs,
            fat: totalFat
        };

        return updatedNutrients;
    } catch (err) {
        console.error(err);
    }
}

export default getCurrentNutrientsLocally