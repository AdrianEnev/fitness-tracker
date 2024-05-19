import { View, Text, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import RenderGoalNutrients from './RenderGoalNutrients';
import RenderNutrients from './RenderNutrients';
//import { MaterialCommunityIcons } from '@expo/vector-icons';
import boxElement from './GoalsBoxElement';
import getCurrentDate from '../use/useGetCurrentDate';

const RenderGoals = (
    {goalNutrients, currentNutrients, navigation}: any
) => {


    const {t} = useTranslation();

    //caloriesGoal e object a currentCalories e array nqmam nikva ideq shto
    const caloriesGoal = parseInt(goalNutrients[0]?.calories, 10) || 0;
    const currentCalories = currentNutrients?.calories ?? 0;

    return (
        <View>

            <View style={tw`flex flex-row mx-1 gap-x-2 mt-7`}>

                {boxElement('accessibility-outline', 'Тренировки', '', '', "[#ff6b6b]", () => navigation.navigate('Тренировки'))} 

                {boxElement('egg-outline', 'Хранене', '', '', "[#ffffff]", () => navigation.navigate('Хранене'))} 

            </View>
                
            <View style={tw`flex flex-row mx-1 gap-x-2 mt-3`}>

                {/* Kalorii */}
                {boxElement('flame-outline', t('calories'), currentCalories, "/" + caloriesGoal.toString() + " kcal", '[#4ecdc4]', () => {})} 

                 {/* Krachki */}
                {boxElement('footsteps-outline', t('steps'), '5,000', '/10,000', "[#ffd166]", () => {})}

                
            </View>

            {/* Makronutrienti */}
            <View style={tw`w-[98%] h-62 bg-white mt-3 mx-1 shadow-md rounded-2xl`}>
                <FlatList 
                    data={goalNutrients} 
                    renderItem={({item}) => <RenderNutrients item={item} currentNutrients={currentNutrients} date={getCurrentDate(true)}/>}  
                    scrollEnabled={false}
                />
            </View>

        </View>
    )
}

export default RenderGoals