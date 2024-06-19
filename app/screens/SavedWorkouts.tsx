import { View, Text, Button, SafeAreaView, TouchableOpacity, FlatList, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import CustomTabBar from '../components/CustomTabBar';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Exercise, Workout } from '../../interfaces';
import getSavedWorkoutInfo from '../use/useGetSavedWorkoutInfo';
import Ionicons from '@expo/vector-icons/Ionicons'

const Workouts = ({navigation}: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userSavedWorkoutsCollectionRef = collection(userDocRef, "saved_workouts");

    const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
    const [viewWorkoutButtonDisabled, setViewWorkoutButtonDisabled] = useState(false);

    const getWorkouts = async () => {
        try {
            const data = await getDocs(query(userSavedWorkoutsCollectionRef, orderBy("created", "desc")));
      
            const filteredData: Workout[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Workout));
      
            setSavedWorkouts(filteredData);
            
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        onSnapshot(userSavedWorkoutsCollectionRef, (_snapshot) => {
            getWorkouts();
        });
    }, [])

    //onPress={() => navigation.navigate('Тренировка-Детайли', {workout})}

    const deleteWorkout = async (id: string) => {
        const workoutDocRef = doc(userSavedWorkoutsCollectionRef, id);
        try {
            await deleteDoc(workoutDocRef);
        } catch (err) {
            console.error("Error deleting document: ", err);
        }
    }

    const viewWorkout = async (workout: Workout, date: any, time: any) => {

        setViewWorkoutButtonDisabled(true);
        

        const savedWorkoutInfo = await getSavedWorkoutInfo(workout.id);
        if (savedWorkoutInfo) {

            const { exercisesData, workoutTitle } = savedWorkoutInfo;
            navigation.navigate('Виж-Запазенa-Тренировка', {exercises: exercisesData, workout: workout, workoutTitle: workoutTitle, date: date, time: time});

        }

        setTimeout(() => {
            setViewWorkoutButtonDisabled(false);
            
        }, 100);

    }

    const renderSavedWorkout = (savedWorkout: any) => {

        const date = savedWorkout.created.toDate();
        const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + 'ч.';

        return (
            <Pressable style={tw`w-[96%] h-14 bg-white shadow-md rounded-2xl mr-2 mb-2 py-2 px-3`}>

                <View style={tw`flex flex-row justify-between`}>

                    <View style={tw`w-[76%] flex flex-col`}>
                        <Text style={tw`text-2xl font-medium`} ellipsizeMode='tail' numberOfLines={1}>{savedWorkout.title}</Text>
                    </View>

                    <View style={tw`flex flex-row gap-x-1`}>
                        <Ionicons name='close' size={40} color='#ef4444' onPress={() => deleteWorkout(savedWorkout.id)}/>
                        <Ionicons name='eye-outline' size={38} color='#22c55e' onPress={() => viewWorkout(savedWorkout, formattedDate, formattedTime)} disabled={viewWorkoutButtonDisabled}                        />
                    </View>

                </View>
               
            </Pressable>
        )
    }

    const { t } = useTranslation();

    return (
        <SafeAreaView style={tw`w-full h-full`}>

            <Text style={tw`text-2xl font-medium mt-1 text-center`}>Запазени Тренировки</Text>

            <View style={tw`w-full h-full mt-5 mx-2`}>
                <FlatList
                    data={savedWorkouts}
                    renderItem={({item}: any) => renderSavedWorkout(item)}
                    keyExtractor={(workout: Workout) => workout.id}
                    numColumns={2}
                />
            </View>

            <CustomTabBar navigation={navigation} currentPage='Тренировки'/>
            
        </SafeAreaView>
    )
}

export default Workouts