import { View, Text, FlatList, Pressable, Alert, ActivityIndicator } from 'react-native'  
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import { collection, doc, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Workout } from '../../interfaces';
import Ionicons from '@expo/vector-icons/Ionicons'
import BottomNavigationBar from '../components/BottomNavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getWorkoutInfoLocally from '../useWorkout/useGetWorkoutInfoLocally';
import getEmail from '../use/useGetEmail';
import { useFocusEffect } from '@react-navigation/native';
import GlobalContext from '../../GlobalContext';
import { copySelectedWorkouts, cutSelectedWorkouts, deleteSelectedWorkouts, pasteCopiedWorkouts, pasteCutWorkouts } from '../useWorkout/handleSelectionMode';
import PasteWorkoutsModal from '../modals/PasteWorkoutsModal';
import { BlurView } from 'expo-blur';
import GeneratingWorkoutAnimationModal from '../modals/GeneratingWorkoutAnimationModal';

const Workouts = ({navigation}: any) => {

    const [initialLoad, setInitialLoad] = useState(true);

    const { internetConnected, generatingWorkoutInFolder, generatingWorkout } = useContext(GlobalContext);

    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [firebaseWorkouts, setFirebaseWorkouts] = useState<Workout[]>([]);
    const [folders, setFolders] = useState<any[]>([]);
    const [viewWorkoutButtonDisabled, setViewWorkoutButtonDisabled] = useState(false);

    const [userWorkoutsCollectionRef, setUserWorkoutsCollectionRef] = useState<any>();

    const addEmptyFolder = async () => {

        let folderTitle = "New Folder"
        const currentLanguage = await AsyncStorage.getItem('language')
        if (currentLanguage == "bg") {
            folderTitle = "Нова Папка"
        }
        else if (currentLanguage == "de") {
            folderTitle = "Neuer Ordner"

        }else if (currentLanguage == "ru") {
            folderTitle = "Новая папка"
        }

        try {
            const email = await getEmail();
            if (!email) return;
    
            const newFolder = {
                id: `folder_${Date.now()}`,
                title: folderTitle,
                type: 'folder',
                workouts: []
            };
    
            const data = await AsyncStorage.getItem(`folders_${email}`);
            let folders = data ? JSON.parse(data) : [];
    
            folders.push(newFolder);
    
            await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(folders));
            console.log('New folder added');
            setFolders(folders); // Update state with new folders
        } catch (err) {
            console.error(err);
        }
    };

    const getFoldersLocally = async () => {
        try {
            const email = await getEmail();
            if (!email) return;
    
            const data = await AsyncStorage.getItem(`folders_${email}`);
            let folders = data ? JSON.parse(data) : [];
    
            setFolders(folders); // Update state with fetched folders
        } catch (err) {
            console.error(err);
        }
    }

    const getWorkoutsLocally = async () => {

        try {
            const email = await getEmail();
            if (!email) return;
    
            const data = await AsyncStorage.getItem(`workouts_${email}`);
            let workouts = data ? JSON.parse(data) : [];
    
            workouts = workouts.reverse();
    
            setWorkouts(workouts);
            
        } catch (err) {
            console.error(err);
        }
    };

    const getWorkouts = async () => {
        const usersCollectionRef = collection(FIRESTORE_DB, "users");
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

        const userWorkoutsSnapshot = await getDocs(userWorkoutsCollectionRef);
        const userWorkoutsData = userWorkoutsSnapshot.docs.map(doc => doc.data() as Workout);

        setFirebaseWorkouts(userWorkoutsData);
    }

    useFocusEffect(
        useCallback(() => {
            if (!initialLoad) {
                setTimeout(() => {
                    getWorkoutsLocally();
                    getFoldersLocally();
                    getWorkouts();


                    if (internetConnected) {
                        const usersCollectionRef = collection(FIRESTORE_DB, "users");
                        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
                        const userWorkoutsCollectionRef = collection(userDocRef, "workouts");
                        setUserWorkoutsCollectionRef(userWorkoutsCollectionRef);
                    }

                }, 100)
            }else{
                getWorkoutsLocally();
                getFoldersLocally();
                setInitialLoad(false);
            }
            
        }, [workouts])
    );

    const viewWorkout = async (workout: Workout) => {
        setViewWorkoutButtonDisabled(true);

        const workoutInfo = await getWorkoutInfoLocally(workout.id);
        if (workoutInfo) {
            const { exercisesData, workoutTitle } = workoutInfo;
            navigation.navigate('Тренировка-Детайли', {exercises: exercisesData, workoutTitle: workoutTitle, workout: workout});
        }

        setTimeout(() => {
            setViewWorkoutButtonDisabled(false);
            console.log('button enabled')
        }, 500);
    }

    const getInitials = (name: string) => {
        const dayMatch = name.match(/^Day (\d) - /);
        if (dayMatch && dayMatch[1] >= '1' && dayMatch[1] <= '8') {
            return `D${dayMatch[1]}`;
        }
        return name.split(' ').map(word => word[0]).join('').substring(0, 3).toUpperCase().replace(/[^a-zA-Z0-9]$/, '');
    }

    const [selectedWorkouts, setSelectedWorkouts] = useState<any>([])
    const [selectionMode, setSelectionMode] = useState(false)

    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            if (selectedWorkouts.length === 0) {
                setSelectionMode(false);
                //console.log('selection mode disabled');
            }
        }
    }, [selectedWorkouts]);

    const renderWorkout = (workout: Workout) => {

        if (workout.title.includes("Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($")){
            return (
                <Pressable style={
                    tw`w-full h-24 bg-white border border-gray-200 shadow-sm rounded-2xl mr-2 mb-2 py-2 px-3
                    ${selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id) ? 'border-2 border-red-300' : 'border border-gray-200'}
                    `
                }
                    onLongPress={() => {
                        if (selectedWorkouts.length === 0) {
                            // add the workout to selectedWorkouts and set selection mode to true as this is the first workout being selected
                            console.log('selection mode on')
                            setSelectedWorkouts([...selectedWorkouts, workout]);
                            setSelectionMode(true)
                        }
                    }} 

                    onPress={() => {
                        if (selectionMode) {
                            // add the workout to the selectedWorkouts list
                            setSelectedWorkouts((prevSelectedWorkouts: any) => {
                                if (prevSelectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id)) {
                                    return prevSelectedWorkouts.filter((selectedWorkout: any) => selectedWorkout.id !== workout.id);
                                } else {
                                    return [...prevSelectedWorkouts, workout];
                                }
                            });
                        }
                    }} 
                >
                    <View style={tw`flex flex-row justify-between`}>
                        <View style={tw`flex-1 flex-row`}>
                            <View style={tw`h-full py-3`}>
                                <View style={tw`w-14 h-full rounded-md bg-[#67e8f9] flex items-center justify-center`}>
                                    <Ionicons name='cloud' size={38} color='white'/>
                                </View>
                            </View>
                            
                            <View style={tw`flex flex-col ml-3 justify-center w-full`}>
                                <Text style={tw`text-xl font-medium w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>
                                    Rest Day
                                </Text>
    
                                <Text style={tw`text-lg font-medium text-gray-500 w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>You can take a break today!</Text>
                            </View>
                        </View>
    
                    </View>
                </Pressable>
            )
        }else{
            return (
                <Pressable style={tw`w-full h-24 bg-white ${selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id) ? 'border-2 border-red-300' : 'border border-gray-200'} shadow-sm rounded-2xl mr-2 mb-2 py-2 px-3`} 
                    key={workout.id} disabled={viewWorkoutButtonDisabled} 
                    onPress={() => {
                        if (!selectionMode) {
                            viewWorkout(workout)
                        }else{
                            // add the workout to the selectedWorkouts list
                            setSelectedWorkouts((prevSelectedWorkouts: any) => {
                                if (prevSelectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id)) {
                                    return prevSelectedWorkouts.filter((selectedWorkout: any) => selectedWorkout.id !== workout.id);
                                } else {
                                    return [...prevSelectedWorkouts, workout];
                                }
                            });
                        }
                    }} 
                    onLongPress={() => {
                        if (selectedWorkouts.length === 0) {
                            // add the workout to selectedWorkouts and set selection mode to true as this is the first workout being selected
                            console.log('selection mode on')
                            setSelectedWorkouts([...selectedWorkouts, workout]);
                            setSelectionMode(true)
                        }
                    }} 
                >
                    <View style={tw`flex flex-row justify-between`}>
                        <View style={tw`flex-1 flex-row`}>
                            <View style={tw`h-full py-3`}>
                                <View style={tw`w-14 h-full rounded-md bg-${workout.colour} flex items-center justify-center`}>
                                    <Text style={tw`text-xl font-medium text-white`}>{getInitials(workout.title)}</Text>
                                </View>
                            </View>
                            
                            <View style={tw`flex flex-col ml-3 justify-center w-full`}>
                                <Text style={tw`text-xl font-medium w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>
                                    {workout.title}
                                </Text>
    
                                <Text style={tw`text-lg font-medium text-gray-500 w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>{workout.numberOfExercises} {workout.numberOfExercises === 1 ? t('exercise') : t('exercises')}</Text>
                            </View>
                        </View>
    
                        <View style={tw`flex justify-center`}>
                            <Ionicons name='chevron-forward' size={36} color='#9ca3af'/>
                        </View>
                    </View>
                </Pressable>
            )
        }
    }

    const renameFolder = async (folderID: string) => {
        Alert.prompt(
            t('new-name-alert'),
            '',
            async (newName) => {
                if (newName && newName.length <= 50) {
                    try {
                        const email = await getEmail();
                        if (!email) return;
    
                        const data = await AsyncStorage.getItem(`folders_${email}`);
                        let folders = data ? JSON.parse(data) : [];
    
                        const folderIndex = folders.findIndex((folder: any) => folder.id === folderID);
                        if (folderIndex !== -1) {
                            folders[folderIndex].title = newName;
                            await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(folders));
                            setFolders(folders); // Update state with new folders
                        }
                    } catch (err) {
                        console.error(err);
                    }
                } else {
                    Alert.alert(t('folder-characters-alert'), '', [
                        {
                            text: 'OK',
                            style: 'cancel',
                        },
                    ]);
                }
            },
            'plain-text',
            ''
        );
    };

    const renderFolder = (folder: any) => {
        return (
            <Pressable style={tw`w-full h-24 bg-white border border-gray-200 shadow-sm rounded-2xl mr-2 mb-2 py-2 px-3`} 
                onPress={() => {
                    if (!selectionMode) {
                        navigation.navigate('Папка', {folderId: folder.id});
                    }
                }} 
                onLongPress={() => {
                    if (generatingWorkout) return
                    renameFolder(folder.id);
                }}
            >
                <View style={tw`flex flex-row justify-between`}>
                    <View style={tw`flex-1 flex-row`}>
                        <View style={tw`h-full py-3`}>
                            <View style={tw`w-14 h-full rounded-md bg-yellow-300 flex items-center justify-center`}>
                                <Ionicons name='folder' size={32} color='white'/>
                            </View>
                        </View>
                        
                        <View style={tw`flex flex-col ml-3 justify-center w-full`}>
                            <Text style={tw`text-xl font-medium w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>{folder.title}</Text>
                            <Text style={tw`text-lg font-medium text-gray-500 w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>{folder.workouts.length} {folder.workouts.length === 1 ? t('workout') : t('workouts')}</Text>
                        </View>
                    </View>

                    
                </View>
            </Pressable>
        )
    }

    const { t } = useTranslation();

    const combinedData = [...folders, ...workouts];

    const deleteWorkouts = () => {
        deleteSelectedWorkouts(selectedWorkouts, setWorkouts, setSelectedWorkouts, setSelectionMode, firebaseWorkouts, internetConnected, userWorkoutsCollectionRef);
        setSelectedWorkouts([]);
    }

    const cutWorkouts = () => {
        cutSelectedWorkouts(selectedWorkouts, setWorkouts, setSelectedWorkouts, setSelectionMode, firebaseWorkouts, internetConnected, userWorkoutsCollectionRef);
        setSelectedWorkouts([]);
    }

    const copyWorkouts = () => {
        copySelectedWorkouts(selectedWorkouts);
        setSelectionMode(false);
        setSelectedWorkouts([]);
    }

    const pasteCutWorkoutsFunc = () => {
        pasteCutWorkouts(setWorkouts);
    }

    const pasteCopiedWorkoutsFunc = () => {
        pasteCopiedWorkouts();
    }

    const [isPasteWorkoutsModalVisible, setIsPasteWorkoutsModalVisible] = useState(false)
    const [isGeneratingWorkoutAnimationModalVisible, setIsGeneratingWorkoutAnimationModalVisible] = useState(false);

    useEffect(() => {
        
        if (!generatingWorkout) {
            setIsGeneratingWorkoutAnimationModalVisible(false)
        }

    }, [generatingWorkout])

    return (
        <>

            { (isPasteWorkoutsModalVisible || isGeneratingWorkoutAnimationModalVisible) && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <View style={tw`w-full h-full bg-neutral-50`}>

                <PasteWorkoutsModal
                    isPasteWorkoutsModalVisible={isPasteWorkoutsModalVisible}
                    setIsPasteWorkoutsModalVisible={setIsPasteWorkoutsModalVisible}
                    navigation={navigation}
                    pasteCopiedWorkouts={pasteCopiedWorkoutsFunc}
                    pasteCutWorkouts={pasteCutWorkoutsFunc}
                />

                <GeneratingWorkoutAnimationModal

                    isGeneratingWorkoutAnimationModalVisible={isGeneratingWorkoutAnimationModalVisible}
                    setIsGeneratingWorkoutAnimationModalVisible={setIsGeneratingWorkoutAnimationModalVisible}
                    generatingWorkoutInFolder={generatingWorkoutInFolder}
                    
                />

                <Pressable style={tw`bg-gray-100 h-[15%] w-full flex justify-end`} onPress={() => setIsPasteWorkoutsModalVisible(true)}>
                    <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`text-4xl font-medium text-black m-3`}>{t('workouts')}</Text>

                        {(generatingWorkout) &&  (
                            <Pressable style={tw`w-12 h-12 mr-3 mt-3`} onPress={() => {
                                setIsPasteWorkoutsModalVisible(false)
                                setIsGeneratingWorkoutAnimationModalVisible(true)
                            }}>
                                <ActivityIndicator size="large" color="#fd1c47"/>
                            </Pressable>
                        )}
                        
                        
                    </View>
                </Pressable>

                <View style={tw`w-[96%] h-[71%] mt-4 mx-2`}>
                    <FlatList
                        data={combinedData}
                        renderItem={({item}: any) => item.type === 'folder' ? renderFolder(item) : renderWorkout(item)}
                        keyExtractor={(item: any) => item.id}
                        ListEmptyComponent={() => (
                            <View style={tw``}>
                                <Text style={tw`text-2xl font-medium text-gray-500 text-center`}>{t('no-workouts-added')}</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <BottomNavigationBar currentPage='Workouts' copySelectedWorkouts={copyWorkouts} deleteSelectedWorkouts={deleteWorkouts} cutSelectedWorkouts={cutWorkouts} selectionMode={selectionMode} internetConnected={internetConnected} addEmptyFolder={addEmptyFolder} navigation={navigation}/>
            </View>
        </>
    )
}

export default Workouts

 /*const changeWorkoutName = async (workoutID: string, workoutTitle: string) => {
        Alert.prompt(
            t('new-name-alert'),
            '',
            (newName) => {
                if (newName && newName.length <= 50) {
                    const usersCollectionRef = collection(FIRESTORE_DB, "users");
                    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
                    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

                    updateDoc(doc(userWorkoutsCollectionRef, workoutID), {
                        title: newName,
                    });
                    
                    } else {
                    Alert.alert(t('workout-characters-alert'), '', [
                        {
                        text: 'OK',
                        style: 'cancel',
                        },
                    ]);
                }
            },
            'plain-text',
            workoutTitle
        );
    }*/