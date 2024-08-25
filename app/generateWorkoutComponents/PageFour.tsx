import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'

const PageFour = ({workoutLocation, setWorkoutLocation}: any) => {
    return (
        <View style={tw`flex flex-col mt-[15%] h-full`}>

            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>Where do you prefer to work out?</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to generate a custom workout!</Text>
            </View>

            <View style={tw`flex-1 flex-col gap-y-3 mx-5 mt-[5%]`}>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${workoutLocation === 1 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setWorkoutLocation(1)}
                >
                    <Ionicons name='barbell-outline' size={42} color={workoutLocation === 1 ? 'white' : '#6b7280'} style={tw`mt-[6px]`}/>
                    <Text style={tw`text-2xl font-medium ${workoutLocation === 1 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Gym</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${workoutLocation === 2 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setWorkoutLocation(2)}
                >
                    <Ionicons name='home-outline' size={42} color={workoutLocation === 2 ? 'white' : '#6b7280'} style={tw`mt-[6px]`}/>
                    <Text style={tw`text-2xl font-medium ${workoutLocation === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Home</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${workoutLocation === 3 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setWorkoutLocation(3)}
                >
                    <Ionicons name='sunny-outline' size={42} color={workoutLocation === 3 ? 'white' : '#6b7280'} style={tw`mt-[6px]`}/>
                    <Text style={tw`text-2xl font-medium ${workoutLocation === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Outdoors</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${workoutLocation === 4 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setWorkoutLocation(4)}
                >
                    <Ionicons name='accessibility-outline' size={42} color={workoutLocation === 4 ? 'white' : '#6b7280'} style={tw`mt-[6px]`}/>
                    <Text style={tw`text-2xl font-medium ${workoutLocation === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Calisthenics Park</Text>
                </Pressable>

            </View>
        </View>
    )
}

export default PageFour