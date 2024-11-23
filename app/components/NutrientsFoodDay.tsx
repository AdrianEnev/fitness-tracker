import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { t } from 'i18next';
import getEmail from '../use/useGetEmail';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RenderNutrientsProps = {
    currentNutrients: any;
    navigation: any;
    formattedDate: any;
    regularDate: any
};

const Nutrients = ({ currentNutrients, regularDate}: RenderNutrientsProps) => {

    const [goalNutrients, setGoalNutrients] = useState<any>(null);
   
    useEffect(() => {
        const fetch = async () => {
            
            const n = await AsyncStorage.getItem(`goal_nutrients_${await getEmail()}`);
           
            if (n) {
                setGoalNutrients(JSON.parse(n))
            }
           
        }
        fetch();
    }, [])
    
    const currentCalories = currentNutrients?.calories || 0;
    const currentProtein = currentNutrients?.protein || 0;
    const currentCarbs = currentNutrients?.carbs || 0;
    const currentFat = currentNutrients?.fat || 0;

    const goalCalories = parseInt(String(goalNutrients?.calories)) || 0;
    const goalProtein = parseInt(String(goalNutrients?.protein)) || 0;
    const goalCarbs = parseInt(String(goalNutrients?.carbs)) || 0;
    const goalFat = parseInt(String(goalNutrients?.fat)) || 0;

    const progressElement = (currentProgress: number, goalProgress: number, title: string) => {

        let redWidthPercentage, blueWidthPercentage;

        if (goalProgress === 0) {
            // Handle the case where goalProgress is 0
            // No progress shown
            redWidthPercentage = 0;
            blueWidthPercentage = 100; 
        } else {
            // calculate width based on progress
            const progressRatio = currentProgress / goalProgress;
            redWidthPercentage = Math.min(100, progressRatio * 100); // Ensure it does not exceed 100%
            
            if (redWidthPercentage <= 10 && redWidthPercentage > 0) {
                redWidthPercentage = 3; // min value for redWidthPercentage
            }
            blueWidthPercentage = 100 - redWidthPercentage;
        }
        
        if (redWidthPercentage) {
            return (
                <View style={tw`w-[30.3%] h-16 bg-white flex flex-col`}>
    
                    <Text style={tw`text-xl font-medium text-center text-gray-600 mb-1`}>{title}</Text>
    
                    <View style={tw`flex flex-row`}>
                        <View style={tw`w-[${redWidthPercentage}%] h-4 bg-[#fd3e6b] ${redWidthPercentage >= 100 ? 'rounded-lg' : 'rounded-l-lg'} mr-[-1px]`}></View>
                        <View style={tw`w-[${blueWidthPercentage}%] h-4 bg-[#3d5875] rounded-r-lg`}></View>
                    </View>
    
                    <Text style={tw`font-bold text-sm text-center mt-1`}>{currentProgress <= 9999 ? currentProgress : '9999'}/{goalProgress}g</Text>
    
                </View>
            )
        }else{
            return(
                <View style={tw`w-[30.3%] h-16 bg-white flex flex-col`}>
    
                    <Text style={tw`text-xl font-medium text-center text-gray-600 mb-1`}>{title}</Text>
    
                    <View style={tw`w-full h-4 bg-[#3d5875] rounded-lg`}></View>
                        
                    <Text style={tw`font-bold text-sm text-center mt-1`}>{currentProgress <= 9999 ? currentProgress : '9999'}/{goalProgress}g</Text>
    
                </View>
            )
        }
        
    }

    // The key in AnimatedCircularProgress ensures that the fill value updates correctly, as it is initially 0 until passed from main to nutrients
    return (
        <View style={tw`mt-3 w-full`}>

            <View style={tw`h-[31%] w-full px-1 mt-[-10px] bg-white rounded-lg mx-2`}>

                <View style={tw`flex flex-row justify-between w-full mt-3`}>

                    <View style={tw`flex flex-col ml-1`}>
                        <Text style={tw`text-2xl font-medium`}>{t('calories')}</Text>
                        <Text style={tw`text-lg text-gray-600 mt-[-5px]`}>{regularDate}</Text>
                    </View>

                    <AnimatedCircularProgress
                        key={goalCalories}
                        style={tw`mr-5 mb-1`}
                        size={160}
                        width={15}
                        fill={(currentCalories / goalCalories) * 100}
                        tintColor="#fd2e5b"
                        backgroundColor="#3d5875"
                        lineCap='round'
                        arcSweepAngle={270}
                        rotation={-135}
                    >
                        {() => (
                            <View style={tw`flex flex-row items-center justify-center`}>
                            
                                <Text style={tw`${currentCalories <= 9999 ? 'text-2xl' : 'text-xl'} font-medium`}>{currentCalories <= 50000 ? currentCalories : '50000'}/</Text>
                                <Text style={tw`text-base font-medium mt-2`}>{goalCalories}</Text>
                                
                            </View>
                        )}
                    
                    </AnimatedCircularProgress>

                </View>

                <View style={tw`flex flex-row gap-x-3 mt-1`}>
                        
                    {progressElement(currentProtein, goalProtein, t('protein'))}
                    {progressElement(currentCarbs, goalCarbs, t('carbs-short'))}
                    {progressElement(currentFat, goalFat, t('fat'))}

                </View>
                
                <View style={tw`w-[96.5%] rounded-2xl h-[2px] bg-gray-100 mt-6`}></View>

            </View>
            
        </View>
    )
}

export default Nutrients