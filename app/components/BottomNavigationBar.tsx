import { View, Text, Pressable } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';
import { checkWorkoutsCountFolder, checkWorkoutsCountTotal } from '../useWorkout/useCheckWorkoutsCount';

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
        navigation, 
        currentPage, 
        internetConnected,
        forwardButton, backButton,
        deleteSavedWorkout, toggleEndWorkoutModal,
        foodDayDate, clearDay,
        displayFoods,
        startWorkout,
        viewWorkoutNumberOfExercises,
        friendsListUsername,
        removeFriend,
        addSetButton, addWorkoutButton,
        deleteFood,
        clearSearchFoodSuggestionList,
        saveSettingsMacrosButton,
        viewWorkoutAddExercise,
        saveViewWorkoutChanges,
        addWorkoutPageCurrentExercise,
        addActiveWorkoutSet,
        addActiveWorkoutExercise,
        addEmptyFolder, folder, deleteFolder,
        selectionMode, deleteSelectedWorkouts, cutSelectedWorkouts, copySelectedWorkouts,
        copySelectedWorkoutsInFolder, cutSelectedWorkoutsInFolder, deleteSelectedWorkoutsInFolder,
        viewSavedWorkoutDate, viewSavedWorkoutStartEnd, viewSavedWorkoutNumberOfExercises,
        addCustomFoodPageAddFood, addFoodPageAddButton,
        activeWorkoutNumberOfExercises, currentlyGeneratingWorkout

    }: 
    {
        currentPage: string, navigation?: any, internetConnected?: boolean,
        forwardButton?: any, backButton?: any,
        deleteSavedWorkout?: () => void, toggleEndWorkoutModal?: () => void,
        foodDayDate?: any, clearDay?: () => void, 
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
        saveViewWorkoutChanges?: () => void,
        addWorkoutPageCurrentExercise?: number,
        addActiveWorkoutSet?: () => void,
        addActiveWorkoutExercise?: () => void,
        startWorkout?: () => void,
        addEmptyFolder?: () => void,
        folder?: any, deleteFolder?: () => void,
        selectionMode?: boolean, deleteSelectedWorkouts?: () => void, cutSelectedWorkouts?: () => void, copySelectedWorkouts?: () => void,
        copySelectedWorkoutsInFolder?: () => void, cutSelectedWorkoutsInFolder?: () => void, deleteSelectedWorkoutsInFolder?: () => void,
        viewSavedWorkoutDate?: any, viewSavedWorkoutStartEnd?: any, viewSavedWorkoutNumberOfExercises?: any,
        addCustomFoodPageAddFood?: () => void, addFoodPageAddButton?: () => void,
        activeWorkoutNumberOfExercises?: any, currentlyGeneratingWorkout?: boolean
    }
) => {
    
    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);
    
    return (
        <View style={tw`
            absolute w-[96.5%] h-20 shadow-lg mx-2 rounded-2xl flex flex-row justify-around items-center bg-white
            ${iphoneModel.includes('SE') ? 'bottom-4' : 'bottom-8'}
        `}>
        
            {currentPage === 'ActiveWorkout' ? (
                <View style={tw`flex flex-col w-full`}>

                <View style={tw`w-full h-16 flex gap-y-2 flex-row justify-between absolute bottom-18`}>
                    <Pressable style={tw`w-[49%] bg-blue-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={addActiveWorkoutSet}>
                        <Text style={tw`text-white font-medium text-xl`}>+ {t(`set`)}</Text>
                    </Pressable>
                    <Pressable style={tw`w-[49%] bg-yellow-400 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={addActiveWorkoutExercise}>
                        <Text style={tw`text-white font-medium text-xl`}>+ {t('exercise')}</Text>
                    </Pressable>
                    
                </View>

                <View style={tw`flex flex-row ${activeWorkoutNumberOfExercises === 1 ? 'justify-center' : 'justify-between'} w-full`}>

                    <Pressable onPress={backButton} style={tw`${activeWorkoutNumberOfExercises === 1 ? 'hidden' : ''}`}>
                        <Ionicons name='chevron-back-circle-outline' color='#3b82f6' size={72}/>
                    </Pressable>

                        <Pressable onPress={toggleEndWorkoutModal}>
                            <Ionicons name='stop-circle-outline' color='#fd1c47' size={72}/>
                        </Pressable>

                    <Pressable onPress={forwardButton} style={tw`${activeWorkoutNumberOfExercises === 1 ? 'hidden' : ''}`}>
                        <Ionicons name='chevron-forward-circle-outline' color='#3b82f6' size={72}/>
                    </Pressable>
                </View>
            </View>
            ) : currentPage === 'SavedWorkout' ? (
                <View style={tw`flex-1`}>
                    <View style={tw`w-full h-16 flex gap-y-2 flex-row justify-between absolute bottom-18`}>
                        <View style={tw`w-[49%] bg-green-500 h-13 rounded-lg shadow-md flex items-center justify-center`}>
                            <Text style={tw`text-white font-medium text-xl`}>{viewSavedWorkoutDate}</Text>
                        </View>
                    
                        <View style={tw`w-[49%] bg-yellow-400 h-13 rounded-lg shadow-md flex items-center justify-center`}>
                            <Text style={tw`text-white font-medium text-xl`}>
                                {viewSavedWorkoutStartEnd}
                            </Text>
                        </View>
                    </View>

                    <View style={tw`w-full ${viewSavedWorkoutNumberOfExercises === 1 ? 'flex items-center' : 'flex flex-row justify-between'}`}>
                        
                            <Pressable onPress={() => {
                                backButton();
                                console.log(viewSavedWorkoutNumberOfExercises)
                            }} style={tw`${viewSavedWorkoutNumberOfExercises === 1 ? 'hidden' : ''}`}>
                                <Ionicons name='chevron-back-circle-outline' color='#3b82f6' size={72}/>
                            </Pressable>

                            <View style={tw``}>
                                <Pressable onPress={deleteSavedWorkout} >
                                    <Ionicons name='close-circle-outline' color='#fd1c47' size={72}/>
                                </Pressable>
                            </View>

                            <Pressable onPress={forwardButton} style={tw`${viewSavedWorkoutNumberOfExercises === 1 ? 'hidden' : ''}`}>
                                <Ionicons name='chevron-forward-circle-outline' color='#3b82f6' size={72}/>
                            </Pressable>
                        
                        
                    </View>
                </View>
            ) : currentPage === 'AddWorkout' ? (

                <View style={tw`flex flex-col w-full`}>

                    <View style={tw`w-full h-16 flex gap-y-2 flex-row justify-between absolute bottom-18`}>
                        <Pressable style={tw`w-[49%] bg-blue-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={addSetButton}>
                            <Text style={tw`text-white font-medium text-xl`}>+ {t(`set`)}</Text>
                        </Pressable>
                        <Pressable style={tw`w-[49%] bg-green-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={addWorkoutButton}>
                            <Text style={tw`text-white font-medium text-xl`}>{t(`done`)}</Text>
                        </Pressable>
                        
                    </View>

                    <View style={tw`w-full flex flex-row justify-around`}>

                        <Pressable onPress={backButton} style={tw`${viewWorkoutNumberOfExercises === 1 ? 'hidden' : 'flex'}`}>
                            <Ionicons name='chevron-back-circle-outline' color='#fd1c47' size={72}/>
                        </Pressable>

                        <View style={tw`mt-[6px] w-[60px] h-[60px] border-[5px] border-[#fd1c47] rounded-[30px] flex items-center justify-center`}>

                            <Text style={tw`text-[#fd1c47] font-bold text-2xl`}>{addWorkoutPageCurrentExercise}</Text>

                        </View>
                        
                        <Pressable onPress={forwardButton} style={tw`${viewWorkoutNumberOfExercises === 1 ? 'hidden' : 'flex'}`}>
                            <Ionicons name='chevron-forward-circle-outline' color='#fd1c47' size={72}/>
                        </Pressable>
                    </View>
                </View>
               
                
                
            ) : currentPage === "FoodDay" ? (
                <View style={tw`flex flex-row justify-around w-full items-center`}>
                    <Pressable onPress={() => navigation.navigate("Храна-Добави", { date: foodDayDate })}>
                        <Ionicons name="add-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Храна-Сканиране", { date: foodDayDate })}>
                        <Ionicons name="scan-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={() => {
                        if (!internetConnected) {return;}
                        navigation.navigate("Храна-Потърси", { date: foodDayDate })
                    }}>
                        <Ionicons name="search-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>
                </View>
            ) : currentPage === "AddCustomFoodPage" ? (
                <View style={tw`flex items-center justify-center`}>
                    <Pressable onPress={addCustomFoodPageAddFood}>
                        <Text style={tw`text-4xl font-semibold text-red-500`}>{t('add')}</Text>
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
            ) : currentPage === "AddFoodPageEditFood" ? (
                <View style={tw`flex flex-row justify-around w-full`}>
                    <Pressable onPress={addFoodPageAddButton}>
                        <Text style={tw`text-red-500 font-semibold text-4xl`}>{t('add-food')}</Text>
                    </Pressable> 
                </View>
            ) : currentPage === 'Workouts' ? (
                <View>
                    {selectionMode === false ? (
                        <View style={tw`flex flex-row justify-around items-center w-full h-full`}>

                            <Pressable onPress={async () => {
                                const limitReachedTotal = await checkWorkoutsCountTotal();

                                if (limitReachedTotal) {
                                    alert('You cannot add more than 30 workouts in total!')
                                    return;
                                }

                                navigation.navigate('Тренировка-Добави', {folder: undefined});
                            }}>
                                <Ionicons name="add-circle-outline" size={72} color="#fd1c47"/>
                            </Pressable>
        
                            <Pressable onPress={addEmptyFolder}>
                                <Ionicons name="folder-open-outline" size={72} color="#fd1c47"/>
                            </Pressable>
                            
                            <Pressable style={tw`w-15 h-15 border-4 border-[#fd1c47] rounded-full flex items-center justify-center`}
                                onPress={() => {

                                    if (currentlyGeneratingWorkout) {
                                        return;
                                    }

                                    if (internetConnected) {
                                        navigation.navigate('Генериране-Тренировка');
                                    }
                                }}
                            >
                                <Ionicons name="flash-outline" size={40} color="#fd1c47"/>
                            </Pressable>
    
                        </View>
                    ) : (
                        <View style={tw`flex flex-row justify-around items-center w-full h-full`}>
                            
                            <Pressable onPress={cutSelectedWorkouts}>
                                <Ionicons name="cut-outline" size={72} color="#fd1c47"/>
                            </Pressable>

                            <Pressable onPress={deleteSelectedWorkouts}>
                                <Ionicons name="trash-outline" size={72} color="#fd1c47"/>
                            </Pressable>

                            <Pressable onPress={copySelectedWorkouts}>
                                <Ionicons name="copy-outline" size={72} color="#fd1c47"/>
                            </Pressable>
                        </View>
                    )}
                </View>
            ) : currentPage === 'ViewWorkout' ? (
                <View style={tw`flex flex-col w-full`}>

                    <View style={tw`w-full h-16 flex gap-y-2 flex-row justify-between absolute bottom-18`}>
                        <Pressable style={tw`w-[49%] bg-blue-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={addSetButton}>
                            <Text style={tw`text-white font-medium text-xl`}>+ {t(`set`)}</Text>
                        </Pressable>
                       
                        <Pressable style={tw`w-[49%] bg-yellow-400 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={viewWorkoutAddExercise}>
                            <Text style={tw`text-white font-medium text-xl`}>+ {t('exercise')}</Text>
                        </Pressable>
                        
                    </View>

                    <View style={tw`w-full flex flex-row ${viewWorkoutNumberOfExercises === 1 ? 'justify-around' : 'justify-around'}`}>

                        <Pressable onPress={backButton} style={tw`${viewWorkoutNumberOfExercises === 1 ? 'hidden' : 'flex'}`}>
                            <Ionicons name='chevron-back-circle-outline' color='#3b82f6' size={72}/>
                        </Pressable>
                        <Pressable onPress={startWorkout} style={tw``}>
                            <Ionicons name='play-circle-outline' color='#22c55e' size={72}/>
                        </Pressable>
                        <Pressable onPress={saveViewWorkoutChanges} style={tw``}>
                            <Ionicons name='checkmark-circle-outline' color='#fbbf24' size={72}/>
                        </Pressable>
                        
                        <Pressable onPress={forwardButton} style={tw`${viewWorkoutNumberOfExercises === 1 ? 'hidden' : 'flex'}`}>
                            <Ionicons name='chevron-forward-circle-outline' color='#3b82f6' size={72}/>
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
                        <Text style={tw`text-red-500 font-semibold text-4xl`}>{t('save')}</Text>
                    </Pressable>
                </View>
            ) : currentPage === "Folder" ? (
                <View>
                    {selectionMode === false ? (
                        <View style={tw`flex flex-row justify-around items-center w-full h-full`}>

                            <Pressable onPress={async () => {
                                const limitReachedFolder = await checkWorkoutsCountFolder(folder.id)
                                const limitReachedTotal = await checkWorkoutsCountTotal();
                                
                                if (limitReachedFolder) {
                                    alert('You cannot add any more workouts in this folder!')
                                    return;
                                }else if (limitReachedTotal) {
                                    alert('You cannot add more than 30 workouts in total!')
                                    return;
                                }

                                navigation.navigate("Тренировка-Добави", {folder: folder})
                            }}>
                                <Ionicons name="add-circle-outline" size={72} color="#fd1c47"/>
                            </Pressable>

                            <Pressable onPress={deleteFolder}>
                                <Ionicons name="trash-bin-outline" size={72} color="#fd1c47"/>
                            </Pressable>
                            
                            <Pressable style={tw`w-15 h-15 border-4 border-[#fd1c47] rounded-full flex items-center justify-center`}
                                onPress={() => navigation.navigate('Генериране-Тренировка', {folder: folder})}
                            >
                                <Ionicons name="flash-outline" size={40} color="#fd1c47"/>
                            </Pressable>

                        </View>
                    ) : (
                        <View style={tw`flex flex-row justify-around items-center w-full h-full`}>
                            
                            <Pressable onPress={cutSelectedWorkoutsInFolder}>
                                <Ionicons name="cut-outline" size={72} color="#fd1c47"/>
                            </Pressable>

                            <Pressable onPress={deleteSelectedWorkoutsInFolder}>
                                <Ionicons name="trash-outline" size={72} color="#fd1c47"/>
                            </Pressable>

                            <Pressable onPress={copySelectedWorkoutsInFolder}>
                                <Ionicons name="copy-outline" size={72} color="#fd1c47"/>
                            </Pressable>
                        </View>
                    )}
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