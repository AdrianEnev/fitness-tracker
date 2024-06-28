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
        deleteSavedWorkout, toggleEndWorkoutModal,
        foodDayDate,
        saveCustomFood,
        displayFoods,
        workoutsSearchButton
    }: 
    {
        currentPage: string, navigation: any,
        forwardButton?: () => void, backButton?: () => void
        deleteSavedWorkout?: () => void, toggleEndWorkoutModal?: () => void,
        foodDayDate?: any,
        saveCustomFood?: () => void,
        displayFoods?: () => void,
        workoutsSearchButton?: () => void
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
            ) : currentPage === 'AddWorkout' ? (
                <View style={tw`flex flex-row justify-between w-full`}>

                    <Pressable onPress={backButton}>
                        <Ionicons name='chevron-back' color='#ef4444' size={64}/>
                    </Pressable>

                    <Pressable onPress={forwardButton}>
                        <Ionicons name='chevron-forward' color='#ef4444' size={64}/>
                    </Pressable>
                </View>
            ) : currentPage === "FoodDay" ? (
                <View style={tw`flex flex-row justify-around w-full items-center`}>
                    <Pressable onPress={() => navigation.navigate("Храна-Добави", { date: foodDayDate })}>
                        <Ionicons name="add-circle-outline" size={72} color="#ef4444"/>
                    </Pressable>

                    <Pressable onPress={() => console.log('delete all foods')} style={tw``}>
                        <Ionicons name="refresh-circle-outline" size={72} color="#ef4444"/>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Храна-Потърси", { date: foodDayDate })}>
                        <Ionicons name="search-circle-outline" size={72} color="#ef4444"/>
                    </Pressable>
                </View>
            ) : currentPage === "AddCustomFood" ? (
                <View style={tw`flex items-center justify-center`}>
                    <Pressable onPress={saveCustomFood}>
                        <Ionicons name='checkmark-done' color='#ef4444' size={64}/>
                    </Pressable>
                </View>
            ) : currentPage === "AddFoodPage" ? (
                <View style={tw`flex items-center justify-center`}>
                    <Pressable onPress={displayFoods}>
                        <Ionicons name="search-circle-outline" size={72} color="#ef4444"/>
                    </Pressable>
                </View>
            ) : currentPage === 'Workouts' ? (
                <View style={tw`flex flex-row justify-around w-full`}>

                    <Pressable onPress={workoutsSearchButton}>
                        <Ionicons name="search-circle-outline" size={72} color="#ef4444"/>
                    </Pressable>
                    
                    <Pressable onPress={() => navigation.navigate("Тренировка-Добави")}>
                        <Ionicons name="add-circle-outline" size={72} color="#ef4444"/>
                    </Pressable>

                </View>
            ) : currentPage === 'ViewWorkout' ? (
                <View style={tw`flex flex-row justify-between w-full`}>

                    <Pressable onPress={backButton}>
                        <Ionicons name='chevron-back-circle-outline' color='#3b82f6' size={72}/>
                    </Pressable>

                    <Pressable onPress={deleteSavedWorkout}>
                        <Ionicons name='caret-forward-circle-outline' color='#22c55e' size={72}/>
                    </Pressable>
                    
                    <Pressable onPress={deleteSavedWorkout}>
                        <Ionicons name='close-circle-outline' color='#ef4444' size={72}/>
                    </Pressable>

                    <Pressable onPress={forwardButton}>
                        <Ionicons name='chevron-forward-circle-outline' color='#3b82f6' size={72}/>
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