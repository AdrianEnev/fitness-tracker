import { View, Text, SafeAreaView, Image } from 'react-native'
import React from 'react'
import tw from "twrnc"
import { TouchableOpacity } from 'react-native-gesture-handler'


const Welcome = ({navigation}: any) => {

    return (
        <SafeAreaView style={tw`flex-1 h-full w-full bg-white`}>

            <View style={tw`flex-1 flex-col gap-y-2 justify-end mx-4`}>

                <View style={tw`ml-1`}>
                    <Text style={tw`text-base mb-2 font-medium`}>ENV: Fitness Tracker</Text>
                    <Text style={tw`text-4xl font-medium`}>Няква кач фраза</Text>
                    <Text style={tw`text-4xl font-medium mb-3`}>Негрите тест!</Text>
                </View>
                

                <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-2xl flex justify-center items-center shadow-md`} 
                    onPress={() => navigation.navigate("Вход")}>

                    <Text style={tw`text-2xl text-white`}>Вход</Text>

                </TouchableOpacity>

                <TouchableOpacity style={tw`w-full h-14 bg-white rounded-2xl flex justify-center items-center shadow-md border border-gray-200`}
                    onPress={() => navigation.navigate("Регистрация")}>

                    <Text style={tw`text-2xl`}>Регистрация</Text>

                </TouchableOpacity>

            </View>

        </SafeAreaView>
    )
}

export default Welcome