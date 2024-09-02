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

const FoodInfo = ({route}: any) => {

    const {t} = useTranslation();

    const {food, date, unformattedDate} = route.params;

    const {internetConnected} = useContext(GlobalContext)

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

    const removeFood = async () => {
        try {

            console.log("removeFood function called");
            const email = await getEmail();
            console.log("Email retrieved:", email);
            const foodDayKey = `${email}-foodDay-${formalDate.day}-${formalDate.month}-${formalDate.year}`;
            const storedData = await AsyncStorage.getItem(foodDayKey);
            console.log("Stored data retrieved:", storedData);
            let data = storedData ? JSON.parse(storedData) : [];
    
            // Filter out the food item to be removed
            const filteredData = data.filter((item: any) => item.title !== food.title);
            console.log("Data after filtering:", filteredData);
    
            // Update the stored foods in AsyncStorage
            await AsyncStorage.setItem(foodDayKey, JSON.stringify(filteredData));
            console.log("Updated data stored in AsyncStorage");
    
            // Update the nutrients for the day
            const totalCalories = filteredData.reduce((sum: number, item: any) => sum + (item.calories || 0), 0);
            const totalProtein = filteredData.reduce((sum: number, item: any) => sum + (item.protein || 0), 0);
            const totalCarbs = filteredData.reduce((sum: number, item: any) => sum + (item.carbs || 0), 0);
            const totalFat = filteredData.reduce((sum: number, item: any) => sum + (item.fat || 0), 0);
    
            const updatedNutrients = {
                calories: totalCalories,
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat
            };
    
            await AsyncStorage.setItem(`${email}-foodDay-${formalDate.day}-${formalDate.month}-${formalDate.year}-nutrients`, JSON.stringify(updatedNutrients));
            console.log("Updated nutrients stored in AsyncStorage");

    
            // Navigate back to the previous screen
            navigation.goBack();
            console.log("Navigated back to the previous screen");
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
            
            <BottomNavigationBar currentPage='FoodInfo' navigation={navigation} deleteFood={removeFood} internetConnected={internetConnected}/>
        </View>
    )
}

export default FoodInfo