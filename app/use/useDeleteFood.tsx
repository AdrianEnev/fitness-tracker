import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import { Food } from "../../interfaces";

const deleteFood = async (item: any, date: any) => {
    
    const timestamp = {"nanoseconds": 816000000, "seconds": 1719743541};
    const milliseconds = timestamp.seconds * 1000;
    const newDate = new Date(milliseconds);
    const day = newDate.getDate(); 
    const month = newDate.getMonth() + 1; 
    const year = newDate.getFullYear(); 
    const formattedDate = `${day}-${month}-${year}`;

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);

    const foodDaysCollectionRef = collection(userDocRef, 'food_days');
    const foodDayDocRef = doc(foodDaysCollectionRef, formattedDate);
    const foodDayCollectionRef = collection(foodDayDocRef, 'foods');
        
    try {

        const foodDocRef = doc(foodDayCollectionRef, item.id);
        await deleteDoc(foodDocRef);

        const data = await getDocs(foodDaysCollectionRef);
        const matchingDoc = data.docs.find((doc) => doc.id === formattedDate);

        if (matchingDoc) {
            
            try {
                const data = await getDocs(foodDayCollectionRef);
    
                if (data.empty) {
                    const updatedNutrients = {
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        fat: 0
                    };
        
                    await updateDoc(foodDayDocRef, updatedNutrients);
                }
    
                let totalCalories = 0;
                let totalProtein = 0;
                let totalCarbs = 0;
                let totalFat = 0;
    
                data.forEach((doc) => {
                    const food = doc.data() as Food;
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
    
                await updateDoc(foodDayDocRef, updatedNutrients);
                //updateCurrentNutrients();
            } catch (err) {
                console.error(err);
            }
        }
        
    } catch (err) {
        console.error(err);
    }
}

export default deleteFood;