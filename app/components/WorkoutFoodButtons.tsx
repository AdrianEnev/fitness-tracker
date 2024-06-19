import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'

//heart-outline; fitness-outline

const WorkoutFoodButtons = ({navigation}: any) => {
    return (
        <View style={tw`mt-3 mx-2`}>
            
            <View style={tw`flex flex-row gap-x-2`}>
                
                <Pressable style={tw`w-[49%] h-32 bg-red-500 rounded-lg shadow-lg flex items-center justify-center`} onPress={() => navigation.navigate('Тренировки')}>
                    <Ionicons name='fitness-outline' size={64} color='white'/>
                </Pressable>
                
                <Pressable style={tw`w-[49%] h-32 bg-white rounded-lg shadow-md flex items-center justify-center`} onPress={() => navigation.navigate('Хранене')}>
                    <Ionicons name='calendar-clear-outline' size={64} />
                </Pressable>

            </View>


        </View>
    )
}

export default WorkoutFoodButtons