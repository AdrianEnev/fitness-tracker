import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'

const SetupPageFour = ({heightType, setHeightType, height, setHeight}: any) => {
    

    return (
        <View style={tw`flex flex-col mt-[15%] h-full`}>
            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>Please enter your height.</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-1 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to calculate your daily BMR!</Text>
            </View>
            
            <View style={tw`flex flex-row w-full mx-3 mt-[7%]`}>
                <Pressable style={tw`w-[47.5%] h-14 border border-gray-300 rounded-l-[25px] flex items-center justify-center`} onPress={() => {

                    if (heightType == "CM") {
                        return;
                    }

                    setHeightType('CM')
                    setHeight(Math.round(height / 0.0328084))
                }}>
                    <Text style={tw`font-medium text-xl ${heightType === 'CM' ? 'text-[#fd3e4b]' : 'text-black'}`}>CM</Text>
                </Pressable>
                <Pressable style={tw`w-[47.5%] h-14 border border-gray-300 rounded-r-[25px] flex items-center justify-center`} onPress={() => {

                    if (heightType == "FT") {
                        return;
                    }

                    setHeightType('FT')
                    setHeight(Math.round(height * 0.0328084))
                }}>
                    <Text style={tw`font-medium text-xl ${heightType === 'FT' ? 'text-[#fd3e4b]' : 'text-black'}`}>FT</Text>
                </Pressable>
            </View>

            <View style={tw`flex flex-row gap-x-1 justify-center mt-[7%]`}>
                <Text style={tw`font-medium text-5xl`}>{height}</Text>
                <Text style={tw`text-gray-500 text-xl font-medium ${heightType === "CM" ? "mt-[12px]" : "mt-[14px]"}`}>{heightType.toLowerCase()}</Text>
            </View>

            <View style={tw`flex-1 items-center mt-[5%]`}>
                <View style={tw`w-[37%] h-[60%] bg-gray-200 rounded-[47px] flex items-center pt-3`}>

                    

                </View>
            </View>
            

        </View>
    )
}

export default SetupPageFour