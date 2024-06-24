import { View, Text, Button, SafeAreaView, TouchableOpacity, FlatList, Pressable, Alert } from 'react-native'
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

const Workouts = ({navigation}: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [startButtonDisabled, setStartButtonDisabled] = useState(false);
    const [viewWorkoutButtonDisabled, setViewWorkoutButtonDisabled] = useState(false);

    const getWorkouts = async () => {
        try {
            const data = await getDocs(query(userWorkoutsCollectionRef, orderBy("created", "desc")));
      
            const filteredData: Workout[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Workout));
      
            setWorkouts(filteredData);
            
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        onSnapshot(userWorkoutsCollectionRef, (_snapshot) => {
            getWorkouts();
        });
    }, [])

    //onPress={() => navigation.navigate('Тренировка-Детайли', {workout})}

    const deleteWorkout = async (id: string) => {
        const workoutDocRef = doc(userWorkoutsCollectionRef, id);
        try {
            await deleteDoc(workoutDocRef);
        } catch (err) {
            console.error("Error deleting document: ", err);
        }
    }

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

        const workoutInfo = await getWorkoutInfo(workout.id);
        if (workoutInfo) {

            const { exercisesData, workoutTitle } = workoutInfo;
            navigation.navigate('Тренировка-Детайли', {exercises: exercisesData, workoutTitle: workoutTitle, workout: workout});

        }

        setTimeout(() => {
            setViewWorkoutButtonDisabled(false);
            console.log('button enabled')
        }, 100);

    }

    const startWorkout = async (workout: Workout) => {

        setStartButtonDisabled(true);

        const workoutInfo = await getWorkoutInfo(workout.id);
        if (workoutInfo) {

            const { exercisesData, workoutTitle } = workoutInfo;
            navigation.navigate("Активна-Тренировка", {exercises: exercisesData, workoutTitle: workoutTitle});

        }

        setTimeout(() => {
            setStartButtonDisabled(false);
            console.log('button enabled')
        }, 100);

    }

    const renderWorkout = (workout: Workout) => {
        return (
            <Pressable style={tw`w-[96%] h-14 bg-white shadow-md rounded-2xl mr-2 mb-2 py-2 px-3`} onLongPress={() => changeWorkoutName(workout.id, workout.title)}>
                
                <View style={tw`flex flex-row justify-between`}>
 
                    <View style={tw`w-[70%] h-20`}>
                        <Text style={tw`text-2xl font-medium`} ellipsizeMode='tail' numberOfLines={1}>{workout.title}</Text>
                    </View>

                    <View style={tw`flex flex-row gap-x-1`}>
                        <Ionicons name='close' size={40} color='#ef4444' onPress={() => deleteWorkout(workout.id)}/>
                        <Ionicons name='caret-forward-outline' size={40} color='#22c55e' onPress={() => startWorkout(workout)} disabled={startButtonDisabled}/>
                        <Ionicons name='create-outline' size={36} color='#3b82f6' onPress={() => viewWorkout(workout)} disabled={viewWorkoutButtonDisabled}/>
                    </View>

                </View>
                
            </Pressable>
        )
    }

    const { t } = useTranslation();

    return (
        <SafeAreaView style={tw`w-full h-full`}>

            <View style={tw`w-full flex flex-row justify-between`}>

                <Pressable style={tw`h-12 w-12 bg-white shadow-md rounded-2xl flex items-center justify-center ml-2`}>
                    <Ionicons name='search-outline' size={28} color='black' />
                </Pressable>
                
                <View style={tw`h-12 w-44 bg-white shadow-md rounded-xl flex items-center justify-center`}>
                    <Text style={tw`text-2xl font-medium mb-[2px]`}>Тренировки</Text>
                </View>

                <Pressable style={tw`h-12 w-12 bg-white shadow-md rounded-2xl flex items-center justify-center mr-2`} onPress={() => navigation.navigate("Тренировка-Добави")}>
                    <Ionicons name='add-outline' size={36} color='black' />
                </Pressable>

            </View>
            
            <View style={tw`w-full h-full mt-4 mx-2`}>
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