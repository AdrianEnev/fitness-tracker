// Function to scan image nutrients based on a barcode and date
const checkImageNutrients = async (barcode: any, date: any) => {
    
    console.log("Barcode:", barcode);
    console.log("Date:", date);
    
    try {
        // Step 1: Lookup the product info based on the barcode
        const productInfo = await getProductInfo(barcode);

        // Step 2: Get the product name or description
        const productName = productInfo.product_name || productInfo.generic_name;

        // Step 3: Fetch nutritional info from Edamam using the product name
        const nutritionData = await getNutritionalInfoFromEdamam(productName);

        if (nutritionData) {
            console.log('Nutritional Information:', nutritionData);
        } else {
            console.log('No nutritional data available from Edamam');
        }
    } catch (error) {
        console.error('Error:', error);
    }
    
}

// Function to get product information from Open Food Facts based on the barcode
async function getProductInfo(barcode: string) {
    const url = `https://world.openfoodfacts.org/api/v0/product/${123456789012}.json`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 1) {
        return data.product; // Contains product details like name, brand, etc.
    } else {
        throw new Error("Product not found in Open Food Facts.");
    }
}

// Function to get nutritional information from Edamam based on the product name
async function getNutritionalInfoFromEdamam(productName: string): Promise<any> {
    const EDAMAM_APP_ID = '90e2036b';
    const EDAMAM_APP_KEY = 'b1e82289782395cb48b50b4b11520754';
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&ingr=${encodeURIComponent(productName)}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.hints && data.hints.length > 0) {
            return data.hints[0].food; // Nutritional info of the first match
        } else {
            throw new Error('No nutritional data found.');
        }
    } catch (error) {
        console.error('Error fetching data from Edamam:', error);
        return null;
    }
}

export default checkImageNutrients;
