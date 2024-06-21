import { View, Text, Pressable } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import GlobalContext from '../../GlobalContext';
import getCurrentDate from '../use/useGetCurrentDate';

type RenderNutrientsProps = {
    currentNutrients: any;
    navigation: any;
    currentPage: string;
};

const Nutrients = ({ currentNutrients, navigation, currentPage}: RenderNutrientsProps) => {

    const { goalNutrients } = useContext(GlobalContext);
    
    const currentCalories = currentNutrients?.calories || 0;
    const currentProtein = currentNutrients?.protein || 0;
    const currentCarbs = currentNutrients?.carbs || 0;
    const currentFat = currentNutrients?.fat || 0;

    const goalCalories = parseInt(String(goalNutrients?.calories)) || 0;
    const goalProtein = parseInt(String(goalNutrients?.protein)) || 0;
    const goalCarbs = parseInt(String(goalNutrients?.carbs)) || 0;
    const goalFat = parseInt(String(goalNutrients?.fat)) || 0;


    const currentDate = getCurrentDate(false);
    const formattedDate = {
        dateString: currentDate,
        day: parseInt(currentDate.split('-')[0]),
        month: parseInt(currentDate.split('-')[1]),
        year: parseInt(currentDate.split('-')[2]),
        timestamp: Date.now()
    }

    const progressElement = (currentProgress: number, goalProgress: number, title: string) => {

        let redWidthPercentage, blueWidthPercentage;

        if (goalProgress === 0) {
            // Handle the case where goalProgress is 0
            // Assuming you want to show no progress in this case
            redWidthPercentage = 0;
            blueWidthPercentage = 100; // Entire bar is blue
        } else {
            // calculate width based on progress
            const progressRatio = currentProgress / goalProgress;
            redWidthPercentage = Math.min(100, progressRatio * 100); // Ensure it does not exceed 100%
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
    
                    <Text style={tw`font-bold text-sm text-center mt-1`}>{currentProgress}/{goalProgress}g</Text>
    
                </View>
            )
        }else{
            return(
                <View style={tw`w-[30.3%] h-16 bg-white flex flex-col`}>
    
                    <Text style={tw`text-xl font-medium text-center text-gray-600 mb-1`}>{title}</Text>
    
                    <View style={tw`w-full h-4 bg-[#3d5875] rounded-lg`}></View>
                        
                    <Text style={tw`font-bold text-sm text-center mt-1`}>{currentProgress}/{goalProgress}g</Text>
    
                </View>
            )
        }
        
    }

    // key v animatedcircularprogress sluji da updateva stoinostta na fill zashtoto purvonachalno e 0 dokato ne se predade ot main kum nutrients
    return (
        <Pressable style={tw`mt-3 mx-2 w-full h-full`} onPress={() => {
            navigation.navigate("Хранене-Ден", {date: formattedDate});
        }}>

            <View style={tw`w-[96.5%] ${currentPage === 'Main' ? 'h-[33%]' : 'h-[31%]'} bg-white rounded-lg shadow-lg pt-2 pl-3`}>
                
                <View style={tw`flex flex-row justify-between`}>

                    <View style={tw`flex flex-col`}>
                        <Text style={tw`text-2xl font-medium`}>Калории</Text>
                        <Text style={tw`text-lg text-gray-600 mt-[-5px]`}>{getCurrentDate(true)}</Text>
                    </View>

                    <AnimatedCircularProgress
                        key={goalCalories}
                        style={tw`mr-3`}
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
                            
                                <Text style={tw`text-2xl font-medium`}>{currentCalories}/</Text>
                                <Text style={tw`text-base font-medium mt-2`}>{goalCalories}</Text>
                                
                            </View>
                        )}
                    
                    </AnimatedCircularProgress>

                </View>

                <View style={tw`flex flex-row gap-x-3 mt-1`}>
                        
                    {progressElement(currentProtein, goalProtein, 'Протеин')}
                    {progressElement(currentCarbs, goalCarbs, 'Въглех.  ')}
                    {progressElement(currentFat, goalFat, 'Мазнини')}

                </View>
                
            </View>

            
        </Pressable>
    )
}

export default Nutrients