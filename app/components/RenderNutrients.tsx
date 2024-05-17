import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';

const RenderNutrients = ({item, currentNutrients}: any) => {

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

    // da dobavq margin-top na krugchetata samo ako progresa e minal sredata
    
    return (
        <View style={tw`flex items-center mt-2 mb-5`}>

            <View style={tw`flex flex-row gap-x-5`}>

                <View style={tw`flex flex-col`}>
                    <View style={tw`h-40 w-14 bg-gray-200 rounded-full justify-end`}>
                        <View style={tw`h-${caloriesProgress*40} w-14 bg-[#cce5e2] rounded-full flex items-center justify-start`}>
                            <View style={tw`bg-white w-12 h-12 rounded-full flex items-center justify-center mt-1`}>
                                <Text>{currentCalories}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={tw`text-lg ml-3`}>Кал.</Text>
                </View>

                <View style={tw`flex flex-col`}>
                    <View style={tw`h-40 w-14 bg-gray-200 rounded-full justify-end`}>
                        <View style={tw`h-${proteinProgress*40} w-14 bg-[#cce5e2] rounded-full flex items-center justify-start`}>
                            <View style={tw`bg-white w-12 h-12 rounded-full flex items-center justify-center mt-1`}>
                                <Text>{currentProtein}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={tw`text-lg ml-1`}>Прот.</Text>
                </View>

                <View style={tw`flex flex-col`}>
                    <View style={tw`h-40 w-14 bg-gray-200 rounded-full justify-end`}>
                        <View style={tw`h-${carbsProgress*40} w-14 bg-[#cce5e2] rounded-full flex items-center justify-start`}>
                            <View style={tw`bg-white w-12 h-12 rounded-full flex items-center justify-center mt-1`}>
                                <Text>{currentCarbs}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={tw`text-lg ml-3`}>Въг.</Text>
                </View>

                <View style={tw`flex flex-col`}>
                    <View style={tw`h-40 w-14 bg-gray-200 rounded-full justify-end`}>
                        <View style={tw`h-${fatProgress*40} w-14 bg-[#cce5e2] rounded-full flex items-center justify-start`}>
                            <View style={tw`bg-white w-12 h-12 rounded-full flex items-center justify-center mt-1`}>
                                <Text>{currentFat}</Text>
                            </View>
                        </View>
                    </View>

                    <Text style={tw`text-lg ml-1`}>Мазн.</Text>
                </View>

                <View style={tw`h-40 w-14 bg-gray-200 rounded-full`}></View> 
                    
            </View>
            
        </View>
    )
}

export default RenderNutrients