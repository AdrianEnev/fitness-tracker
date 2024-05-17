import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import RenderGoalNutrients from './RenderGoalNutrients';
import RenderNutrients from './RenderNutrients';
//import { MaterialCommunityIcons } from '@expo/vector-icons';

const RenderGoals = (
    {goalNutrients, currentNutrients, navigation}: any
) => {

    
    const boxElement = (icon: any, title: string, currentValue: string, goalValue: string, background: string) => {
        return (
            <View style={tw`w-[49%] h-28 bg-${background} shadow-md rounded-xl`}>

                <View style={tw`flex flex-row gap-x-1 ml-1 mt-2`}>

                    <Ionicons name={icon} size={24} color='black' />

                    <View style={tw`mt-[-3px]`}>
                        <Text style={tw`text-lg`}>{title}</Text>
                    </View>

                </View>

                <View style={tw`flex-1 flex-row items-end ml-2 mb-1`}>
                    <Text style={tw`text-2xl`}>{currentValue}</Text>
                    <Text style={tw`text-sm`}>/{goalValue}</Text>
                </View>

            </View>
        );
    };


    const {t} = useTranslation();

    //caloriesGoal e object a currentCalories e array nqmam nikva ideq shto
    const caloriesGoal = parseInt(goalNutrients[0]?.calories, 10) || 0;
    const currentCalories = currentNutrients?.calories ?? 0;

    return (
        <View>

            <View style={tw`flex flex-row justify-between mt-3 mb-1`}>
                <Text style={tw`font-medium text-lg ml-3`}>{t('today')}</Text>
                <Text style={tw`font-medium text-base text-gray-500 mr-3 mt-1`} onPress={() => navigation.navigate('Настройки-Макронутриенти')}>Настройки {'>'}</Text>
            </View>
            
                
            <View style={tw`flex flex-row flex-wrap mx-1 gap-x-2 gap-y-2`}>

                {boxElement('flame-outline', t('calories'), currentCalories, caloriesGoal.toString() + " kcal", '[#cce5e2]')}

                {boxElement('footsteps-outline', t('steps'), '100', '2100 крачки', "[#fcebdb]")}

                {/* Makronutrienti */}
                <FlatList 
                    data={goalNutrients} 
                    renderItem={({item}) => <RenderNutrients item={item} currentNutrients={currentNutrients} />}  
                    scrollEnabled={false}
                />

            </View>

        </View>
    )
}

export default RenderGoals