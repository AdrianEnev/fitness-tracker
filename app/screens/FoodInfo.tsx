import { View, Text } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';
import deleteFood from '../use/useDeleteFood';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import tw from 'twrnc';

const FoodInfo = ({route}: any) => {

    const {t} = useTranslation();

    const {food, date, unformattedDate} = route.params;

    const calories = food?.calories ?? 0;
    const protein = Number(food?.protein ?? 0).toFixed(0);
    const carbs = Number(food?.carbs ?? 0).toFixed(0);
    const fat = Number(food?.fat ?? 0).toFixed(0);

    const removeFood = async () => {

        await deleteFood(food, unformattedDate);
        navigation.goBack();
    }

    const navigation = useNavigation();

    return (
        <SafeAreaView style={tw`h-full w-full bg-white`}>
            <Text style={tw`text-black text-2xl font-medium`}>{food.title}</Text>
            <Text style={tw`text-black text-xl font-medium`}>{date}ч.</Text>
            <Text>{calories} fat</Text>
            <Text>{protein} fat</Text>
            <Text>{carbs} fat</Text>
            <Text>{fat} fat</Text>
            <Text>{food.grams} grams</Text>
            


            <BottomNavigationBar currentPage='FoodInfo' navigation={navigation} deleteFood={removeFood}/>
        </SafeAreaView>
    )
}

export default FoodInfo