import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'

const singleBoxElement = (icon: any, title: string, currentValue: string, goalValue: string, background: string, onPress: () => void) => {

    //'flame-outline', t('calories'), currentCalories, caloriesGoal.toString() + " kcal", '[#cce5e2]'
    
    return (
        <Pressable onPress={onPress} style={tw`w-[49%] h-28 bg-${background} shadow-md rounded-2xl`}>

            <View style={tw`flex flex-row gap-x-1 ml-1 mt-2`}>

                <Ionicons name={icon} size={24} color='black' />

                <View style={tw`mt-[-3px]`}>
                    <Text style={tw`text-lg`}>{title}</Text>
                </View>

            </View>

            <View style={tw`flex-1 flex-row items-end ml-2 mb-1`}>
                <Text style={tw`text-2xl`}>{currentValue}</Text>
                <Text style={tw`text-sm`}>{goalValue}</Text>
            </View>



        </Pressable>
    );
}

export default singleBoxElement;