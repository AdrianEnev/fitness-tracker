import { View, Text, Button, SafeAreaView, TouchableOpacity, FlatList, Pressable, Alert, TextInput } from 'react-native'  
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Exercise, Workout } from '../../interfaces';
import getWorkoutInfo from '../use/useGetWorkoutInfo';
import Ionicons from '@expo/vector-icons/Ionicons'
import BottomNavigationBar from '../components/BottomNavigationBar';
import generateRandomColour from '../use/useGenerateColour';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getWorkoutInfoLocally from '../use/useGetWorkoutInfoLocally';
import getEmail from '../use/useGetEmail';

const Workouts = ({navigation}: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [viewWorkoutButtonDisabled, setViewWorkoutButtonDisabled] = useState(false);

    /*const getWorkouts = async () => {
        try {
            const data = await getDocs(query(userWorkoutsCollectionRef, orderBy("created", "desc")));
      
            const filteredData: Workout[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Workout));
      
            setWorkouts(filteredData);

            console.log('-----------------------------------------')
            console.log('database')
            console.log(filteredData);
            console.log('-----------------------------------------')
            
        } catch (err) {
            console.error(err);
        }
    }*/

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

        const clearAllLocalWorkouts = async () => {
            try {
                const email = await getEmail();
                if (!email) return;
        
                await AsyncStorage.removeItem(`workouts_${email}`);
                console.log('All workouts cleared locally');
            } catch (err) {
                console.error(err);
            }
        };


    useEffect(() => {
        onSnapshot(userWorkoutsCollectionRef, (_snapshot) => {
            //getWorkouts();
            
        });

        //clearAllLocalWorkouts();
        getWorkoutsLocally();
    }, [])

    const changeWorkoutName = async (workoutID: string, workoutTitle: string) => {

        Alert.prompt(
            t('new-name-alert'),
            '',
            (newName) => {
                if (newName && newName.length <= 50) {
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

    }

    const viewWorkout = async (workout: Workout) => {

        setViewWorkoutButtonDisabled(true);

        //const workoutInfo = await getWorkoutInfo(workout.id);
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
        return name.split(' ').map(word => word[0]).join('').substring(0, 3).toUpperCase();
    }

    const renderWorkout = (workout: Workout) => {

        const exercisesCount = workout.numberOfExercises;

        return (
            <Pressable style={tw`w-[96%] h-24 bg-white border border-gray-200 shadow-lg rounded-2xl mr-2 mb-2 py-2 px-3`} onPress={() => viewWorkout(workout)} disabled={viewWorkoutButtonDisabled} onLongPress={() => changeWorkoutName(workout.id, workout.title)}>
                
                <View style={tw`flex flex-row justify-between`}>
                    <View style={tw`flex-1 flex-row`}>

                        <View style={tw`h-full py-3`}>
                            <View style={tw`w-14 h-full rounded-md bg-${workout.colour} flex items-center justify-center`}>
                                <Text style={tw`text-xl font-medium text-white`}>{getInitials(workout.title)}</Text>
                            </View>
                        </View>
                        
                        <View style={tw`flex flex-col ml-3 justify-center w-full`}>
                            <Text style={tw`text-xl font-medium w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>{workout.title}</Text>
                            <Text style={tw`text-lg font-medium text-gray-500 w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>{exercisesCount ? exercisesCount : '?'} {exercisesCount === 1 ? t('exercise-djhjd') : t('exercises-rhahsgdg')}</Text>
                        </View>

                    </View>

                    <View style={tw`flex justify-center`}>
                        <Ionicons name='chevron-forward' size={36} color='black'/>
                    </View>
                </View>
                
            </Pressable>
        )
    }

    const { t } = useTranslation();

    return (
        <SafeAreaView style={tw`w-full h-full bg-neutral-50`}>

            <View style={tw`flex flex-row justify-between mx-3`}>

                <Pressable style={tw`w-13 h-13 bg-white shadow-lg rounded-2xl flex items-center justify-center`} onPress={() => navigation.goBack()}>
                    <Ionicons name='arrow-back-outline' size={36} color='#fa1148'/>
                </Pressable>

                <Pressable style={tw`w-13 h-13 bg-white shadow-lg rounded-2xl flex items-center justify-center`} onPress={() => navigation.navigate("Тренировка-Добави")}>
                    <Ionicons name='add' size={44} color='#fa1148'/>
                </Pressable>

            </View>
            

            <View style={tw`w-full h-[82%] mt-4 mx-2`}>

                <FlatList
                    data={workouts}
                    renderItem={({item}: any) => renderWorkout(item)}
                    keyExtractor={(workout: Workout) => workout.id}
                   
                />
            </View>

            <BottomNavigationBar currentPage='Workouts' navigation={navigation}/>
            
        </SafeAreaView>
    )
}

export default Workouts



