import { View, Text, Button, SafeAreaView, TouchableOpacity, FlatList, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import { collection, deleteDoc, doc, getDocs, onSnapshot, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Exercise, Workout } from '../../interfaces';
import getSavedWorkoutInfo from '../use/useGetSavedWorkoutInfo';
import Ionicons from '@expo/vector-icons/Ionicons'
import BottomNavigationBar from '../components/BottomNavigationBar';

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
        
        await navigation.navigate('Виж-Запазенa-Тренировка', { workout: workout, date: date, time: time});

        setTimeout(() => {
            setViewWorkoutButtonDisabled(false);
        }, 100);

    }

    // <Ionicons name='close' size={40} color='white' onPress={() => deleteWorkout(savedWorkout.id)}/>

    const renderSavedWorkout = (savedWorkout: any) => {

        const date = savedWorkout.created.toDate();
        const formattedDate = date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + 'ч.';

        return (
            <Pressable style={tw`w-[94%] h-24 bg-[#fd1c47] shadow-lg rounded-2xl p-3 mb-2 mx-3`} 
                onPress={() => viewWorkout(savedWorkout, formattedDate, formattedTime)} disabled={viewWorkoutButtonDisabled}
            >
                <View style={tw`flex flex-row justify-between`}>

                    <View style={tw`w-[88%] flex flex-col`}>
                        <Text style={tw`text-2xl font-medium text-white`} ellipsizeMode='tail' numberOfLines={1}>{savedWorkout.title}</Text>
                        <Text style={tw`text-2xl font-medium text-white`} ellipsizeMode='tail' numberOfLines={1}>{formattedDate} - {formattedTime}</Text>
                    </View>

                    <View style={tw`flex flex-row gap-x-1`}>
                        
                        <View style={tw`flex justify-center`}>
                            <Ionicons name='chevron-forward' size={24} color='white' />
                        </View>
                    </View>

                </View>

               
            </Pressable>
        )
    }

    return (
        <View style={tw`w-full h-full`}>

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-3xl font-medium text-black m-3`}>Запазени Тренировки</Text>
            </View>

            <View style={tw`w-full h-full bg-white pt-3`}>
                <FlatList
                    data={savedWorkouts}
                    renderItem={({item}: any) => renderSavedWorkout(item)}
                    keyExtractor={(workout: Workout) => workout.id}
                    numColumns={2}
                />
            </View>

            <BottomNavigationBar currentPage='Settings' navigation={navigation}/>
            
        </View>
    )
}

export default Workouts