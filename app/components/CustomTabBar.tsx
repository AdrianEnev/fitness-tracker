import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc";
import { Ionicons } from '@expo/vector-icons';
import getProfilePicture from '../use/useGetProfilePicture';

const CustomTabBar = ({navigation, currentPage}: any) => {

    const changePage = (page: string) => {
        if (currentPage !== page) {

            navigation.navigate(page);
            
        }
    }

    return (
        <View style={tw`bg-white w-full h-20 shadow-md absolute bottom-0`}>
            <View style={tw`flex flex-row justify-around mt-4`}>
                    
                    <Pressable onPress={() => changePage('Главна Страница')}>
                        <Ionicons name='home-outline' size={32} color={currentPage === 'Главна Страница' ? '#ff6b6b' : '#000'} />
                    </Pressable>

                    <Pressable onPress={() => changePage('Тренировки')}>
                        <Ionicons name='accessibility-outline' size={32} color={currentPage === 'Тренировки' ? '#ff6b6b' : '#000'}/>
                    </Pressable>    
                    
                    
                    <Pressable onPress={() => changePage('Хранене')}>
                        <Ionicons name='egg-outline' size={32} color={currentPage === 'Хранене' ? '#ff6b6b' : '#000'}/>
                    </Pressable> 

                    <Pressable onPress={() => changePage('Настройки-Страница')}>
                        <Ionicons name='settings-outline' size={32} color={currentPage === 'Настройки-Страница' ? '#ff6b6b' : '#000'}/>
                    </Pressable> 
            </View>
            
        </View>
    )
}

export default CustomTabBar