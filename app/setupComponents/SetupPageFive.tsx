import { View, Text, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import GlobalContext from '../../GlobalContext'

const SetupPageFive = ({activityLevel, setActivityLevel}: any) => {

    const {iphoneModel} = useContext(GlobalContext);
   
    return (
        <View style={tw`flex flex-col ${iphoneModel.includes('Pro') ? "mt-[10%]" : "mt-[15%]"} h-full`}>
            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>How active are you?</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-1 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to calculate your daily BMR!</Text>
            </View>

            <View style={tw`flex-1 flex-col gap-y-2 mx-5 mt-[5%]`}>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${activityLevel === 1 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(1)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 1 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>1/6</Text>
                    <Text style={tw`text-2xl font-medium ${activityLevel === 1 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Sedentary</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${activityLevel === 2 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(2)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>2/6</Text>
                    <Text style={tw`text-2xl font-medium ${activityLevel === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Exercise 1-3 times/week</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${activityLevel === 3 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(3)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>3/6</Text>
                    <Text style={tw`text-2xl font-medium ${activityLevel === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Exercise 4-5 times/week</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${activityLevel === 4 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(4)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>4/6</Text>
                    <Text style={tw`text-2xl font-medium ${activityLevel === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Daily exercise or intense exercise 3-4 times/week</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${activityLevel === 5 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(5)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 5 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>5/6</Text>
                    <Text style={tw`text-2xl font-medium ${activityLevel === 5 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[80%]`}>Intense exercise 6-7 times/week</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${activityLevel === 6 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(6)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 6 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>6/6</Text>
                    <Text style={tw`text-2xl font-medium ${activityLevel === 6 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[80%]`}>Very intense exercise daily, or physical job</Text>
                </Pressable>

            </View>
        </View>
    )
}

export default SetupPageFive