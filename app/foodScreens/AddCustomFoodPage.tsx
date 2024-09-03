import { View, Text, TouchableWithoutFeedback, Button, Keyboard, TextInput } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import getEmail from '../use/useGetEmail';

const AddCustomFoodPage = ({navigation, route}: any) => {

    const { t } = useTranslation();

    const { date } = route.params;

    const [name, setName] = useState("");
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);
    const [grams, setGrams] = useState(0);

    const updateCurrentNutrients = async () => {
        try {
            const email = await getEmail();
            const storedData = await AsyncStorage.getItem(`${email}-foodDay-${date.day}-${date.month}-${date.year}`);
            const data = storedData ? JSON.parse(storedData) : [];

            if (data.length === 0) {
                // foodDayCollectionRef is empty
                return;
            }

            let totalCalories = 0;
            let totalProtein = 0;
            let totalCarbs = 0;
            let totalFat = 0;

            data.forEach((food: any) => {
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

            await AsyncStorage.setItem(`${email}-foodDay-${date.day}-${date.month}-${date.year}-nutrients`, JSON.stringify(updatedNutrients));
        } catch (err) {
            console.error(err);
        }
    };

    const saveFood = async () => {
        if (!name) {
            return;
        }
    
        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${date.day}-${date.month}-${date.year}`;
        const storedData = await AsyncStorage.getItem(foodDayKey);
        const data = storedData ? JSON.parse(storedData) : [];
    
        const documentInfo = {
            title: name.trim(),
            date: new Date().toISOString(),
            calories: Math.round(calories),
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fat: Math.round(fat),
            grams: Math.round(grams)
        };
    
        data.push(documentInfo);
        await AsyncStorage.setItem(foodDayKey, JSON.stringify(data));
        console.log(`Data stored under key ${foodDayKey}:`, data); // Add this line
        updateCurrentNutrients();
        navigation.goBack();
    }

    const setNutrient = (value: any, nutrientType: any) => {
        switch (nutrientType) {
            case 'name':
                setName(value);
                break;
            case 'calories':
                setCalories(Number(value));
                break;
            case 'protein':
                setProtein(Number(value));
                break;
            case 'carbs':
                setCarbs(Number(value));
                break;
            case 'fat':
                setFat(Number(value));
                break;
            case 'grams':
                setGrams(Number(value));
                break;
            default:
                break;
        }
    }

    const box = (title: string, identifier: string) => (
        <View style={tw`w-[48%]`}>

            <Text style={tw`text-xl font-medium text-black ml-[6px] mb-1`}>{title}</Text>

            <TextInput 
                style={tw`w-full h-12 rounded-2xl bg-[#fd1c47] px-3 pb-2 text-white font-medium text-xl`} 
                keyboardType={title === t('food') ? 'default' : 'number-pad'} 
                maxLength={title === t('food') ? 40 : 5} 
                onChangeText={(text) => setNutrient(text, identifier)}
            />

        </View>
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw`flex-1 mx-3`}>

                    <View style={tw`flex-1 flex-row flex-wrap w-full gap-x-3 gap-y-3 mt-3`}>

                        {box(t('food'), 'name')}
                        {box(t('calories'), 'calories')}
                        {box(t('protein'), 'protein')}
                        {box(t('carbs'), 'carbs')}
                        {box(t('fat'), 'fat')}
                        {box(t('grams'), 'grams')}

                    </View>
                </View>

            </TouchableWithoutFeedback>

            <BottomNavigationBar 
                currentPage='AddCustomFood' 
                navigation={navigation} 
                foodDayDate={date}
                saveCustomFood={() => saveFood()}
            />
        </SafeAreaView>
    )
}

export default AddCustomFoodPage