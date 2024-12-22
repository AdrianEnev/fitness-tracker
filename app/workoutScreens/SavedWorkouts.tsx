import { View, Text, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import { Timestamp } from 'firebase/firestore';
import { Workout } from '../../interfaces';
import Ionicons from '@expo/vector-icons/Ionicons'
import BottomNavigationBar from '../components/BottomNavigationBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getSavedWorkoutInfoLocally from '../useWorkout/useGetSavedWorkoutInfoLocally';
import getEmail from '../use/useGetEmail';

const Workouts = ({navigation}: any) => {

    const {t} = useTranslation();

    const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
    const [viewWorkoutButtonDisabled, setViewWorkoutButtonDisabled] = useState(false);

    const getWorkoutsLocally = async () => {
        try {
            const email = await getEmail();

            const savedWorkouts = await AsyncStorage.getItem(`savedWorkouts_${email}`);
            const savedWorkoutsArray = savedWorkouts ? JSON.parse(savedWorkouts) : [];
    
            let convertedWorkouts = savedWorkoutsArray.map((workout: any) => {
                const createdDate = new Date(workout.created);
                const seconds = Math.floor(createdDate.getTime() / 1000);
                const nanoseconds = (createdDate.getTime() % 1000) * 1000000;
    
                return {
                    ...workout,
                    created: {
                        seconds: seconds,
                        nanoseconds: nanoseconds
                    }
                };
            });

            convertedWorkouts = convertedWorkouts.reverse();
    
            setSavedWorkouts(convertedWorkouts);
            //console.log('Saved workouts: ', convertedWorkouts);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getWorkoutsLocally();
        });

        return unsubscribe;
    }, [navigation]);

    const viewWorkout = async (workout: Workout, date: any, time: any) => {

        setViewWorkoutButtonDisabled(true);

        //const workoutInfo = await getSavedWorkoutInfo(workout.id);
        const workoutInfo = await getSavedWorkoutInfoLocally(workout.id);
        if (workoutInfo) {

            const { exercisesData, workoutTitle } = workoutInfo;
            navigation.navigate('Виж-Запазенa-Тренировка', {
                exercises: exercisesData, workoutTitle: workoutTitle, date: date, time: time, workout: workout
            });

        }
        
        //await navigation.navigate('Виж-Запазенa-Тренировка', { workout: workout, date: date, time: time });

        setTimeout(() => {
            setViewWorkoutButtonDisabled(false);
        }, 100);

    }

    const renderSavedWorkout = (savedWorkout: any) => {
        //console.log(savedWorkout.created);
    
        // Convert the created property to a Firestore Timestamp object
        const timestamp = new Timestamp(savedWorkout.created.seconds, savedWorkout.created.nanoseconds);
        const date = timestamp.toDate();
        const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.');
        const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + 'ч.';
    
        return (
            <Pressable style={tw`w-[96.5%] h-14 bg-white mx-2 py-1`} onPress={() => {
                viewWorkout(savedWorkout, formattedDate, formattedTime);
            }} disabled={viewWorkoutButtonDisabled}>
                <View style={tw`flex flex-row justify-between`}>
                    <View style={tw`flex flex-row`}>
                        <View style={tw`w-28 h-10 bg-[#fd3e54] rounded-xl flex items-center justify-center mr-2`}>
                            <Text style={tw`text-lg font-medium text-white`} ellipsizeMode='tail' numberOfLines={1}>{formattedDate}</Text>
                        </View>
                        <View style={tw`flex flex-row justify-start items-center max-w-[66%]`}>
                            <Text style={tw`text-lg font-medium`} ellipsizeMode='tail' numberOfLines={1}>{savedWorkout.title}</Text>
                        </View>
                    </View>
                    <View style={tw`flex justify-center`}>
                        <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                    </View>
                </View>
            </Pressable>
        );
    };

    return (
        <View style={tw`w-full h-full bg-white`}>

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-3xl font-medium text-black m-3`}>{t('workouts')}</Text>
            </View>

            <View style={tw`w-full h-[72%] bg-white py-3`}>
                <FlatList
                    data={savedWorkouts}
                    renderItem={({item}: any) => renderSavedWorkout(item)}
                    keyExtractor={(workout: Workout) => workout.id}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent=
                    {
                        <Text style={tw`text-2xl font-medium text-gray-500 text-center`} numberOfLines={2}>
                            {t('no-saved-workouts')}
                        </Text>
                    }
                />
            </View>

            <BottomNavigationBar currentPage='Settings' navigation={navigation}/>
            
        </View>
    )
}

export default Workouts