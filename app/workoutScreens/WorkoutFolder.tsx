import { View, Text, Pressable, FlatList, Alert } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '../components/BottomNavigationBar';
import getEmail from '../use/useGetEmail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../../interfaces';
import getWorkoutInfoLocally from '../useWorkout/useGetWorkoutInfoLocally';
import { BlurView } from 'expo-blur';
import { copySelectedWorkoutsInFolder, cutSelectedWorkoutsInFolder, deleteSelectedWorkoutsInFolder, pasteCopiedWorkoutsInFolder, pasteCutWorkoutsInFolder } from '../useWorkout/handleSelectionModeForFolders';
import PasteWorkoutsInFolderModal from '../modals/PasteWorkoutsInFolderModal';
import { useFocusEffect } from '@react-navigation/native';
import GlobalContext from '../../GlobalContext';
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';

const WorkoutFolder = ({ route, navigation }: any) => {
    const { folderId } = route.params;
    const { t } = useTranslation();

    const [folder, setFolder] = useState<any>(null);
    const [viewWorkoutButtonDisabled, setViewWorkoutButtonDisabled] = useState(false);
    const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]);
    const [selectionMode, setSelectionMode] = useState(false);
    const [isPasteWorkoutsInFolderModalVisible, setIsPasteWorkoutsInFolderModalVisible] = useState(false);

    const [userWorkoutsCollectionRef, setUserWorkoutsCollectionRef] = useState<any>();

    const {internetConnected} = useContext(GlobalContext)

    const fetchFolderDetails = async () => {
        try {
            const email = await getEmail();
            if (!email) return;

            const data = await AsyncStorage.getItem(`folders_${email}`);
            let folders = data ? JSON.parse(data) : [];

            const folderDetails = folders.find((f: any) => f.id === folderId);
            setFolder(folderDetails);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchFolderDetails();
    }, [folder]);

    useFocusEffect(
        useCallback(() => {
            if (internetConnected) {
                    // set the firebase path to the workouts so it can be passed to functions faster
                    const usersCollectionRef = collection(FIRESTORE_DB, "users");
                    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
                    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");
                    setUserWorkoutsCollectionRef(userWorkoutsCollectionRef);

                    // get the workouts from firebase
                    getWorkouts();
                } 
            }, [])
    );

    const getInitials = (name: string) => {
        const dayMatch = name.match(/^Day (\d) - /);
        if (dayMatch && dayMatch[1] >= '1' && dayMatch[1] <= '8') {
            return `D${dayMatch[1]}`;
        }
        return name.split(' ').map(word => word[0]).join('').substring(0, 3).toUpperCase();
    };

    const deleteFolder = async () => {
        console.log('Deleting folder: ', folder);

        try {
            const email = await getEmail();
            if (!email) return;

            const data = await AsyncStorage.getItem(`folders_${email}`);
            let folders = data ? JSON.parse(data) : [];

            folders = folders.filter((f: any) => f.id !== folder.id);

            await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(folders));
            navigation.goBack();
        } catch (err) {
            console.error(err);
        }

        // delete firebase items as well
        if (internetConnected) {
            try {
                const usersCollectionRef = collection(FIRESTORE_DB, "users");
                const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
                const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

                for (const workout of folder.workouts) {
                    const workoutDocRef = doc(userWorkoutsCollectionRef, workout.id);
                    await deleteDoc(workoutDocRef);
                }

                console.log('Folder deleted from Firebase');
            } catch (err) {
                console.error(err);
            }
        }
    };

    const viewWorkout = async (workout: Workout) => {
        setViewWorkoutButtonDisabled(true);

        const workoutInfo = await getWorkoutInfoLocally(workout.id, folder);
        if (workoutInfo) {
            const { exercisesData, workoutTitle } = workoutInfo;
            navigation.navigate('Тренировка-Детайли', { exercises: exercisesData, workoutTitle: workoutTitle, workout: workout, folder: folder });
        }

        setTimeout(() => {
            setViewWorkoutButtonDisabled(false);
            console.log('button enabled');
        }, 500);
    };

    useEffect(() => {
        if (selectedWorkouts.length === 0) {
            setSelectionMode(false);
            console.log('selection mode disabled');
        }
    }, [selectedWorkouts]);

    const renderWorkout = ({ item: workout }: { item: Workout }) => {
        if (workout.title.includes("Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($")) {
            return (
                <Pressable style={tw`w-full h-24 bg-white border border-gray-200 shadow-sm rounded-2xl mr-2 mb-2 py-2 px-3
                    ${selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id) ? 'border-2 border-red-300' : 'border border-gray-200'}
                `}
                    onLongPress={() => {
                        if (selectedWorkouts.length === 0) {
                            console.log('selection mode on');
                            setSelectedWorkouts([...selectedWorkouts, workout]);
                            setSelectionMode(true);
                        }
                    }}
                    onPress={() => {
                        if (selectionMode) {
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
                                    <Ionicons name='cloud' size={38} color='white' />
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
            );
        } else {
            return (
                <Pressable style={tw`w-full h-24 bg-white border border-gray-200 shadow-sm rounded-2xl mr-2 mb-2 py-2 px-3
                    ${selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id) ? 'border-2 border-red-300' : 'border border-gray-200'}
                    `}
                    key={workout.id} disabled={viewWorkoutButtonDisabled}
                    onPress={() => {
                        if (!selectionMode) {
                            viewWorkout(workout);
                        } else {
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
                            console.log('selection mode on');
                            setSelectedWorkouts([...selectedWorkouts, workout]);
                            setSelectionMode(true);
                        }
                    }}
                >
                    <View style={tw`flex flex-row justify-between`}>
                        <View style={tw`flex-1 flex-row`}>
                            <View style={tw`h-full py-3`}>
                                <View style={tw`w-14 h-full rounded-md bg-${workout.colour} flex items-center justify-center`}>
                                    <Text style={tw`text-xl font-medium text-white`}>{workout.previousTitle ? getInitials(workout.previousTitle) : getInitials(workout.title)}</Text>
                                </View>
                            </View>

                            <View style={tw`flex flex-col ml-3 justify-center w-full`}>
                                <Text style={tw`text-xl font-medium w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>
                                    {workout.title}
                                </Text>

                                <Text style={tw`text-lg font-medium text-gray-500 w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>{workout.numberOfExercises} {workout.numberOfExercises === 1 ? t('exercise-djhjd') : t('exercises-rhahsgdg')}</Text>
                            </View>
                        </View>

                        <View style={tw`flex justify-center`}>
                            <Ionicons name='chevron-forward' size={36} color='black' />
                        </View>
                    </View>
                </Pressable>
            );
        }
    };

    const [firebaseWorkouts, setFirebaseWorkouts] = useState<Workout[]>([]);

    const getWorkouts = async () => {
        const usersCollectionRef = collection(FIRESTORE_DB, "users");
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

        const userWorkoutsSnapshot = await getDocs(userWorkoutsCollectionRef);
        const userWorkoutsData = userWorkoutsSnapshot.docs.map(doc => doc.data() as Workout);

        setFirebaseWorkouts(userWorkoutsData);
    }

    const deleteWorkouts = () => {
        deleteSelectedWorkoutsInFolder(selectedWorkouts, folder.id, setSelectedWorkouts, setSelectionMode, firebaseWorkouts, internetConnected, userWorkoutsCollectionRef);
        setSelectedWorkouts([]);
    };

    const cutWorkouts = () => {
        cutSelectedWorkoutsInFolder(selectedWorkouts, folder.id, setSelectedWorkouts, setSelectionMode, firebaseWorkouts, internetConnected, userWorkoutsCollectionRef);
        setSelectedWorkouts([]);
    };

    const copyWorkouts = () => {
        copySelectedWorkoutsInFolder(selectedWorkouts);
        setSelectionMode(false);
        setSelectedWorkouts([]);
    };

    const pasteCutWorkoutsFunc = () => {
        pasteCutWorkoutsInFolder(folder.id);
    };

    const pasteCopiedWorkoutsFunc = () => {
        pasteCopiedWorkoutsInFolder(folder.id);
    };

    

    return (
        <>
            {isPasteWorkoutsInFolderModalVisible && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <View style={tw`w-full h-full bg-neutral-50`}>
                <PasteWorkoutsInFolderModal
                    isPasteWorkoutsInFolderModalVisible={isPasteWorkoutsInFolderModalVisible}
                    setIsPasteWorkoutsInFolderModalVisible={setIsPasteWorkoutsInFolderModalVisible}
                    navigation={navigation}
                    pasteCopiedWorkouts={pasteCopiedWorkoutsFunc}
                    pasteCutWorkouts={pasteCutWorkoutsFunc}
                />

                <Pressable style={tw`bg-gray-100 h-[15%] w-full flex justify-end`} onPress={() => setIsPasteWorkoutsInFolderModalVisible(true)}>
                    <Text style={tw`text-4xl font-medium text-black m-3`}>{folder?.title}</Text>
                </Pressable>

                <View style={tw`w-full h-[73%] p-3`}>
                    <FlatList
                        data={folder?.workouts}
                        renderItem={renderWorkout}
                        keyExtractor={(item: any) => item.id}
                        ListEmptyComponent={() => (
                            <View style={tw``}>
                                <Text style={tw`text-2xl font-medium text-gray-500 ml-3`}>No workouts available</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <BottomNavigationBar
                    navigation={navigation}
                    folder={folder}
                    currentPage='Folder'
                    deleteFolder={deleteFolder}
                    selectionMode={selectionMode}
                    copySelectedWorkoutsInFolder={copyWorkouts}
                    cutSelectedWorkoutsInFolder={cutWorkouts}
                    deleteSelectedWorkoutsInFolder={deleteWorkouts}
                />
            </View>
        </>
    );
};

export default WorkoutFolder;