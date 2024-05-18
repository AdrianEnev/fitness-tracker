import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';

const RenderGoalNutrients = ({item, currentNutrients}: any) => {

    const { t } = useTranslation();

    const proteinGoal = Number(item?.protein ?? 0);
    const currentProtein = Number(currentNutrients?.protein ?? 0).toFixed(0);
    const proteinFillPercentage = (Number(currentProtein) / proteinGoal) * 100;

    const carbsGoal = Number(item?.carbs ?? 0);
    const currentCarbs = Number(currentNutrients?.carbs ?? 0).toFixed(0);
    const carbsFillPercentage = (Number(currentCarbs) / carbsGoal) * 100;

    const fatGoal = Number(item?.fat ?? 0);
    const currentFat = Number(currentNutrients?.fat ?? 0).toFixed(0);
    const fatFillPercentage = (Number(currentFat) / fatGoal) * 100;

    /*

    <View style={tw`flex flex-row justify-between mb-2`}>
        <Text style={tw`font-medium text-2xl m-2`}>{t('calories')}</Text>
        <Text style={tw`font-medium text-2xl m-2`}>{currentCalories} / {caloriesGoal}</Text>
    </View>
    
    */
    
    return (
        <View style={tw`flex items-center mt-2 mb-2`}>
            <View style={tw`w-full h-40 bg-[#f7f7f7] shadow-md rounded-2xl`}>

                <View style={tw`flex flex-row justify-between mt-2`}>

                        <View style={tw`flex flex-col items-start ml-2`}>
                            <View style={tw`flex items-center justify-center`}>
                                <AnimatedCircularProgress size={110} width={9} fill={proteinFillPercentage} lineCap='round' tintColor="#ff474c" backgroundColor="white">
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
                                <AnimatedCircularProgress size={110} width={9} fill={carbsFillPercentage} lineCap='round' tintColor="#fcc729" backgroundColor="#D3D3D3">
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
                                <AnimatedCircularProgress size={110} width={9} fill={fatFillPercentage} lineCap='round' tintColor="#337def" backgroundColor="#D3D3D3">
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