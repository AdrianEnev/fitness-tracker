import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Picker } from 'react-native-wheel-pick'

const PageThree = ({numberOfDays, setNumberOfDays}: any) => {

    const days = [
        1,2,3,4,5,6,7
    ]

    return (
        <View style={tw`flex flex-col mt-[10%] h-full`}>

            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>How many days a week do you plan to work out?</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to generate a custom workout!</Text>
            </View>

            <View style={tw`flex-1 items-center mt-[5%]`}>
                <View style={tw`w-[37%] h-[60%] bg-gray-200 rounded-[47px] flex items-center pt-3`}>

                    <Text style={tw`font-medium text-3xl mt-3`}>{numberOfDays}</Text>
                    <View style={tw`w-full h-[2px] rounded-full bg-gray-300 mt-3`}></View>

                    <Picker
                        style={tw`h-1/2 w-full bg-gray-200 rounded-[47px] mt-[50%]`}
                        selectedValue={days}
                        pickerData={days}
                        onValueChange={(value: any) => { setNumberOfDays(value) }}
                    />

                </View>
            </View>
        </View>
    )
}

export default PageThree