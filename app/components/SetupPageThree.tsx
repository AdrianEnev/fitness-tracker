import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'

const SetupPageThree = () => {

    const [weightType, setWeightType] = useState('KG');
    const [weight, setWeight] = useState(60);

    return (
        <View style={tw`flex flex-col mt-[15%] h-full`}>
            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>Please enter your weight.</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-1 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to calculate your daily BMR!</Text>
            </View>
            
            <View style={tw`flex flex-row w-full mx-3 mt-[7%]`}>
                <Pressable style={tw`w-[47.5%] h-14 border border-gray-300 rounded-l-[25px] flex items-center justify-center`} onPress={() => {

                    if (weightType == "KG") {
                        return;
                    }

                    setWeightType('KG')
                    setWeight(Math.round(weight / 2.20462))
                }}>
                    <Text style={tw`font-medium text-xl ${weightType === 'KG' ? 'text-[#fd3e4b]' : 'text-black'}`}>KG</Text>
                </Pressable>
                <Pressable style={tw`w-[47.5%] h-14 border border-gray-300 rounded-r-[25px] flex items-center justify-center`} onPress={() => {

                    if (weightType == "LB") {
                        return;
                    }

                    setWeightType('LB')
                    setWeight(Math.round(weight * 2.20462))
                }}>
                    <Text style={tw`font-medium text-xl ${weightType === 'LB' ? 'text-[#fd3e4b]' : 'text-black'}`}>LB</Text>
                </Pressable>
            </View>

            <View style={tw`flex flex-row gap-x-1 justify-center mt-[7%]`}>
                <Text style={tw`font-medium text-5xl`}>{weight}</Text>
                <Text style={tw`text-gray-500 text-xl font-medium ${weightType === "KG" ? "mt-[12px]" : "mt-[14px]"}`}>{weightType.toLowerCase()}</Text>
            </View>

            <View style={tw`mx-3 mt-5 w-[94.5%] h-full`}>
                <View style={tw`w-full h-[18%] bg-gray-200 rounded-[47px]`}>

                </View>

            </View>
            

        </View>
    )
}

export default SetupPageThree