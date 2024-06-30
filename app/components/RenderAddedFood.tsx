import { View, Text, Button, Pressable } from 'react-native'
import React from 'react'
import tw from "twrnc";
import { doc, deleteDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { t } from 'i18next';

const RenderAddedFood = ({item, navigation}: any) => {

    const dateOptions = { hour: '2-digit', minute: '2-digit' };
    const date = item?.date ? item.date.toDate().toLocaleTimeString([], dateOptions) : '';

    const getInitials = (name: string) => {
        return name.split(' ').map(word => word[0]).join('').substring(0, 3).toUpperCase();
    }

    return (

        <Pressable style={tw`bg-[#fc2d42] shadow-md rounded-2xl w-full h-24 my-2 pt-2 pl-3 flex flex-row justify-between`}
            onPress={() => navigation.navigate("Храна-Подробности", {food: item, date: date, unformattedDate: item.date})}
        >

            <View style={tw`flex flex-row h-[80%]`}>
                
                {/* Logo */}
                <View style={tw`h-full py-2`}>
                    <View style={tw`w-16 h-16 rounded-lg bg-white flex items-center justify-center`}>
                        <Text style={tw`text-3xl font-medium text-black`}>{getInitials(item.title)}</Text>
                    </View>
                </View>

                {/* Food Name + Grams */}
                <View style={tw`flex flex-col ml-2 h-full mt-[7px] max-w-[72%]`}>
                    <Text style={tw`text-white text-2xl font-medium`} ellipsizeMode='tail' numberOfLines={1}>{item.title}</Text>
                    <Text style={tw`text-white text-xl font-medium`} ellipsizeMode='tail' numberOfLines={1}>{item.calories} {t('calories')}</Text>
                    
                </View>

            </View>

            <View style={tw`flex justify-center mr-2`}>
                <Ionicons name='chevron-forward-outline' size={40} color='white' />
            </View>
        </Pressable>
    )
}
export default RenderAddedFood;