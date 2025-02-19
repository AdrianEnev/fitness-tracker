import { View, Pressable } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import GlobalContext from 'GlobalContext'

const WorkoutFoodButtons = ({navigation}: any) => {

    const {iphoneModel} = useContext(GlobalContext)
    
    return (
        <View style={tw`mt-3 mx-2`}>
            
            <View style={tw`flex flex-row gap-x-2`}>
                
                <Pressable style={tw`w-[49.6%] ${iphoneModel.includes('Ipad') ? "h-72" : "h-32"}  bg-[#fd1c47] rounded-lg shadow-lg flex items-center justify-center`} onPress={() => navigation.navigate('Тренировки')}>
                    <Ionicons name='fitness-outline' size={iphoneModel.includes('Ipad') ? 124 : 72} color='white'/>
                </Pressable>
                
                <Pressable style={tw`w-[49.6%] ${iphoneModel.includes('Ipad') ? "h-72" : "h-32"}  bg-white rounded-lg shadow-md flex items-center justify-center`} onPress={() => navigation.navigate('Хранене')}>
                    <Ionicons name='calendar-clear-outline' size={iphoneModel.includes('Ipad') ? 124 : 72} />
                </Pressable>

            </View>


        </View>
    )
}

export default WorkoutFoodButtons