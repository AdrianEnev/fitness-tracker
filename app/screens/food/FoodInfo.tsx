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

    const removeFood = async () => {

        const formattedDate = formatDate(unformattedDate);

        const userId = FIREBASE_AUTH.currentUser?.uid;
        if (!userId) return;

        await deleteFood(food, formattedDate, userId, internetConnected, formalDate, navigation); 

    }

    const navigation = useNavigation();

    return (
        <View style={tw`h-full w-full bg-white`}>
            <View style={tw`bg-gray-100 w-full h-[15%] flex justify-end`}>
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
            
            <BottomNavigationBar 
                currentPage='Food-Info' 
                navigation={navigation} 
                foodActions={{
                    deleteFood: removeFood
                }}
            />
        </View>
    )
}

export default FoodInfo