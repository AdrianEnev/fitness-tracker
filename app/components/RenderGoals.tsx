import { View, Text, FlatList, Pressable, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
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
    
    const [workoutContainerHeight, setWorkoutContainerHeight] = useState('h-11');
    const expandWorkoutContainer = () => { 
        setWorkoutContainerHeight(prevHeight => prevHeight === 'h-11' ? 'h-28' : 'h-11');
    }

    const [foodContainerHeight, setFoodContainerHeight] = useState('h-11');
    const expandFoodContainer = () => { 
        setFoodContainerHeight(prevHeight => prevHeight === 'h-11' ? 'h-28' : 'h-11');
    }

    return (
        <View>

            <View style={tw`flex flex-row mx-1 gap-x-2 mt-5`}>

                <View style={tw`${workoutContainerHeight} w-[49%] bg-[#ff6b6b] shadow-lg rounded-2xl flex flex-col justify-between`}>
                    
                    <Pressable style={tw`flex flex-row gap-x-1 ml-2 mt-2`} onPress={expandWorkoutContainer}>

                        <View style={tw`flex flex-row justify-between w-full`}>
                            <View style={tw`flex flex-row`}>
                                <Ionicons name='accessibility-outline' size={24} color='black' />

                                <View style={tw`mt-[-3px] ml-1`}>
                                    <Text style={tw`text-lg`}>Тренировки</Text>
                                </View>
                            </View>

                            <View style={tw`mr-1`}>
                                {workoutContainerHeight === 'h-11' ? 
                                    <Ionicons name='chevron-forward-outline' size={28} color='black'/> :
                                    <Ionicons name='chevron-down-outline' size={28} color='black'/>
                                }
                            </View>
                        </View>

                        

                    </Pressable>

                    {workoutContainerHeight === 'h-28' && (
                        <View style={tw`mb-2 ml-1`}>
                            <Pressable style={tw`flex flex-row ml-1`} onPress={() => navigation.navigate('Тренировки')}>

                                <Ionicons name='list-outline' size={21} color='black' />

                                <View style={tw`mt-[-3px] ml-1 mb-3`}>
                                    <Text style={tw`text-base`}>Програми</Text>
                                </View>

                            </Pressable>

                            <Pressable style={tw`flex flex-row ml-1`} onPress={() => navigation.navigate('Запазени-Тренировки')}>

                                <Ionicons name='bookmark-outline' size={21} color='black' />

                                <View style={tw`mt-[-3px] ml-1`}>
                                    <Text style={tw`text-base`}>Запазени</Text>
                                </View>

                            </Pressable>
                        </View>
                    )}

                </View>

                {/* --------------------------------------------------------------------------------------- */}

                <View style={tw`${foodContainerHeight} w-[49%] bg-white shadow-lg rounded-2xl flex flex-col justify-between`}>
                    
                    <Pressable style={tw`flex flex-row gap-x-1 ml-2 mt-2`} onPress={expandFoodContainer}>

                        <View style={tw`flex flex-row justify-between w-full`}>
                            <View style={tw`flex flex-row`}>
                                <Ionicons name='egg-outline' size={24} color='black' />

                                <View style={tw`mt-[-3px] ml-1`}>
                                    <Text style={tw`text-lg`}>Хранене</Text>
                                </View>
                            </View>

                            <View style={tw`mr-1`}>
                                {foodContainerHeight === 'h-11' ? 
                                    <Ionicons name='chevron-forward-outline' size={28} color='black'/> :
                                    <Ionicons name='chevron-down-outline' size={28} color='black'/>
                                }
                            </View>
                        </View>

                        

                    </Pressable>

                    {foodContainerHeight === 'h-28' && (
                        <View style={tw`mb-2 ml-1`}>
                            <Pressable style={tw`flex flex-row ml-1`} onPress={() => navigation.navigate('Хранене')}>

                                <Ionicons name='calendar-clear-outline' size={21} color='black' />

                                <View style={tw`mt-[-3px] ml-1 mb-3`}>
                                    <Text style={tw`text-base`}>Календар</Text>
                                </View>

                            </Pressable>

                            <Pressable style={tw`flex flex-row ml-1`} onPress={() => {
                                const date = new Date();
                                const dateString = date.toISOString().split('T')[0];
                                const day = date.getDate();
                                const month = date.getMonth() + 1; // JavaScript months are 0-indexed
                                const timestamp = date.getTime();
                                const year = date.getFullYear();

                                navigation.navigate('Хранене-Ден', {
                                    date: {
                                        dateString,
                                        day,
                                        month,
                                        timestamp,
                                        year
                                    }
                                });
                            }}>
                                <Ionicons name='sunny-outline' size={21} color='black' />
                                <View style={tw`mt-[-3px] ml-1`}>
                                    <Text style={tw`text-base`}>Днес</Text>
                                </View>
                            </Pressable>
                        </View>
                    )}

                </View>

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