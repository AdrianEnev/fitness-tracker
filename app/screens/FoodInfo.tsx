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
        <View style={tw`h-full w-full bg-white`}>


            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('niggers-')}</Text>
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