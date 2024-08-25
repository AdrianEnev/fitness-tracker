import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'

const PageOne = ({experienceLevel, setExperienceLevel}: any) => {
    return (
        <View style={tw`flex flex-col mt-[10%] h-full`}>

            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>What’s your current fitness level?</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to generate a custom workout!</Text>
            </View>

            <View style={tw`flex-1 flex-col gap-y-3 mx-5 mt-[5%]`}>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${experienceLevel === 1 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setExperienceLevel(1)}
                >
                    <Text style={tw`text-3xl font-bold ${experienceLevel === 1 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>1/4</Text>
                    <Text style={tw`text-2xl font-medium ${experienceLevel === 1 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Beginner</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${experienceLevel === 2 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setExperienceLevel(2)}
                >
                    <Text style={tw`text-3xl font-bold ${experienceLevel === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>2/4</Text>
                    <Text style={tw`text-2xl font-medium ${experienceLevel === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Intermediate</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${experienceLevel === 3 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setExperienceLevel(3)}
                >
                    <Text style={tw`text-3xl font-bold ${experienceLevel === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>3/4</Text>
                    <Text style={tw`text-2xl font-medium ${experienceLevel === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Advanced</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${experienceLevel === 4 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setExperienceLevel(4)}
                >
                    <Text style={tw`text-3xl font-bold ${experienceLevel === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>4/4</Text>
                    <Text style={tw`text-2xl font-medium ${experienceLevel === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Elite</Text>
                </Pressable>

            </View>
        </View>
    )
}

export default PageOne