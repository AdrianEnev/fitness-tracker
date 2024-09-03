import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'

const PageFive = ({ specificBodyparts, setSpecificBodyparts }: any) => {

    const toggleBodyPart = (bodyPart: number) => {
        if (specificBodyparts.includes(bodyPart)) {
            setSpecificBodyparts(specificBodyparts.filter((part: number) => part !== bodyPart));
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

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes(1) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart(1)}
                >
                    <Ionicons name={specificBodyparts.includes(1) ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes(1) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes(1) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Chest</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes(2) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart(2)}
                >
                    <Ionicons name={specificBodyparts.includes(2) ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes(2) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes(2) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Back</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes(3) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart(3)}
                >
                    <Ionicons name={specificBodyparts.includes(3) ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes(3) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes(3) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Legs</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes(4) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart(4)}
                >
                    <Ionicons name={specificBodyparts.includes(4) ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes(4) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes(4) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Arms</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes(5) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart(5)}
                >
                    <Ionicons name={specificBodyparts.includes(5) ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes(5) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes(5) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Shoulders</Text>
                </Pressable>

            </View>
        </View>
    )
}

export default PageFive