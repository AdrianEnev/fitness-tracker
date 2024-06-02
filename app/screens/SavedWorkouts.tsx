import { View, Text, Button, SafeAreaView, TouchableOpacity, FlatList, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import CustomTabBar from '../components/CustomTabBar';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Exercise, Workout } from '../../interfaces';
import getWorkoutInfo from '../use/useGetWorkoutInfo';
import { useFocusEffect } from '@react-navigation/native';
import getSavedWorkoutInfo from '../use/useGetSavedWorkoutInfo';

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

    const viewWorkout = async (workout: Workout) => {

        setViewWorkoutButtonDisabled(true);

        const savedWorkoutInfo = await getSavedWorkoutInfo(workout.id);
        if (savedWorkoutInfo) {

            const { exercisesData, workoutTitle } = savedWorkoutInfo;
            navigation.navigate('Виж-Запазенa-Тренировка', {exercises: exercisesData, workout: workout, workoutTitle: workoutTitle});

        }

    }

    const renderSavedWorkout = (savedWorkout: any) => {
        return (
            <Pressable style={tw`w-[47%] h-36 bg-${savedWorkout.colour} shadow-md rounded-2xl mr-2 mb-2 py-2 px-3`}>

                <Text style={tw`text-base font-medium text-center`} numberOfLines={2}>{savedWorkout.title}</Text>

                <Pressable onPress={() => deleteWorkout(savedWorkout.id)} 
                    style={tw`w-full h-10 bg-white rounded-2xl flex items-center justify-center mt-2`}
                >
                    <Text>изтрий</Text>
                </Pressable>

                <Pressable onPress={() => viewWorkout(savedWorkout)} disabled={viewWorkoutButtonDisabled}
                    style={tw`w-full h-10 bg-white rounded-2xl flex items-center justify-center mt-2`}
                >
                    <Text>подробности</Text>
                </Pressable>
               
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