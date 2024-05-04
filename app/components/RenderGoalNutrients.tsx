import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';

const RenderGoalNutrients = ({item, currentNutrients}: any) => {

    const { t } = useTranslation();

    const caloriesGoal = item?.calories ?? 0;
    const currentCalories = currentNutrients?.calories ?? 0;

    const proteinGoal = Number(item?.protein ?? 0);
    const currentProtein = Number(currentNutrients?.protein ?? 0).toFixed(0);
    const proteinFillPercentage = (Number(currentProtein) / proteinGoal) * 100;

    const carbsGoal = Number(item?.carbs ?? 0);
    const currentCarbs = Number(currentNutrients?.carbs ?? 0).toFixed(0);
    const carbsFillPercentage = (Number(currentCarbs) / carbsGoal) * 100;

    const fatGoal = Number(item?.fat ?? 0);
    const currentFat = Number(currentNutrients?.fat ?? 0).toFixed(0);
    const fatFillPercentage = (Number(currentFat) / fatGoal) * 100;

    // da probvam da promenq cveta na currentCalories ako sa poveche ot caloriesGoal
    
    return (
        <View style={tw`flex items-center mt-2 mb-2`}>
            <View style={tw`w-[95%] h-54 bg-white shadow-md rounded-lg`}>

                <View style={tw`flex flex-row justify-between mb-2`}>
                    <Text style={tw`font-medium text-2xl m-2`}>{t('calories')}</Text>
                    <Text style={tw`font-medium text-2xl m-2`}>{currentCalories} / {caloriesGoal}</Text>
                </View>

                <View style={tw`flex flex-row justify-between`}>

                        <View style={tw`flex flex-col items-start ml-2`}>
                            <View style={tw`flex items-center justify-center`}>
                                <AnimatedCircularProgress size={110} width={11} fill={proteinFillPercentage} tintColor="#ff474c" backgroundColor="#D3D3D3">
                                    {
                                        (fill: any) => (
                                            <View style={tw`flex flex-col items-center`}>
                                                <Text>{ currentProtein } / { proteinGoal }</Text>
                                                <Text>{t('grams')}</Text>
                                            </View>
                                        )
                                    }
                                </AnimatedCircularProgress>

                                <Text style={tw`mt-2`}>{t('protein')}</Text>
                            </View>
                        </View>

                        <View style={tw`flex flex-col`}>
                            <View style={tw`flex items-center justify-center`}>
                                <AnimatedCircularProgress size={110} width={11} fill={carbsFillPercentage} tintColor="#fcc729" backgroundColor="#D3D3D3">
                                    {
                                        (fill: any) => (
                                            <View style={tw`flex flex-col items-center`}>
                                                <Text>{ currentCarbs } / { carbsGoal }</Text>
                                                <Text>{t('grams')}</Text>
                                            </View>
                                        )
                                    }
                                </AnimatedCircularProgress>

                                <Text style={tw`mt-2`}>{t('carbs')}</Text>
                            </View>
                        </View>

                        <View style={tw`flex flex-col`}>
                            <View style={tw`flex items-center justify-center mr-2`}>
                                <AnimatedCircularProgress size={110} width={11} fill={fatFillPercentage} tintColor="#337def" backgroundColor="#D3D3D3">
                                    {
                                        (fill: any) => (
                                            <View style={tw`flex flex-col items-center`}>
                                                <Text>{ currentFat } / { fatGoal }</Text>
                                                <Text>{t('grams')}</Text>
                                            </View>
                                        )
                                    }
                                </AnimatedCircularProgress>

                                <Text style={tw`mt-2`}>{t('fat')}</Text>
                            </View>
                        </View>
                </View>
            </View>
        </View>
    )
}

export default RenderGoalNutrients