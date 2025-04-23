import getEmail from "./useGetEmail";
import AsyncStorage from '@react-native-async-storage/async-storage';

const getGoalNutrientslocally = async () => {
    try {
        const key = `goal_nutrients_${await getEmail()}`;
        const localNutrients = await AsyncStorage.getItem(key);
        //console.log('Main.tsx: goal nutrients raw value from', key, ':', localNutrients);
        if (localNutrients) {
            try {
                const parsedLocalNutrients = JSON.parse(localNutrients);
                if (parsedLocalNutrients && typeof parsedLocalNutrients === 'object') {
                    return {
                        carbs: Number(parsedLocalNutrients.carbs) || 0,
                        protein: Number(parsedLocalNutrients.protein) || 0,
                        fat: Number(parsedLocalNutrients.fat) || 0,
                        calories: Number(parsedLocalNutrients.calories) || 0
                    };
                } else {
                    console.warn('Main.tsx: parsed goal nutrients missing expected properties:', parsedLocalNutrients);
                }
            } catch (parseError) {
                console.error('Main.tsx: error parsing goal nutrients:', parseError, localNutrients);
            }
        }
    } catch (error) {
        console.error('Error getting nutrients from AsyncStorage:', error);
    }
}

export default getGoalNutrientslocally