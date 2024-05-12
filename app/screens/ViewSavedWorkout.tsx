import { View, Text, Button, Pressable, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { FIREBASE_AUTH, FIRESTORE_DB, getCurrentSavedWorkout } from '../../firebaseConfig';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { SavedWorkout } from './SavedWorkouts';
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ScrollView } from 'react-native-gesture-handler';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';

interface Set {
    id: string,
    reps: string,
    rpe: string,
    weight: string,
    setIndex: number,
}

const ViewSavedWorkout: React.FC = ({route, navigation}: any) => {

    const {workoutID} = route.params;

    const currentSavedWorkout = getCurrentSavedWorkout();
    const [savedWorkoutInfo, setSavedWorkoutInfo] = useState<SavedWorkout[]>([]);
    const [sets, setSets] = useState<any[]>([]); // State to store sets
    const [currentIndex, setCurrentIndex] = useState(0);

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const savedWorkoutsCollectionRef = collection(userDocRef, 'saved_workouts');
    const savedWorkoutDocRef = doc(savedWorkoutsCollectionRef, currentSavedWorkout?.id);
    const savedWorkoutInfoCollectionRef = collection(savedWorkoutDocRef, 'info');

    // In ViewSavedWorkout.tsx

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDocs(savedWorkoutInfoCollectionRef);
                let infoArray: SavedWorkout[] = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as SavedWorkout);
    
                // Sort the exercises based on their index
                infoArray = infoArray.sort((a, b) => a.exerciseIndex - b.exerciseIndex);
    
                // Set the sorted exercises to the savedWorkoutInfo state
                setSavedWorkoutInfo(infoArray);
    
                // Fetch sets for all exercises
                const allSets = await Promise.all(infoArray.map(async (exercise) => {
                    const setsCollectionRef = collection(savedWorkoutInfoCollectionRef, exercise.id, 'sets');
                    const setsData = await getDocs(setsCollectionRef);
    
                    // Convert the setsData to an array of sets and sort them based on their setIndex
                    let setsArray = setsData.docs.map(setDoc => ({ id: setDoc.id, ...setDoc.data() }) as Set);
                    setsArray = setsArray.sort((a, b) => a.setIndex - b.setIndex);
    
                    return { exerciseId: exercise.id, sets: setsArray };
                }));
    
                setSets(allSets);
    
            } catch (error) {
                console.error('Error fetching saved workout info:', error);
            }
        };
    
        fetchData();
    }, []);

    
    const nextExercise = () => {
        setCurrentIndex((prevIndex) => Math.min(savedWorkoutInfo.length - 1, prevIndex + 1));
    };

    const previousExercise = () => {
        setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
    };

    useEffect(() => {
        if (savedWorkoutInfo[currentIndex]) {
        navigation.setOptions({
            headerRight: () => 

            <Pressable style={tw`w-12 h-32 mr-[-15px] flex items-center`} onPress={deleteItem}>

                <Ionicons
                name='close-circle-outline'
                size={43}
                color="#FF0000"
                
                style={tw`ml-[3px]`}
                />

            </Pressable>

        });
        }
    }, [currentIndex, savedWorkoutInfo]);

    const deleteItem = () => {

        const handleOk = async () => {

            try{

                await deleteDoc(doc(savedWorkoutsCollectionRef, workoutID));

                navigation.navigate('Запазени-Тренировки');
                
            }catch (err) {

                console.error(err);

            }
            
        }

        const handleCancel = () => {
            return;
        }

        Alert.alert('Сигурен ли си, че искаш да изтриеш тази тренировка?', '', [
            {
            text: 'Отказ',
            onPress: handleCancel,
            style: 'cancel',
            },
            {text: 'Да', onPress: handleOk},
        ]);

    };

    let workoutDuration = savedWorkoutInfo[currentIndex]?.workoutDuration;
    
    if (workoutDuration === '1 минути') {
        workoutDuration = '1 минута';
    }

    return (
        <ScrollView style={tw`bg-white`}>

            {savedWorkoutInfo.length > 0 && (

                <View>

                    <Text style={tw`text-base`} numberOfLines={1} ellipsizeMode='tail'>
                        {savedWorkoutInfo[currentIndex].title}
                    </Text>

                    <View style={tw`m-2 mb-4 flex flex-col justify-between`}>

                        <Text style={tw`text-base font-medium`}>Времетраене: {workoutDuration}</Text>  
                        <Text style={tw`text-base font-medium`}>Край: {savedWorkoutInfo[currentIndex].saved.toDate().toLocaleString()}</Text>
                    
                    </View>

                    <View style={tw`flex flex-row flex-wrap gap-2 justify-center`}>
                        {sets.length > 0 && sets[currentIndex]?.sets.map((set: any, index: number) => (
                            <View key={index}>
                                <View style={tw`flex flex-col bg-blue-500 h-48 py-1 px-2`}>

                                <Text style={tw`text-base mb-5 text-white text-center`}>
                                    {`Серия ${index + 1}`}
                                </Text>

                                <Text style={tw`text-base text-white`}>{`Повторения: ${set.reps !== 'N/A' ? set.reps : 'X'}`}</Text>
                                <Text style={tw`text-base text-white`}>{`Тежест: ${set.weight !== 'N/A' ? set.weight : 'X'}`}</Text>
                                <Text style={tw`text-base text-white`}>{`RPE: ${set.rpe !== 'N/A' ? set.rpe : 'X'}`}</Text>

                                </View>
                            </View>
                        ))}
                    </View>
                    
                    <View style={tw`flex flex-row justify-between mx-2`}>

                        {savedWorkoutInfo.length > 1 && (
                            <Pressable onPress={previousExercise}>
                                <Ionicons name='arrow-back-circle-outline' size={70} color='#3B82F6'/>
                            </Pressable>
                        )}

                        {savedWorkoutInfo.length > 1 && (
                            <Pressable onPress={nextExercise}>
                                <Ionicons name='arrow-forward-circle-outline' size={70} color='#3B82F6'/>
                            </Pressable>
                        )}

                    </View>
                    
                </View>
            )}
        </ScrollView>
    );
};

export default ViewSavedWorkout;
