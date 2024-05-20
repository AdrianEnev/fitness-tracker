import { View, Text, Button, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import tw from 'twrnc'
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import CustomTabBar from '../components/CustomTabBar';

const Workouts = ({navigation}: any) => {

    const { t } = useTranslation();

    return (
        <SafeAreaView style={tw`w-full h-full`}>

            <View style={tw`w-[96%] flex flex-row justify-between mx-2`}>
                <View style={tw`w-[25%]`}>
                    <TouchableOpacity style={tw`w-full h-12 bg-[#ffd166] rounded-xl flex justify-center items-center`}>
                        <Text style={tw`text-lg text-white font-medium`}>Потърси</Text>
                    </TouchableOpacity>
                </View>

                <View style={tw`w-[25%]`}>
                    <TouchableOpacity style={tw`w-full h-12 bg-[#4ecdc4] rounded-xl flex justify-center items-center`} onPress={() => navigation.navigate('Тренировка-Добави')}>
                        <Text style={tw`text-lg text-gray-100 font-medium`}>Добави</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View>

                {/* FlatList rendering all added workouts */}

            </View>

            <CustomTabBar navigation={navigation} currentPage='Тренировки'/>
            
        </SafeAreaView>
    )
}

export default Workouts