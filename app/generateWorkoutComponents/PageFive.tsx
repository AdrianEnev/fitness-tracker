import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'

const PageFive = ({ specificBodyparts, setSpecificBodyparts }: any) => {

    const toggleBodyPart = (bodyPart: string) => {
        if (specificBodyparts.includes(bodyPart)) {
            setSpecificBodyparts(specificBodyparts.filter((part: string) => part !== bodyPart));
        } else {
            setSpecificBodyparts([...specificBodyparts, bodyPart]);
        }
    };

    return (
        <View style={tw`flex flex-col mt-[10%] h-full`}>

            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>Do you want to focus on any specific body parts?</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to generate a custom workout!</Text>
                <Text style={tw`font-medium text-lg text-gray-500 text-center`}>(multiple options can be selected)</Text>
            </View>

            <View style={tw`flex-1 flex-col gap-y-2 mx-5 mt-[5%]`}>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes('Chest') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart('Chest')}
                >
                    <Ionicons name={specificBodyparts.includes('Chest') ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes('Chest') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes('Chest') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Chest</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes('Back') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart('Back')}
                >
                    <Ionicons name={specificBodyparts.includes('Back') ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes('Back') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes('Back') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Back</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes('Legs') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart('Legs')}
                >
                    <Ionicons name={specificBodyparts.includes('Legs') ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes('Legs') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes('Legs') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Legs</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes('Arms') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart('Arms')}
                >
                    <Ionicons name={specificBodyparts.includes('Arms') ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes('Arms') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes('Arms') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Arms</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes('Shoulders') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart('Shoulders')}
                >
                    <Ionicons name={specificBodyparts.includes('Shoulders') ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes('Shoulders') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes('Shoulders') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Shoulders</Text>
                </Pressable>

            </View>
        </View>
    )
}

export default PageFive