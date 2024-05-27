import { View, Text, FlatList, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import RenderGoalNutrients from './RenderGoalNutrients';
import RenderNutrients from './RenderNutrients';
//import { MaterialCommunityIcons } from '@expo/vector-icons';
import singleBoxElement from './SingleBoxElement';
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

                <View style={tw`w-[49%] h-28 bg-[#ff6b6b] shadow-md rounded-2xl flex flex-col justify-between`}>
                    
                    <Pressable style={tw`flex flex-row gap-x-1 ml-1 mt-2`} onPress={() => navigation.navigate('Тренировки')}>

                        <Ionicons name='accessibility-outline' size={24} color='black' />

                        <View style={tw`mt-[-3px]`}>
                            <Text style={tw`text-lg`}>Тренировки</Text>
                        </View>

                    </Pressable>

                    <Pressable style={tw`flex flex-row gap-x-1 ml-1 mb-2`} onPress={() => navigation.navigate('Запазени-Тренировки')}>

                        <Ionicons name='accessibility-outline' size={24} color='black' />

                        <View style={tw`mt-[-3px]`}>
                            <Text style={tw`text-lg`}>Запазени тр.</Text>
                        </View>

                    </Pressable>

                </View>

                {singleBoxElement('egg-outline', 'Хранене', '', '', "[#ffffff]", () => navigation.navigate('Хранене'))} 

            </View>
                
            <View style={tw`flex flex-row mx-1 gap-x-2 mt-3`}>

                {/* Kalorii */}
                {singleBoxElement('flame-outline', t('calories'), currentCalories, "/" + caloriesGoal.toString() + " kcal", '[#4ecdc4]', () => {})} 

                 {/* Krachki */}
                {singleBoxElement('footsteps-outline', t('steps'), '0', '/10,000', "[#ffd166]", () => {})}

                
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