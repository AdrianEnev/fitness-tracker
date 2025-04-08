import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigationBar from '@components/BottomNavigationBar';
import { useNavigation } from '@react-navigation/native';
import tw from 'twrnc';
import GlobalContext from '@config/GlobalContext';
import getEmail from '@use/settings/get/useGetEmail';
import { FIREBASE_AUTH } from '@config/firebaseConfig';
import FoodInfoNutrients from '@components/food/FoodInfoNutrients';
import deleteFood from '@use/food/useDeleteFood';

const FoodInfo = ({route}: any) => {

    const {t} = useTranslation();

    const {food, unformattedDate} = route.params;

    const {internetConnected} = useContext(GlobalContext);

    const calories = food?.calories ?? 0;
    const protein = Number(food?.protein ?? 0).toFixed(0);
    const carbs = Number(food?.carbs ?? 0).toFixed(0);
    const fat = Number(food?.fat ?? 0).toFixed(0);
    const grams = Number(food?.grams ?? 0).toFixed(0);

    const parsedDate = new Date(unformattedDate.timestamp);
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

        // Delete from asyncstorage
        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${formalDate.day}-${formalDate.month}-${formalDate.year}`;
        const foodDayKeyNutrients = `${email}-foodDay-${formalDate.day}-${formalDate.month}-${formalDate.year}-nutrients`;
        
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

        return nutrients;
    }

    const removeFood = async () => {
        

        // Remove item from asyncstorage then recalculate the total nutrients for the whole day
        await removeFromAsyncStorage();
        const updatedNutrients = await recalculateNutrientsAsyncStorage();

        // Navigate back and execute firebase deletion in the background
        navigation.goBack();

        const formattedDate = formatDate(unformattedDate);

        if (internetConnected){

            const userId = FIREBASE_AUTH.currentUser?.uid;
            if (!userId) return;

            const item = food;

            await deleteFood(item, formattedDate, updatedNutrients, userId); 
        }

    }

    const navigation = useNavigation();

    return (
        <View style={tw`h-full w-full bg-white`}>
            

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('macronutrients')}</Text>
            </View>

            <FoodInfoNutrients
                calories={calories}
                protein={protein}
                carbs={carbs}
                fat={fat}
                formalDate={formalDate}
                food={food}
                grams={grams}
            />
            
            <BottomNavigationBar currentPage='FoodInfo' navigation={navigation} deleteFood={removeFood}/>
        </View>
    )
}

export default FoodInfo