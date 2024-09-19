import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import BottomNavigationBar from '../components/BottomNavigationBar'
import getEmail from '../use/useGetEmail'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Workout } from '../../interfaces'
import getWorkoutInfoLocally from '../useWorkout/useGetWorkoutInfoLocally'

const WorkoutFolder = ({route, navigation}: any) => {

    const {folder} = route.params;

    useEffect(() => {
        console.log('Navigated to workout folder: ', folder)
    }, [folder]);

    const {t} = useTranslation();

    const getInitials = (name: string) => {
        return name.split(' ').map(word => word[0]).join('').substring(0, 3).toUpperCase();
    }

    const deleteFolder = async () => {
        console.log('Deleting folder: ', folder);
    
        try {
            const email = await getEmail();
            if (!email) return;
    
            const data = await AsyncStorage.getItem(`folders_${email}`);
            let folders = data ? JSON.parse(data) : [];
    
            folders = folders.filter((f: any) => f.id !== folder.id);
    
            await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(folders));
            navigation.goBack()
            //setFolders(folders); 
        } catch (err) {
            console.error(err);
        }
    }

    const [viewWorkoutButtonDisabled, setViewWorkoutButtonDisabled] = useState(false);

    const viewWorkout = async (workout: Workout) => {
        setViewWorkoutButtonDisabled(true);

        const workoutInfo = await getWorkoutInfoLocally(workout.id, folder);
        if (workoutInfo) {
            const { exercisesData, workoutTitle } = workoutInfo;
            navigation.navigate('Тренировка-Детайли', {exercises: exercisesData, workoutTitle: workoutTitle, workout: workout});
        }

        setTimeout(() => {
            setViewWorkoutButtonDisabled(false);
            console.log('button enabled')
        }, 500);
    }

    return (
        <View style={tw`w-full h-full bg-neutral-50`}>
            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{folder.title}</Text>
            </View>
            
            <View style={tw`w-full h-[85%] p-3`}>
                {folder.workouts.map((workout: any) => (
                    <Pressable style={tw`w-[96%] h-24 bg-white border border-gray-200 shadow-lg rounded-2xl mr-2 mb-2 py-2 px-3`} key={workout.id} disabled={viewWorkoutButtonDisabled} onPress={() => viewWorkout(workout)}>
                        <View style={tw`flex flex-row justify-between`}>
                            <View style={tw`flex-1 flex-row`}>
                                <View style={tw`h-full py-3`}>
                                    <View style={tw`w-14 h-full rounded-md bg-${workout.colour} flex items-center justify-center`}>
                                        <Text style={tw`text-xl font-medium text-white`}>{getInitials(workout.title)}</Text>
                                    </View>
                                </View>
                                
                                <View style={tw`flex flex-col ml-3 justify-center w-full`}>
                                    <Text style={tw`text-xl font-medium w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>{workout.title}</Text>
                                    <Text style={tw`text-lg font-medium text-gray-500 w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>{workout.numberOfExercises} {workout.numberOfExercises === 1 ? t('exercise-djhjd') : t('exercises-rhahsgdg')}</Text>
                                </View>
                            </View>

                            <View style={tw`flex justify-center`}>
                                <Ionicons name='chevron-forward' size={36} color='black'/>
                            </View>
                        </View>
                    </Pressable>
                ))}
            </View>

            <BottomNavigationBar navigation={navigation} folder={folder} currentPage='Folder' deleteFolder={deleteFolder}/>
        </View>
    )
}

export default WorkoutFolder