import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'

//${primaryGoal === 1 ? 'text-white' : 'text-gray-500'}

const PageTwo = ({primaryGoal, setPrimaryGoal}: any) => {

    const {t} = useTranslation();

    return (
        <View style={tw`flex flex-col mt-[10%] h-full`}>

            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>{t(`main-fitness-goal`)}</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>{t(`this-will`)} <Text style={tw`font-bold`}>{t(`only`)}</Text> {t(`be-used-to-generate-a-custom-workout`)}</Text>
            </View>

            <View style={tw`flex-1 flex-col gap-y-3 mx-5 mt-[5%]`}>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${primaryGoal === 1 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setPrimaryGoal(1)}
                >
                    <Ionicons name='barbell-outline' size={42} color={primaryGoal === 1 ? 'white' : '#6b7280'} style={tw`mt-[6px]`}/>
                    <Text style={tw`text-2xl font-medium ${primaryGoal === 1 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`muscle-gain`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${primaryGoal === 2 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setPrimaryGoal(2)}
                >
                    <Ionicons name='flame-outline' size={42} color={primaryGoal === 2 ? 'white' : '#6b7280'} style={tw`mt-[6px]`}/>
                    <Text style={tw`text-2xl font-medium ${primaryGoal === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`fat-loss`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${primaryGoal === 3 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setPrimaryGoal(3)}
                >
                    <Ionicons name='pulse-outline' size={42} color={primaryGoal === 3 ? 'white' : '#6b7280'} style={tw`mt-[6px]`}/>
                    <Text style={tw`text-2xl font-medium ${primaryGoal === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`endurence`)}</Text>
                </Pressable>

                {/* 
                    <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${primaryGoal === 4 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setPrimaryGoal(4)}
                    >
                        <Ionicons name='accessibility-outline' size={42} color={primaryGoal === 4 ? 'white' : '#6b7280'} style={tw`mt-[6px]`}/>
                        <Text style={tw`text-2xl font-medium ${primaryGoal === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Flexibility</Text>
                    </Pressable>
                */}

            </View>
        </View>
    )
}

export default PageTwo