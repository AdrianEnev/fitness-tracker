import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import getCurrentDate from '../use/useGetCurrentDate';

// react.memo se izpolzva za da ne se rendervat komponenti osven ako neshto ne se e promenilo
const RenderNutrients = React.memo(({item, currentNutrients}: any) => {

    const { t } = useTranslation();

    const caloriesGoal = Number(item?.calories ?? 0);
    const currentCalories = Number(currentNutrients?.calories ?? 0).toFixed(0);
    const caloriesProgress = Math.min(Number(currentCalories) / caloriesGoal, 1);

    const proteinGoal = Number(item?.protein ?? 0);
    const currentProtein = Number(currentNutrients?.protein ?? 0).toFixed(0);
    const proteinProgress = Math.min(Number(currentProtein) / proteinGoal, 1);

    const carbsGoal = Number(item?.carbs ?? 0);
    const currentCarbs = Number(currentNutrients?.carbs ?? 0).toFixed(0);
    const carbsProgress = Math.min(Number(currentCarbs) / carbsGoal, 1);

    const fatGoal = Number(item?.fat ?? 0);
    const currentFat = Number(currentNutrients?.fat ?? 0).toFixed(0);
    const fatProgress = Math.min(Number(currentFat) / fatGoal, 1);

    const stepsGoal = 10000;
    const currentSteps = 5000;
    const stepsProgress = Math.min(currentSteps / stepsGoal, 1);

    // da dobavq margin-top na krugchetata samo ako progresa e minal sredata

    const nutrientBox = (progress: any, title: any, currentAmount: any) => {
        const isLowProgress = progress < 0.05; // adjust this threshold as needed
        return (
            <View style={tw`flex flex-col`}>
                <View style={tw`h-40 w-14 bg-gray-200 rounded-full justify-end`}>
                    <View style={tw`h-${progress*40} w-14 bg-[#4ecdc4] rounded-full flex items-center ${isLowProgress ? 'justify-end' : 'justify-start'}`}>
                        <View style={tw`bg-white w-12 h-12 rounded-full flex items-center justify-center ${isLowProgress ? 'mb-1' : 'mt-1'}`}>
                            <Text>{currentAmount}</Text>
                        </View>
                    </View>
                </View>
                <Text style={tw`text-lg ml-3`}>{title}</Text>
            </View>
        );
    }
    
    return (
        <View>
            
            <View style={tw`flex flex-row justify-between`}>
                <Text style={tw`text-lg font-medium m-2 ml-3`}>{t('today')}</Text>
                <Text style={tw`text-lg font-medium m-2 mr-3`}>{getCurrentDate(true)}</Text>
            </View>
            

            <View style={tw`flex items-center`}>
                <View style={tw`flex flex-row gap-x-[24px] ml-1`}>

                    {nutrientBox(caloriesProgress, 'Кал.', currentCalories)}
                    {nutrientBox(proteinProgress, 'Прот.', currentProtein)}
                    {nutrientBox(carbsProgress, 'Въг.', currentCarbs)}
                    {nutrientBox(fatProgress, 'Мазн.', currentFat)}
                    {nutrientBox(stepsProgress, 'Крач.', currentSteps)}
                        
                </View>
            </View>

        </View>
    )
});

export default RenderNutrients