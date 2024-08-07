import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import endWorkout from '../use/useEndWorkout';
import startWorkout from '../use/useStartWorkout';

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
        foodDayDate, clearDay,
        saveCustomFood,
        displayFoods,
        workout,
        viewWorkoutNumberOfExercises,
        friendsListUsername,
        removeFriend,
        addSetButton, addWorkoutButton,
        deleteFood,
        clearSearchFoodSuggestionList,
        saveSettingsMacrosButton,
        viewWorkoutAddExercise
    }: 
    {
        currentPage: string, navigation: any,
        forwardButton?: () => void, backButton?: () => void
        deleteSavedWorkout?: () => void, toggleEndWorkoutModal?: () => void,
        foodDayDate?: any, clearDay?: () => void,
        saveCustomFood?: () => void,
        displayFoods?: () => void,
        workout?: any,
        viewWorkoutNumberOfExercises?: number,
        friendsListUsername?: string,
        removeFriend?: () => void,
        addSetButton?: () => void, addWorkoutButton?: () => void,
        deleteFood?: () => void,
        clearSearchFoodSuggestionList?: () => void,
        saveSettingsMacrosButton?: () => void,
        viewWorkoutAddExercise?: () => void,
    }
) => {
    //AddCustomFood

    return (
        <View style={tw`
            absolute w-[96.5%] h-20 shadow-lg bottom-8 mx-2 rounded-2xl flex flex-row justify-around items-center
            ${(currentPage === 'Settings-Macronutrients' || currentPage === 'AddCustomFood') ? 'bg-[#fd1c47]' : 'bg-white'}
        `}>
        
            {currentPage === 'ActiveWorkout' ? (
                <View style={tw`flex flex-row justify-between w-full`}>

                    <Pressable onPress={backButton}>
                        <Ionicons name='chevron-back' color='#fd1c47' size={64}/>
                    </Pressable>

                    <Pressable onPress={toggleEndWorkoutModal}>
                        <Ionicons name='stop-outline' color='#fd1c47' size={64}/>
                    </Pressable>

                    <Pressable onPress={forwardButton}>
                        <Ionicons name='chevron-forward' color='#fd1c47' size={64}/>
                    </Pressable>
                </View>
            ) : currentPage === 'SavedWorkout' ? (
                <View style={tw`flex flex-row justify-between w-full`}>

                    <Pressable onPress={backButton}>
                        <Ionicons name='chevron-back' color='#fd1c47' size={64}/>
                    </Pressable>

                    <Pressable onPress={deleteSavedWorkout}>
                        <Ionicons name='trash-outline' color='#fd1c47' size={64}/>
                    </Pressable>

                    <Pressable onPress={forwardButton}>
                        <Ionicons name='chevron-forward' color='#fd1c47' size={64}/>
                    </Pressable>
                </View>
            ) : currentPage === 'AddWorkout' ? (
                <View style={tw`flex flex-col`}>

                    <View style={tw`w-full h-16 flex flex-row justify-between absolute bottom-18`}>
                        <Pressable style={tw`w-[49%] bg-blue-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={addSetButton}>
                            <Text style={tw`text-white font-medium text-xl`}>+ Set</Text>
                        </Pressable>
                        <Pressable style={tw`w-[49%] bg-green-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={addWorkoutButton}>
                            <Text style={tw`text-white font-medium text-xl`}>Done</Text>
                        </Pressable>
                    </View>

                    <View style={tw`flex flex-row justify-between w-full`}>

                        <Pressable onPress={backButton}>
                            <Ionicons name='chevron-back-circle-outline' color='#fd1c47' size={72}/>
                        </Pressable>

                        <Pressable onPress={forwardButton}>
                            <Ionicons name='chevron-forward-circle-outline' color='#fd1c47' size={72}/>
                        </Pressable>
                    </View>
                </View>
            ) : currentPage === "FoodDay" ? (
                <View style={tw`flex flex-row justify-around w-full items-center`}>
                    <Pressable onPress={() => navigation.navigate("Храна-Добави", { date: foodDayDate })}>
                        <Ionicons name="add-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={clearDay}>
                        <Ionicons name="refresh-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Храна-Потърси", { date: foodDayDate })}>
                        <Ionicons name="search-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>
                </View>
            ) : currentPage === "AddCustomFood" ? (
                <View style={tw`flex items-center justify-center`}>
                    <Pressable onPress={saveCustomFood}>
                        <Ionicons name='checkmark-done' color='white' size={64}/>
                    </Pressable>
                </View>
            ) : currentPage === "AddFoodPage" ? (
                <View style={tw`flex flex-row justify-around w-full`}>
                    <Pressable onPress={clearSearchFoodSuggestionList}>
                        <Ionicons name="refresh-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={displayFoods}>
                        <Ionicons name="search-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>  
                </View>
            ) : currentPage === 'Workouts' ? (
                <View style={tw`flex flex-row justify-around items-center w-full h-full`}>

                    {Button({currentPage, navigation, icon: 'home-outline', navigationPage: 'Главна Страница', goalPage: 'Main'})}
                    {Button({currentPage, navigation, icon: 'fitness-outline', navigationPage: 'Тренировки', goalPage: 'Workouts'})}
                    {Button({currentPage, navigation, icon: 'calendar-clear-outline', navigationPage: 'Хранене', goalPage: 'Food'})}
                    {Button({currentPage, navigation, icon: 'settings-outline', navigationPage: 'Настройки-Страница', goalPage: 'Settings'})}

                </View>
            ) : currentPage === 'ViewWorkout' ? (
                <View style={tw`flex flex-col`}>

                    <View style={tw`w-full h-16 flex flex-wrap gap-y-2 flex-row justify-between absolute bottom-32`}>
                        <Pressable style={tw`w-[49%] bg-blue-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={addSetButton}>
                            <Text style={tw`text-white font-medium text-xl`}>+ Set</Text>
                        </Pressable>
                        <Pressable style={tw`w-[49%] bg-yellow-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={viewWorkoutAddExercise}>
                            <Text style={tw`text-white font-medium text-xl`}>+ Exercise</Text>
                        </Pressable>

                        <Pressable style={tw`w-[49%] bg-red-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={deleteSavedWorkout}>
                            <Text style={tw`text-white font-medium text-xl`}>Delete</Text>
                        </Pressable>

                        <Pressable style={tw`w-[49%] bg-green-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={addSetButton}>
                            <Text style={tw`text-white font-medium text-xl`}>Save</Text>
                        </Pressable>
                        
                    </View>

                    <View style={tw`flex flex-row ${viewWorkoutNumberOfExercises === 1 ? 'justify-around' : 'justify-between'} w-full`}>

                        <Pressable onPress={backButton} style={tw`${viewWorkoutNumberOfExercises === 1 ? 'hidden' : 'flex'}`}>
                            <Ionicons name='chevron-back-circle-outline' color='#fd1c47' size={72}/>
                        </Pressable>
                        
                        <Pressable onPress={forwardButton} style={tw`${viewWorkoutNumberOfExercises === 1 ? 'hidden' : 'flex'}`}>
                            <Ionicons name='chevron-forward-circle-outline' color='#fd1c47' size={72}/>
                        </Pressable>
                    </View>
                </View>
            ) : currentPage === 'FriendsList' ? (
                <View style={tw`flex flex-row justify-around w-full items-center`}>
                    <Pressable onPress={() => navigation.navigate('Приятели-Покани-Изпратени', {username: friendsListUsername})}>
                        <Ionicons name="navigate-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('Приятели-Добави', {username: friendsListUsername})}>
                        <Ionicons name="add-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('Приятели-Покани-Получени', {username: friendsListUsername})}>
                        <Ionicons name="notifications-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>
                </View>
            ) : currentPage === "ViewFriendProfile" ? (
                <View>
                    <Pressable onPress={removeFriend}>
                        <Ionicons name='trash-outline' color='#fd1c47' size={64}/>
                    </Pressable>
                </View>
            ) : currentPage === "FoodInfo" ? (
                <View>
                    <Pressable onPress={deleteFood}>
                        <Ionicons name='trash-outline' color='#fd1c47' size={64}/>
                    </Pressable>
                </View>
            ) : currentPage === "Settings-Macronutrients" ? (
                <View>
                    <Pressable onPress={saveSettingsMacrosButton}>
                        <Ionicons name='checkmark-done' color='white' size={64}/>
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