import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'

const WorkoutFoodButtons = () => {
    return (
        <View style={tw`mt-3 mx-2`}>
            
            <View style={tw`flex flex-row gap-x-2`}>

                <Pressable style={tw`w-[49%] h-32 bg-red-500 rounded-lg shadow-lg pl-2 pt-2`}>
                    <Text style={tw`text-base font-medium text-white`}>Тренировки</Text>
                </Pressable>
                
                <Pressable style={tw`w-[49%] h-32 bg-white rounded-lg shadow-md pl-2 pt-2`}>
                    <Text style={tw`text-base font-medium`}>Хранене</Text>
                </Pressable>

            </View>


        </View>
    )
}

export default WorkoutFoodButtons