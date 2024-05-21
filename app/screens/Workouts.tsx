import { View, Text, Button, SafeAreaView, TouchableOpacity, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import CustomTabBar from '../components/CustomTabBar';
import { collection, doc, getDocs, onSnapshot, orderBy, query } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Exercise, Workout } from '../../interfaces';
import startWorkout from '../use/useStartWorkout';

const Workouts = ({navigation}: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userWorkoutsCollectionRef = collection(userDocRef, "workouts");

    const [workouts, setWorkouts] = useState<Workout[]>([]);

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

    const renderWorkout = (workout: Workout) => {
        return (
            <Pressable style={tw`w-[47%] h-36 bg-white shadow-md rounded-2xl mr-2 mb-2 pt-2 pl-3`}>
                <Text style={tw`text-lg`}>{workout.title}</Text>
                <Button title='start' onPress={() => startWorkout(workout.id, navigation)}/>
            </Pressable>
        )
    }

    const { t } = useTranslation();

    return (
        <SafeAreaView style={tw`w-full h-full`}>

            <View style={tw`w-[96%] flex flex-row justify-between mx-2`}>
                <View style={tw`w-[25%]`}>
                    <TouchableOpacity style={tw`w-full h-12 bg-[#ffd166] rounded-xl flex justify-center items-center`}>
                        <Text style={tw`text-lg text-white font-medium`}>Потърси</Text>
                    </TouchableOpacity>
                </View>

                <View style={tw`w-[25%]`}>
                    <TouchableOpacity style={tw`w-full h-12 bg-[#4ecdc4] rounded-xl flex justify-center items-center`} onPress={() => navigation.navigate('Тренировка-Добави')}>
                        <Text style={tw`text-lg text-gray-100 font-medium`}>Добави</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            <View style={tw`w-full h-full mt-2 mx-2`}>
                <FlatList
                    data={workouts}
                    renderItem={({item}: any) => renderWorkout(item)}
                    keyExtractor={(workout: Workout) => workout.id}
                    numColumns={2}
                />
            </View>

            <CustomTabBar navigation={navigation} currentPage='Тренировки'/>
            
        </SafeAreaView>
    )
}

export default Workouts