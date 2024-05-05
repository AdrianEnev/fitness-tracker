import axios from "axios";

const EDAMAM_APP_ID = '90e2036b';
const EDAMAM_APP_KEY = 'b1e82289782395cb48b50b4b11520754';

const fetchFoodData = async (search: any) => {
  try {
    const response = await axios.get(
      `https://api.edamam.com/api/food-database/v2/parser?ingr=${search}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`
    );
    return response.data.hints; // Return array of food items
  } catch (error) {
    console.error('Error fetching food data:', error);
    throw error; // Rethrow error to handle it outside
  }
};

const getNutrients = async (search: any, inputedGrams: any) => {

    if (inputedGrams == 0 || inputedGrams == null) {
        inputedGrams = 100;
    }

    try {
        const foodItems = await fetchFoodData(search);
        
        // Map through each food item and extract nutrient information
        const nutrients = foodItems.map((item: any) => {
            const food = item.food;
            const calories = (food.nutrients.ENERC_KCAL / 100) * inputedGrams;
            const protein = (food.nutrients.PROCNT / 100) * inputedGrams;
            const carbs = (food.nutrients.CHOCDF / 100) * inputedGrams;
            const fat = (food.nutrients.FAT / 100) * inputedGrams;
      
            return {
              title: food.label,
              calories: calories,
              protein: protein,
              carbs: carbs,
              fat: fat,
              grams: inputedGrams
            };
          });

        return nutrients;
    } catch (error) {
        console.error('Error getting nutrients:', error);
        throw error; // Rethrow error to handle it outside
    }
};

export default getNutrients;
