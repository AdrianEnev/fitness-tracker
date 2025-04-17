import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../settings/get/useGetEmail";

// Could just be renamed to addFoodDaysLocally but since it has no other use it's kept like this for clarity
// Takes 1 or more missing food days and adds them to asyncstorage
const addRetrievedFoodDays = async (foodDaysArray: any[]) => {
    try {
        const email = await getEmail();
        if (!email) return;

        for (const foodDay of foodDaysArray) {
            const { id, data, foods } = foodDay;

            console.log(id)
            console.log(data)
            console.log(foods)
            console.log('---------')

            // id is in "YYYY-MM-DD"
            const [year, month, day] = id.split('-');
            // Remove leading zeros for compatibility with key format
            const d = String(Number(day));
            const m = String(Number(month));

            // Save foods array as the main foodDay key (to match previous format)
            await AsyncStorage.setItem(
                `${email}-foodDay-${d}-${m}-${year}`,
                JSON.stringify(foods)
            );
            
            // Optionally, save the summary object under a separate key
            /*await AsyncStorage.setItem(
                `${email}-foodDay-${d}-${m}-${year}-summary`,
                JSON.stringify(data)
            );*/
        }
        console.log('Retrieved food days saved locally');
    } catch (err) {
        console.error("Retrieve food days error", err);
    }
}

export default addRetrievedFoodDays;