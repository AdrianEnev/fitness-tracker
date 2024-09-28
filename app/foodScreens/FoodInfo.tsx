import { View, Text, Button } from 'react-native'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';
import GlobalContext from '../../GlobalContext';
import getEmail from '../use/useGetEmail';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';

const FoodInfo = ({route}: any) => {

    const {t} = useTranslation();

    const {food, date, unformattedDate} = route.params;
    // date = 14:48 (po nqkva prichina e vreme ama nqmam sega vreme da go opravq)

    const {internetConnected} = useContext(GlobalContext);

    const calories = food?.calories ?? 0;
    const protein = Number(food?.protein ?? 0).toFixed(0);
    const carbs = Number(food?.carbs ?? 0).toFixed(0);
    const fat = Number(food?.fat ?? 0).toFixed(0);

    const parsedDate = new Date(unformattedDate);
    const formalDate = {
        dateString: parsedDate.toISOString().split('T')[0],
        day: parsedDate.getDate(),
        month: parsedDate.getMonth() + 1,
        timestamp: parsedDate.getTime(),
        year: parsedDate.getFullYear()
    };

    const formatDate = (date: any) => {
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const removeFromAsyncStorage = async () => {
        // delete from asyncstorage
        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${formalDate.day}-${formalDate.month}-${formalDate.year}`;
        
        // Retrieve stored data from AsyncStorage
        const storedData = await AsyncStorage.getItem(foodDayKey);
        const data = storedData ? JSON.parse(storedData) : [];

        // Filter out the food item to delete
        const updatedData = data.filter((item: any) => item.id !== food.id);

        // Save the updated data back to AsyncStorage
        await AsyncStorage.setItem(foodDayKey, JSON.stringify(updatedData));
    }

    const removeFromFirebase = async (foodDayDocRef: any) => {
        
        // delete from firebase
        const foodDayFoodsCollectionRef = collection(foodDayDocRef, 'foods');

        // Delete food item from Firebase
        await deleteDoc(doc(foodDayFoodsCollectionRef, food.id));
        
    }

    const recalculateNutrientsFirebase = async (foodDayDocRef: any) => {

        // get proprties of foodDayDocRef (calories, carbs, fat, protein)
        // subtract the nutrients that are going to be deleted/were deleted from the properties of foodDayDocRef
        // set the properties of foodDayDocRef to the new values

        try {
            // Retrieve the current nutrient values from the foodDayDocRef
            const foodDayDocSnapshot = await getDoc(foodDayDocRef);
            if (!foodDayDocSnapshot.exists()) {
                console.error("Food day document does not exist.");
                return;
            }
    
            const foodDayData = foodDayDocSnapshot.data();
            let { calories, carbs, fat, protein } = foodDayData as { calories: number, carbs: number, fat: number, protein: number };
    
            // Subtract the nutrients of the food item that is being deleted
            calories -= food.calories ?? 0;
            carbs -= food.carbs ?? 0;
            fat -= food.fat ?? 0;
            protein -= food.protein ?? 0;
    
            // Update the foodDayDocRef with the new nutrient values
            await updateDoc(foodDayDocRef, {
                calories,
                carbs,
                fat,
                protein
            })
                
            //console.log("Nutrient values recalculated and updated in Firebase.");
        } catch (error) {
            console.error("Error recalculating nutrients in Firebase:", error);
        }
        
    }

    const recalculateNutrientsAsyncStorage = async () => {
        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${formalDate.day}-${formalDate.month}-${formalDate.year}`;
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
    }

    const removeFood = async () => {
        try {

            await removeFromAsyncStorage();
            recalculateNutrientsAsyncStorage();

            if (internetConnected) {
                const date = formatDate(formalDate);

                const usersCollectionRef = collection(FIRESTORE_DB, 'users');
                const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
                const foodDaysCollectionRef = collection(userDocRef, 'food_days');  
                const foodDayDocRef = doc(foodDaysCollectionRef, date);

                await removeFromFirebase(foodDayDocRef)
                recalculateNutrientsFirebase(foodDayDocRef);
            }
           
            navigation.goBack();
            
        } catch (err) {
            console.error("Error in removeFood function:", err);
        }
    }

    const navigation = useNavigation();

    return (
        <View style={tw`h-full w-full bg-white`}>
            

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('food-info')}</Text>
            </View>

            <View style={tw`mx-3 my-2`}>

                <Text style={tw`text-black text-2xl font-medium`}>{food.title}</Text>
                <Text style={tw`text-black text-xl font-medium`}>{date}ч.</Text>
                <Text>{calories} cals</Text>
                <Text>{protein} protein</Text>
                <Text>{carbs} carbs</Text>
                <Text>{fat} fat</Text>
                <Text>{food.grams} grams</Text>
                
            </View>
            
            <BottomNavigationBar currentPage='FoodInfo' navigation={navigation} deleteFood={removeFood}/>
        </View>
    )
}

export default FoodInfo