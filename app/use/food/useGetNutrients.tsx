const fetchFoodData = async (search: any) => {

    console.log('Fetching food data...');

    try {
        const response = await fetch(`http://localhost:3000/api/models/searchFood?searchQuery=${search}`);

        if (!response.ok) {
            console.error("search food: error:", response.statusText);
            return null;
        }

        const data = await response.json();
        return data || [];
    } catch (error) {
        console.error("search food: error:", error);
        return null;
    }
};

const getNutrients = async (search: any, inputedGrams: any) => {

    if (inputedGrams == 0 || inputedGrams == null) {
        inputedGrams = 100;
    }
    

    try {
        const foodItems = await fetchFoodData(search);
        
        const seenTitles = new Set();
        const nutrients = foodItems
            .map((item: any) => {
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
            })
            .filter((nutrient: any) => {
                if (seenTitles.has(nutrient.title)) {
                    return false;
                } else {
                    seenTitles.add(nutrient.title);
                    return true;
                }
            });

        nutrients.sort((a: any, b: any) => a.title.length - b.title.length);

        return nutrients;
        
    } catch (error) {
        console.error('Error getting nutrients:', error);
        throw error; // Rethrow error to handle it outside
    }
};

export default getNutrients;