import { View, Text, Pressable } from 'react-native'
import React, { useEffect } from 'react'
import tw from "twrnc";
import { Ionicons } from '@expo/vector-icons';

const CustomTabBar = ({navigation, currentPage, profilePicture}: any) => {

    // priema profile picture za da moje da se prati kum nastroiki s profile picture

    const changePage = (page: string) => {
        if (currentPage !== page) {

            if (page === 'Настройки-Страница') {
                navigation.navigate(page, {profilePicture: profilePicture});
            }else{
                navigation.navigate(page);
            }
            
        }
    }

    return (
        <View style={tw`bg-white w-full h-20 shadow-md absolute bottom-0`}>
            <View style={tw`flex flex-row justify-around mt-4`}>
                    
                    <Pressable onPress={() => changePage('Главна Страница')}>
                        <Ionicons name='home-outline' size={32} color={currentPage === 'Главна Страница' ? '#ff6b6b' : '#000'} />
                    </Pressable>

                    <Pressable onPress={() => changePage('Тренировки')}>
                        <Ionicons name='accessibility-outline' size={32} color={currentPage === 'accessibility' ? '#ff6b6b' : '#000'}/>
                    </Pressable>    
                    
                    
                    <Pressable onPress={() => changePage('Хранене')}>
                        <Ionicons name='egg-outline' size={32} color={currentPage === 'egg' ? '#ff6b6b' : '#000'}/>
                    </Pressable> 

                    <Pressable onPress={() => changePage('Настройки-Страница')}>
                        <Ionicons name='settings-outline' size={32} color={currentPage === 'Настройки-Страница' ? '#ff6b6b' : '#000'}/>
                    </Pressable> 
            </View>
            
        </View>
    )
}

export default CustomTabBar