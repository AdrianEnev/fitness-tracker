import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import GlobalContext from '../../GlobalContext';

type RenderNutrientsProps = {
    currentNutrients: any;
    date: string;
  };

const Nutrients = ({ currentNutrients, date}: RenderNutrientsProps) => {

    const { goalNutrients } = useContext(GlobalContext);
    
    const currentCalories = currentNutrients?.calories || 0;
    const currentProtein = currentNutrients?.protein || 0;
    const currentCarbs = currentNutrients?.carbs || 0;
    const currentFat = currentNutrients?.fat || 0;

    const goalCalories = goalNutrients?.calories || 0;
    const goalProtein = goalNutrients?.protein || 0;
    const goalCarbs = goalNutrients?.carbs || 0;
    const goalFat = goalNutrients?.fat || 0;

    return (
        <View style={tw`mt-3 mx-2 w-full h-full`}>

            <View style={tw`w-[96.5%] h-[34%] bg-white rounded-lg shadow-lg pt-2 pl-3`}>
                
                
                <View style={tw`flex flex-row justify-between`}>

                    <View style={tw`flex flex-col`}>
                        <Text style={tw`text-2xl font-medium`}>Калории</Text>
                        <Text style={tw`text-lg text-gray-600 mt-[-5px]`}>{date}</Text>
                    </View>

                    <AnimatedCircularProgress
                        style={tw`mr-3`}
                        size={160}
                        width={15}
                        fill={40}
                        tintColor="#f87171"
                        onAnimationComplete={() => console.log('onAnimationComplete')}
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
                        
                    <View style={tw`w-[30.3%] h-16 bg-white flex flex-col`}>
                        <Text style={tw`text-xl font-medium text-center text-gray-600 mb-1`}>Протеин</Text>
                        <View style={tw`w-full h-4 bg-red-400 rounded-lg`}></View>
                        <Text style={tw`font-bold text-sm text-center mt-1`}>{currentProtein}/{goalProtein}g</Text>
                    </View>
                    <View style={tw`w-[30.3%] h-16 bg-white flex flex-col`}>
                        <Text style={tw`text-xl font-medium text-center text-gray-600 mb-1`}>Въглех.</Text>
                        <View style={tw`w-full h-4 bg-red-400 rounded-lg`}></View>
                        <Text style={tw`font-bold text-sm text-center mt-1`}>{currentCarbs}/{goalCarbs}g</Text>
                    </View>
                    <View style={tw`w-[30.3%] h-16 bg-white flex flex-col`}>
                        <Text style={tw`text-xl font-medium text-center text-gray-600 mb-1`}>Мазнини</Text>
                        <View style={tw`w-full h-4 bg-red-400 rounded-lg`}></View>
                        <Text style={tw`font-bold text-sm text-center mt-1`}>{currentFat}/{goalFat}g</Text>
                    </View>



                </View>
                
            </View>

            
        </View>
    )
}

export default Nutrients