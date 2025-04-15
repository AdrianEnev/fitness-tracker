import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '@components/BottomNavigationBar';
import getEmail from '@use/settings/get/useGetEmail'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '@config/interfaces';
import getWorkoutInfoLocally from '@use/workouts/get/useGetWorkoutInfoLocally';
import { BlurView } from 'expo-blur';
import { copySelectedWorkoutsInFolder, cutSelectedWorkoutsInFolder, deleteSelectedWorkoutsInFolder, pasteCopiedWorkoutsInFolder, pasteCutWorkoutsInFolder } from '@use/workouts/handlers/handleSelectionModeForFolders';
import PasteWorkoutsInFolderModal from '@modals/workouts/PasteWorkoutsInFolderModal';
import GlobalContext from '@config/GlobalContext';
import GeneratingWorkoutAnimationModal from '@modals/workouts/GeneratingWorkoutAnimationModal';
import deleteFolder from '@app/use/workouts/delete/deleteFolder';
import RenderFolderWorkout from '@app/components/workouts/RenderFolderWorkout';

const WorkoutFolder = ({ route, navigation }: any) => {

    const { folderId } = route.params;
    const { t } = useTranslation();

    const [folder, setFolder] = useState<any>(null);
    const [viewWorkoutButtonDisabled, setViewWorkoutButtonDisabled] = useState(false);
    const [selectedWorkouts, setSelectedWorkouts] = useState<any[]>([]);
    const [selectionMode, setSelectionMode] = useState(false);

    const { internetConnected, generatingWorkout, generatingWorkoutInFolder } = useContext(GlobalContext)

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

    const renderWorkout = ({item}: any) => {
        //viewWorkoutButtonDisabled={viewWorkoutButtonDisabled}
        //disabled={viewWorkoutButtonDisabled}
        return <RenderFolderWorkout item={item} selectedWorkouts={selectedWorkouts} viewWorkoutButtonDisabled={viewWorkoutButtonDisabled} setSelectedWorkouts={setSelectedWorkouts} setSelectionMode={setSelectionMode} selectionMode={selectionMode} viewWorkout={viewWorkout} t={t} />
    }

    const viewWorkout = async (workout: Workout) => {

        setViewWorkoutButtonDisabled(true);

        const workoutInfo = await getWorkoutInfoLocally(workout.id, folder);

        if (workoutInfo) {
            const { exercisesData, workoutTitle } = workoutInfo;
            navigation.navigate('Тренировка-Детайли', { exercises: exercisesData, workoutTitle: workoutTitle, workout: workout, folder: folder });
        }

        setTimeout(() => {
            setViewWorkoutButtonDisabled(false);
        }, 500);
    };

    useEffect(() => {
        if (selectedWorkouts.length === 0) {
            setSelectionMode(false);
        }
    }, [selectedWorkouts]);

    const deleteWorkouts = () => {
        deleteSelectedWorkoutsInFolder(selectedWorkouts, folder.id, setSelectedWorkouts, setSelectionMode, internetConnected);
        setSelectedWorkouts([]);
    };

    const cutWorkouts = () => {
        cutSelectedWorkoutsInFolder(selectedWorkouts, folder.id, setSelectedWorkouts, setSelectionMode);
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

    const [isPasteWorkoutsInFolderModalVisible, setIsPasteWorkoutsInFolderModalVisible] = useState(false);
    const [isGeneratingWorkoutAnimationModalVisible, setIsGeneratingWorkoutAnimationModalVisible] = useState(false)

    useEffect(() => {
        
        if (!generatingWorkout) {
            setIsGeneratingWorkoutAnimationModalVisible(false)
        }

    }, [generatingWorkout])

    // Deletes folder from asyncstorage and all workouts with its id from firebase
    const deleteFolderFunc = async () => {
        await deleteFolder(folder, navigation, internetConnected);
    };

    return (
        <>
            {(isPasteWorkoutsInFolderModalVisible || isGeneratingWorkoutAnimationModalVisible) && (
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
                    pasteCopiedWorkouts={pasteCopiedWorkoutsFunc}
                    pasteCutWorkouts={pasteCutWorkoutsFunc}
                />

                <GeneratingWorkoutAnimationModal

                    isGeneratingWorkoutAnimationModalVisible={isGeneratingWorkoutAnimationModalVisible}
                    setIsGeneratingWorkoutAnimationModalVisible={setIsGeneratingWorkoutAnimationModalVisible}
                    generatingWorkoutInFolder={generatingWorkoutInFolder}

                />

                <Pressable style={tw`bg-gray-100 h-[15%] w-full flex justify-end`} onPress={() => setIsPasteWorkoutsInFolderModalVisible(true)}>
                    <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`text-4xl font-medium text-black m-3`}>{folder?.title}</Text>

                        {(generatingWorkout) &&  (
                                <Pressable style={tw`w-12 h-12 mr-3 mt-3`} onPress={() => {
                                    setIsPasteWorkoutsInFolderModalVisible(false)
                                    setIsGeneratingWorkoutAnimationModalVisible(true)
                                }}>
                                    <ActivityIndicator size="large" color="#fd1c47"/>
                                </Pressable>
                        )}
                    </View>
                </Pressable>

                <View style={tw`w-full h-[73%] p-3`}>
                    <FlatList
                        data={folder?.workouts}
                        renderItem={renderWorkout}
                        keyExtractor={(item: any) => item.id}
                        ListEmptyComponent={() => (
                            <View style={tw``}>
                                <Text style={tw`text-2xl font-medium text-gray-500 text-center`}>{t('no-workouts-added')}</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                    />
                </View>

                <BottomNavigationBar
                    navigation={navigation}
                    folder={folder}
                    currentPage='Folder'
                    deleteFolder={deleteFolderFunc}
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