import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from 'twrnc'

const SetupPageOne = ({setGenderButton, gender, setIncludeInBio, includeInBio}: any) => {

    const [showOnlyText, setShowOnlyText] = useState(true)

    return (
        <View style={tw`flex flex-col mt-[15%] h-full`}>
            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>Please enter your gender.</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-1 text-center`}>This will <Text style={tw`font-bold`}>{showOnlyText === false ? 'also' : 'only'}</Text> be used to calculate your daily BMR!</Text>
            </View>

            <View style={tw`flex-1 flex-col gap-y-5 mx-5 mt-[10%]`}>

                {/* Male */}
                <Pressable style={tw`w-full h-[12%] rounded-2xl ${gender === 'male' ? 'bg-cyan-400' : 'bg-gray-200'} flex flex-row gap-x-2 items-center pl-3`}
                    onPress={() => setGenderButton('male')}
                >

                    <Ionicons name='male-outline' size={50} color={gender === 'male' ? 'white' : '#6b7280'}/>
                    <Text style={tw`text-2xl font-medium ${gender === 'male' ? 'text-white' : 'text-gray-500'} mt-1`}>Male</Text>

                </Pressable>

                {/* Female */}
                <Pressable style={tw`w-full h-[12%] rounded-2xl ${gender === 'female' ? 'bg-pink-400' : 'bg-gray-200'} flex flex-row gap-x-2 items-center pl-3`}
                    onPress={() => setGenderButton('female')}
                >

                    <Ionicons name='female-outline' size={50} color={gender === 'female' ? 'white' : '#6b7280'}/>
                    <Text style={tw`text-2xl font-medium ${gender === 'female' ? 'text-white' : 'text-gray-500'} mt-1`}>Female</Text>

                </Pressable>

                {/*
                 Option 
                 <Pressable style={tw`w-full h-[12%] rounded-2xl ${includeInBio === false ? 'bg-[#fd3e4b]' : 'bg-green-400'} flex flex-row gap-x-2 items-center pl-3`}
                    onPress={() => {
                        setIncludeInBio(!includeInBio)
                        setShowOnlyText(!showOnlyText)
                    }}
                >

                    <Ionicons name={includeInBio === false ? 'close' : 'checkmark'} size={55} color='white'/>
                    <Text style={tw`text-2xl font-medium text-white mt-1`}>Include in profile</Text>

                </Pressable>
                 
                */}
        

            </View>
        </View>
    )
}

export default SetupPageOne