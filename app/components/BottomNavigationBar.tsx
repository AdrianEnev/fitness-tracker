import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import endWorkout from '../use/useEndWorkout';

const Button = ({currentPage, goalPage, navigation, icon, navigationPage}: any) => {
    return (
        <Pressable style={tw`w-[39px] h-full flex flex-col justify-center`} onPress={() => {
            navigation.navigate(navigationPage);
        }}>
            <Ionicons name={icon} 
                size={40}
                color='#fd1c47'  
            />
            {currentPage === goalPage && (
                <View style={tw`w-[39px] h-1 bg-[#fd1c47] rounded-lg`}></View>
            )}
        </Pressable>
    )
}

const BottomNavigationBar = (
    {
        currentPage, navigation, 
        forwardButton, backButton,
        deleteSavedWorkout, toggleEndWorkoutModal
    }: 
    {
        currentPage: string, navigation: any,
        forwardButton?: () => void, backButton?: () => void
        deleteSavedWorkout?: () => void, toggleEndWorkoutModal?: () => void
    }
) => {

    return (
        <View style={tw`
            absolute w-[96.5%] h-20 bg-white shadow-lg bottom-8 mx-2 rounded-2xl flex flex-row justify-around items-center
        `}>
            
            {currentPage === 'ActiveWorkout' ? (
                <View style={tw`flex flex-row justify-between w-full`}>

                    <Pressable onPress={backButton}>
                        <Ionicons name='chevron-back' color='#ef4444' size={64}/>
                    </Pressable>

                    <Pressable onPress={toggleEndWorkoutModal}>
                        <Ionicons name='stop-outline' color='#ef4444' size={64}/>
                    </Pressable>

                    <Pressable onPress={forwardButton}>
                        <Ionicons name='chevron-forward' color='#ef4444' size={64}/>
                    </Pressable>
                </View>
            ) : currentPage === 'SavedWorkout' ? (
                <View style={tw`flex flex-row justify-between w-full`}>

                    <Pressable onPress={backButton}>
                        <Ionicons name='chevron-back' color='#ef4444' size={64}/>
                    </Pressable>

                    <Pressable onPress={deleteSavedWorkout}>
                        <Ionicons name='trash-outline' color='#ef4444' size={64}/>
                    </Pressable>

                    <Pressable onPress={forwardButton}>
                        <Ionicons name='chevron-forward' color='#ef4444' size={64}/>
                    </Pressable>
                </View>
            ) : (
                <View style={tw`flex flex-row justify-around items-center w-full h-full`}>
                    {Button({currentPage, navigation, icon: 'home-outline', navigationPage: 'Главна Страница', goalPage: 'Main'})}
                    {Button({currentPage, navigation, icon: 'fitness-outline', navigationPage: 'Тренировки', goalPage: 'Workouts'})}
                    {Button({currentPage, navigation, icon: 'calendar-clear-outline', navigationPage: 'Хранене', goalPage: 'Food'})}
                    {Button({currentPage, navigation, icon: 'settings-outline', navigationPage: 'Настройки-Страница', goalPage: 'Settings'})}
                </View>
            )}
            
            
        </View>
    )
}

export default BottomNavigationBar