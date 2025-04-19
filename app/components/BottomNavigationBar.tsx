import { View, Text, Pressable } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import GlobalContext from '@config/GlobalContext';
import { checkWorkoutsCountFolder, checkWorkoutsCountTotal } from '@use/workouts/get/useCheckWorkoutsCount';

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

// --- Grouped Prop Types ---
interface WorkoutActions {
    forwardButton?: any;
    backButton?: any;
    addSetButton?: () => void;
    addWorkoutButton?: () => void;
    addActiveWorkoutSet?: () => void;
    addActiveWorkoutExercise?: () => void;
    addWorkoutPageCurrentExercise?: number;
    activeWorkoutNumberOfExercises?: number;
    startWorkout?: () => void;
    viewWorkoutAddExercise?: () => void;
    saveViewWorkoutChanges?: () => void;
    viewWorkoutNumberOfExercises?: number;
    currentlyGeneratingWorkout?: boolean;
    activeWorkoutToggleEndWorkoutModal?: () => void;
}

interface FoodActions {
    foodDayDate?: any;
    clearDay?: () => void;
    displayFoods?: () => void;
    deleteFood?: () => void;
    clearSearchFoodSuggestionList?: () => void;
    addCustomFoodPageAddFood?: () => void;
    addFoodPageAddButton?: () => void;
}

interface FolderActions {
    addEmptyFolder?: () => void;
    folder?: any;
    deleteFolder?: () => void;
}

interface SelectionActions {
    selectionMode?: boolean;
    deleteSelectedWorkouts?: () => void;
    cutSelectedWorkouts?: () => void;
    copySelectedWorkouts?: () => void;
    copySelectedWorkoutsInFolder?: () => void;
    cutSelectedWorkoutsInFolder?: () => void;
    deleteSelectedWorkoutsInFolder?: () => void;
}

interface FriendActions {
    friendsListUsername?: string;
    removeFriend?: () => void;
}

interface SettingsActions {
    saveSettingsMacrosButton?: () => void;
}

interface SavedWorkoutInfo {
    viewSavedWorkoutDate?: any;
    viewSavedWorkoutStartEnd?: any;
    viewSavedWorkoutNumberOfExercises?: any;
    deleteSavedWorkout?: () => void;
}

interface BottomNavigationBarProps {
    navigation?: any;
    currentPage: string;
    internetConnected?: boolean;
    workoutActions?: Partial<WorkoutActions>;
    foodActions?: Partial<FoodActions>;
    folderActions?: Partial<FolderActions>;
    selectionActions?: Partial<SelectionActions>;
    friendActions?: Partial<FriendActions>;
    settingsActions?: Partial<SettingsActions>;
    savedWorkoutInfo?: Partial<SavedWorkoutInfo>;
}

