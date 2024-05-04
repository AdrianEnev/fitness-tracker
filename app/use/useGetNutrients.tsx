const getNutrients = async (search: any, inputedGrams: any) => {
   
    const randomCalories = Math.floor(Math.random() * 500); 
    const randomProtein = Math.random() * 50; 
    const randomCarbs = Math.random() * 100; 
    const randomFat = Math.random() * 50; 

    // Create a mock response object
    const mockResponse = {
        title: search,
        calories: randomCalories,
        protein: randomProtein,
        carbs: randomCarbs,
        fat: randomFat,
        grams: inputedGrams
    };

    // Return the mock response
    return [mockResponse];
}

export default getNutrients;
