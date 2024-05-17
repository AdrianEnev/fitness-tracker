import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const CustomNavigationBar = ({navigation}: any) => {
    return (
        <View style={tw`flex justify-center items-center bg-white w-full h-20 absolute bottom-1 shadow-md`}>

            <View style={tw`flex flex-row justify-between`}>

                <Pressable style={tw`w-1/5 h-16 flex items-center justify-center`} onPress={() => navigation.navigate("Главна-Страница")}>
                    <Ionicons name='home' size={28} color='black'/>
                </Pressable>

                <Pressable style={tw`w-1/5 h-16 flex items-center justify-center`} onPress={() => navigation.navigate("Запазени-Тренировки")}>
                    <Ionicons name='bookmark' size={28} color='gray'/>
                </Pressable>

                <Pressable style={tw`w-1/5 h-16 flex items-center justify-center`} onPress={() => navigation.navigate("Програми")}>
                    <MaterialCommunityIcons name='human-handsup' size={28} color='gray'/>
                </Pressable>

                <Pressable style={tw`w-1/5 h-16 flex items-center justify-center`} onPress={() => navigation.navigate("Хранене")}>
                    <MaterialCommunityIcons name='food-apple' size={28} color='gray'/>
                </Pressable>

                <Pressable style={tw`w-1/5 h-16 flex items-center justify-center`} onPress={() => navigation.navigate("Настройки-Страница")}>
                    <Ionicons name='settings' size={28} color='gray'/>
                </Pressable>

            </View>
     
        </View>
    )
}

export default CustomNavigationBar