const BottomNavigationBar = ({
    navigation,
    currentPage,
    internetConnected,
    workoutActions = {},
    foodActions = {},
    folderActions = {},
    selectionActions = {},
    friendActions = {},
    settingsActions = {},
    savedWorkoutInfo = {},
}: BottomNavigationBarProps) => {
    
    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);
    
    // --- Workout-related Navigation ---
    return (
        <View style={tw`
            absolute w-[96.5%] h-20 shadow-lg mx-2 rounded-2xl flex flex-row justify-around items-center bg-white
            ${iphoneModel.includes('SE') ? 'bottom-4' : 'bottom-8'}
        `}>
            {/* Workout: ActiveWorkout */}
            {currentPage === 'Active-Workout' ? (
                <View style={tw`flex flex-col w-full`}>
                    <View style={tw`w-full h-16 flex gap-y-2 flex-row justify-between absolute bottom-18`}>
                        <Pressable style={tw`w-[49%] bg-blue-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={workoutActions.addActiveWorkoutSet}>
                            <Text style={tw`text-white font-medium text-xl`}>+ {t(`set`)}</Text>
                        </Pressable>
                        <Pressable style={tw`w-[49%] bg-yellow-400 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={workoutActions.addActiveWorkoutExercise}>
                            <Text style={tw`text-white font-medium text-xl`}>+ {t('exercise')}</Text>
                        </Pressable>
                    </View>

                    <View style={tw`flex flex-row ${workoutActions.activeWorkoutNumberOfExercises === 1 ? 'justify-center' : 'justify-between'} w-full`}>
                        <Pressable onPress={workoutActions.backButton} style={tw`${workoutActions.activeWorkoutNumberOfExercises === 1 ? 'hidden' : ''}`}>
                            <Ionicons name='chevron-back-circle-outline' color='#3b82f6' size={72}/>
                        </Pressable>

                        <Pressable onPress={workoutActions.activeWorkoutToggleEndWorkoutModal}>
                            <Ionicons name='stop-circle-outline' color='#fd1c47' size={72}/>
                        </Pressable>

                        <Pressable onPress={workoutActions.forwardButton} style={tw`${workoutActions.activeWorkoutNumberOfExercises === 1 ? 'hidden' : ''}`}>
                            <Ionicons name='chevron-forward-circle-outline' color='#3b82f6' size={72}/>
                        </Pressable>
                    </View>
                </View>
            ) : 
            /* Workout: SavedWorkout */
            currentPage === 'Saved-Workout' ? (
                <View style={tw`flex-1`}>
                    <View style={tw`w-full h-16 flex gap-y-2 flex-row justify-between absolute bottom-18`}>
                        <View style={tw`w-[49%] bg-green-500 h-13 rounded-lg shadow-md flex items-center justify-center`}>
                            <Text style={tw`text-white font-medium text-xl`}>{savedWorkoutInfo.viewSavedWorkoutDate}</Text>
                        </View>
                    
                        <View style={tw`w-[49%] bg-yellow-400 h-13 rounded-lg shadow-md flex items-center justify-center`}>
                            <Text style={tw`text-white font-medium text-xl`}>
                                {savedWorkoutInfo.viewSavedWorkoutStartEnd}
                            </Text>
                        </View>
                    </View>

                    <View style={tw`w-full ${savedWorkoutInfo.viewSavedWorkoutNumberOfExercises === 1 ? 'flex items-center' : 'flex flex-row justify-between'}`}>
                        <Pressable onPress={workoutActions.backButton} style={tw`${savedWorkoutInfo.viewSavedWorkoutNumberOfExercises === 1 ? 'hidden' : ''}`}>
                            <Ionicons name='chevron-back-circle-outline' color='#3b82f6' size={72}/>
                        </Pressable>

                        <View style={tw``}>
                            <Pressable onPress={savedWorkoutInfo.deleteSavedWorkout} >
                                <Ionicons name='close-circle-outline' color='#fd1c47' size={72}/>
                            </Pressable>
                        </View>

                        <Pressable onPress={workoutActions.forwardButton} style={tw`${savedWorkoutInfo.viewSavedWorkoutNumberOfExercises === 1 ? 'hidden' : ''}`}>
                            <Ionicons name='chevron-forward-circle-outline' color='#3b82f6' size={72}/>
                        </Pressable>
                    </View>
                </View>
            ) : 
            /* Workout: AddWorkout */
            currentPage === 'Add-Workout' ? (
                <View style={tw`flex flex-col w-full`}>
                    <View style={tw`w-full h-16 flex gap-y-2 flex-row justify-between absolute bottom-18`}>
                        <Pressable style={tw`w-[49%] bg-blue-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={workoutActions.addSetButton}>
                            <Text style={tw`text-white font-medium text-xl`}>+ {t(`set`)}</Text>
                        </Pressable>
                        <Pressable style={tw`w-[49%] bg-green-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={workoutActions.addWorkoutButton}>
                            <Text style={tw`text-white font-medium text-xl`}>{t(`done`)}</Text>
                        </Pressable>
                    </View>

                    <View style={tw`w-full flex flex-row justify-around`}>
                        <Pressable onPress={workoutActions.backButton} style={tw`${workoutActions.viewWorkoutNumberOfExercises === 1 ? 'hidden' : 'flex'}`}>
                            <Ionicons name='chevron-back-circle-outline' color='#fd1c47' size={72}/>
                        </Pressable>

                        <View style={tw`mt-[6px] w-[60px] h-[60px] border-[5px] border-[#fd1c47] rounded-[30px] flex items-center justify-center`}>
                            <Text style={tw`text-[#fd1c47] font-bold text-2xl`}>{workoutActions.addWorkoutPageCurrentExercise}</Text>
                        </View>
                        
                        <Pressable onPress={workoutActions.forwardButton} style={tw`${workoutActions.viewWorkoutNumberOfExercises === 1 ? 'hidden' : 'flex'}`}>
                            <Ionicons name='chevron-forward-circle-outline' color='#fd1c47' size={72}/>
                        </Pressable>
                    </View>
                </View>
            ) : 
            // --- Food-related Navigation ---
            /* Food: FoodDay */
            currentPage === "Food-Day" ? (
                <View style={tw`flex flex-row justify-around w-full items-center`}>
                    <Pressable onPress={() => navigation.navigate("Add-Custom-Food", { date: foodActions.foodDayDate })}>
                        <Ionicons name="add-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate("Scan-Food", { date: foodActions.foodDayDate })}>
                        <Ionicons name="scan-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={() => {
                        if (!internetConnected) {return;}
                        navigation.navigate("Add-Food", { date: foodActions.foodDayDate })
                    }}>
                        <Ionicons name="search-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>
                </View>
            ) : 
            /* Food: AddCustomFoodPage */
            currentPage === "Add-Custom-Food" ? (
                <View style={tw`flex items-center justify-center`}>
                    <Pressable onPress={foodActions.addCustomFoodPageAddFood}>
                        <Text style={tw`text-4xl font-semibold text-red-500`}>{t('add')}</Text>
                    </Pressable>
                </View>
            ) : 
            /* Food: AddFoodPage */
            currentPage === "Add-Food" ? (
                <View style={tw`flex flex-row justify-around w-full`}>
                    <Pressable onPress={foodActions.clearSearchFoodSuggestionList}>
                        <Ionicons name="refresh-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={foodActions.displayFoods}>
                        <Ionicons name="search-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>  
                </View>
            ) : 
            /* Food: AddFoodPageEditFood */
            currentPage === "Add-Food-Details" ? (
                <View style={tw`flex flex-row justify-around w-full`}>
                    <Pressable onPress={foodActions.addFoodPageAddButton}>
                        <Text style={tw`text-red-500 font-semibold text-4xl`}>{t('add-food')}</Text>
                    </Pressable> 
                </View>
            ) : 
            // --- Workouts List & Selection Navigation ---
            /* Workouts: Workouts List */
            currentPage === 'Workouts' ? (
                <View>
                    {selectionActions.selectionMode === false ? (
                        <View style={tw`flex flex-row justify-around items-center w-full h-full`}>

                            <Pressable onPress={async () => {
                                const limitReachedTotal = await checkWorkoutsCountTotal();

                                if (limitReachedTotal) {
                                    alert('You cannot add more than 30 workouts in total!')
                                    return;
                                }

                                navigation.navigate('Add-Workout', {folder: undefined});
                            }}>
                                <Ionicons name="add-circle-outline" size={72} color="#fd1c47"/>
                            </Pressable>
        
                            <Pressable onPress={folderActions.addEmptyFolder}>
                                <Ionicons name="folder-open-outline" size={72} color="#fd1c47"/>
                            </Pressable>
                            
                            <Pressable style={tw`w-15 h-15 border-4 border-[#fd1c47] rounded-full flex items-center justify-center`}
                                onPress={() => {

                                    if (workoutActions.currentlyGeneratingWorkout) {
                                        return;
                                    }

                                    if (internetConnected) {
                                        navigation.navigate('Generate-Workout');
                                    }
                                }}
                            >
                                <Ionicons name="flash-outline" size={40} color="#fd1c47"/>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={tw`flex flex-row justify-around items-center w-full h-full`}>
                            <Pressable onPress={selectionActions.cutSelectedWorkouts}>
                                <Ionicons name="cut-outline" size={72} color="#fd1c47"/>
                            </Pressable>

                            <Pressable onPress={selectionActions.deleteSelectedWorkouts}>
                                <Ionicons name="trash-outline" size={72} color="#fd1c47"/>
                            </Pressable>

                            <Pressable onPress={selectionActions.copySelectedWorkouts}>
                                <Ionicons name="copy-outline" size={72} color="#fd1c47"/>
                            </Pressable>
                        </View>
                    )}
                </View>
            ) : 
            /* Workouts: ViewWorkout */
            currentPage === 'View-Workout' ? (
                <View style={tw`flex flex-col w-full`}>
                    <View style={tw`w-full h-16 flex gap-y-2 flex-row justify-between absolute bottom-18`}>
                        <Pressable style={tw`w-[49%] bg-blue-500 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={workoutActions.addSetButton}>
                            <Text style={tw`text-white font-medium text-xl`}>+ {t(`set`)}</Text>
                        </Pressable>
                       
                        <Pressable style={tw`w-[49%] bg-yellow-400 h-12 rounded-lg shadow-md flex items-center justify-center`} onPress={workoutActions.viewWorkoutAddExercise}>
                            <Text style={tw`text-white font-medium text-xl`}>+ {t('exercise')}</Text>
                        </Pressable>
                    </View>

                    <View style={tw`w-full flex flex-row ${workoutActions.viewWorkoutNumberOfExercises === 1 ? 'justify-around' : 'justify-around'}`}>
                        <Pressable onPress={workoutActions.backButton} style={tw`${workoutActions.viewWorkoutNumberOfExercises === 1 ? 'hidden' : 'flex'}`}>
                            <Ionicons name='chevron-back-circle-outline' color='#3b82f6' size={72}/>
                        </Pressable>
                        <Pressable onPress={workoutActions.startWorkout} style={tw``}>
                            <Ionicons name='play-circle-outline' color='#22c55e' size={72}/>
                        </Pressable>
                        <Pressable onPress={workoutActions.saveViewWorkoutChanges} style={tw``}>
                            <Ionicons name='checkmark-circle-outline' color='#fbbf24' size={72}/>
                        </Pressable>
                        
                        <Pressable onPress={workoutActions.forwardButton} style={tw`${workoutActions.viewWorkoutNumberOfExercises === 1 ? 'hidden' : 'flex'}`}>
                            <Ionicons name='chevron-forward-circle-outline' color='#3b82f6' size={72}/>
                        </Pressable>
                    </View>
                </View>
            ) : 
            // --- Friends-related Navigation ---
            /* Friends: FriendsList */
            currentPage === 'Friends' ? (
                <View style={tw`flex flex-row justify-around w-full items-center`}>
                    <Pressable onPress={() => navigation.navigate('Friend-Requests-Sent', {username: friendActions.friendsListUsername})}>
                        <Ionicons name="navigate-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('Add-Friends', {username: friendActions.friendsListUsername})}>
                        <Ionicons name="add-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('Friend-Requests-Recieved', {username: friendActions.friendsListUsername})}>
                        <Ionicons name="notifications-circle-outline" size={72} color="#fd1c47"/>
                    </Pressable>
                </View>
            ) : 
            /* Friends: ViewFriendProfile */
            /*currentPage === "View-Friend-Profile" ? (
                <View>
                    <Pressable onPress={friendActions.removeFriend}>
                        <Ionicons name='trash-outline' color='#fd1c47' size={64}/>
                    </Pressable>
                </View>
            ) : */
            // --- Food Info Navigation ---
            currentPage === "Food-Info" ? (
                <View>
                    <Pressable onPress={foodActions.deleteFood}>
                        <Ionicons name='trash-outline' color='#fd1c47' size={64}/>
                    </Pressable>
                </View>
            ) : 
            // --- Settings-related Navigation ---
            /* Settings: Macronutrients */
            currentPage === "Settings-Macronutrients" ? (
                <View>
                    <Pressable onPress={settingsActions.saveSettingsMacrosButton}>
                        <Text style={tw`text-red-500 font-semibold text-4xl`}>{t('save')}</Text>
                    </Pressable>
                </View>
            ) : 
            // --- Folder-related Navigation ---
            /* Folder: Folder View */
            currentPage === "Workout-Folder" ? (
                <View>
                    {selectionActions.selectionMode === false ? (
                        <View style={tw`flex flex-row justify-around items-center w-full h-full`}>
                            <Pressable onPress={async () => {
                                const limitReachedFolder = await checkWorkoutsCountFolder(folderActions.folder?.id)
                                const limitReachedTotal = await checkWorkoutsCountTotal();
                                
                                if (limitReachedFolder) {
                                    alert('You cannot add any more workouts in this folder!')
                                    return;
                                }else if (limitReachedTotal) {
                                    alert('You cannot add more than 30 workouts in total!')
                                    return;
                                }

                                navigation.navigate("Add-Workout", {folder: folderActions.folder})
                            }}>
                                <Ionicons name="add-circle-outline" size={72} color="#fd1c47"/>
                            </Pressable>

                            <Pressable onPress={folderActions.deleteFolder}>
                                <Ionicons name="trash-bin-outline" size={72} color="#fd1c47"/>
                            </Pressable>
                            
                            <Pressable style={tw`w-15 h-15 border-4 border-[#fd1c47] rounded-full flex items-center justify-center`}
                                onPress={() => navigation.navigate('Generate-Workout', {folder: folderActions.folder})}
                            >
                                <Ionicons name="flash-outline" size={40} color="#fd1c47"/>
                            </Pressable>
                        </View>
                    ) : (
                        <View style={tw`flex flex-row justify-around items-center w-full h-full`}>
                            <Pressable onPress={selectionActions.cutSelectedWorkoutsInFolder}>
                                <Ionicons name="cut-outline" size={72} color="#fd1c47"/>
                            </Pressable>

                            <Pressable onPress={selectionActions.deleteSelectedWorkoutsInFolder}>
                                <Ionicons name="trash-outline" size={72} color="#fd1c47"/>
                            </Pressable>

                            <Pressable onPress={selectionActions.copySelectedWorkoutsInFolder}>
                                <Ionicons name="copy-outline" size={72} color="#fd1c47"/>
                            </Pressable>
                        </View>
                    )}
                </View>
            ) : (
                <View style={tw`flex flex-row justify-around items-center w-full h-full`}>
                    {Button({currentPage, navigation, icon: 'home-outline', navigationPage: 'Main', goalPage: 'Main'})}
                    {Button({currentPage, navigation, icon: 'fitness-outline', navigationPage: 'Workouts', goalPage: 'Workouts'})}
                    {Button({currentPage, navigation, icon: 'calendar-clear-outline', navigationPage: 'Food', goalPage: 'Food'})}
                    {Button({currentPage, navigation, icon: 'settings-outline', navigationPage: 'Settings', goalPage: 'Settings'})}
                </View>
            )}
        </View>
    )
}

export default BottomNavigationBar