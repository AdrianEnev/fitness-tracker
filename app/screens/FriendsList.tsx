import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'

const FriendsList = ({navigation}: any) => {
    return (
        <SafeAreaView style={tw`w-full h-full`}>

            <View style={tw`w-[96%] flex flex-row justify-between mx-2`}>
                <View style={tw`w-[25%]`}>
                    <TouchableOpacity style={tw`w-full h-12 bg-white rounded-xl flex justify-center items-center`}>
                        <Text style={tw`text-lg text-black font-medium`}>Потърси</Text>
                    </TouchableOpacity>
                </View>

                <View style={tw`w-[25%]`}>
                    <TouchableOpacity style={tw`w-full h-12 bg-white rounded-xl flex justify-center items-center`} onPress={() => navigation.navigate('Приятели-Добави')}>
                        <Text style={tw`text-lg text-black font-medium`}>Добави</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
        </SafeAreaView>
    )
}

export default FriendsList