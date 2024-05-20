import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { FlatList } from 'react-native-gesture-handler'

const AddWorkoutPage = () => {

    const [exercises, setExercises] = useState(null)

    return (
        <SafeAreaView style={tw`w-full h-full`}>
            <View>

                

            </View>

            <View style={tw`mx-2 flex justify-end h-full`}>
                <TouchableOpacity style={tw`w-full h-14 bg-[#4ecdc4] rounded-xl flex justify-center items-center`}>
                    <Text style={tw`text-lg text-gray-100 font-medium`}>Добави Упражнение</Text>
                </TouchableOpacity>
            </View>


        </SafeAreaView>
    )
}

export default AddWorkoutPage