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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Set {
    id: string,
    reps: string,
    rpe: string,
    weight: string,
    setIndex: number,
}

const ViewSavedWorkout: React.FC = ({route, navigation}: any) => {

    const insets = useSafeAreaInsets();
	const notchSizeTailwind = Math.round(insets.top / 4);

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

                    // Skriva setovete koito imat empty stringove i na 3te mesta
                    setsArray = setsArray.filter(set => !(set.reps === '' || set.weight === '' || set.rpe === ''));
    
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

    let workoutDuration = savedWorkoutInfo[currentIndex]?.workoutDuration;
    
    if (workoutDuration === '1 минути') {
        workoutDuration = '1 минута';
    }

    return (
        <ScrollView style={tw``}>

            {savedWorkoutInfo.length > 0 && (

                <View style={tw.style(`w-full h-full pt-${notchSizeTailwind}`)}>

                    <View style={tw`flex flex-row justify-between`}>
                        <Text style={tw`text-base`} numberOfLines={1} ellipsizeMode='tail'>
                            {savedWorkoutInfo[currentIndex].title}
                            
                        </Text>

                    </View>

                    <View>
                        <Text>{savedWorkoutInfo[currentIndex].note}</Text>
                    </View>

                    <View style={tw`flex-1 flex-row flex-wrap gap-2 justify-center mx-2`}>
                        {sets.length > 0 && sets[currentIndex]?.sets.map((set: any, index: number) => (
                            <View key={index} style={tw`bg-white shadow-md rounded-xl w-[49%] h-32`}>
                                <View style={tw`flex flex-col bg-white shadow-md h-48 w-full py-1 px-2 rounded-lg`}>

                                    <Text style={tw`text-base mb-5 text-black`}>
                                        {`Серия ${index + 1}`}
                                    </Text>

                                    <Text style={tw`text-base text-black`}>{`Повторения: ${set.reps !== 'N/A' && set.reps !== '' ? set.reps : '0'}`}</Text>
                                    <Text style={tw`text-base text-black`}>{`Тежест: ${set.weight !== 'N/A' && set.weight !== '' ? set.weight : '0'}`}</Text>
                                    <Text style={tw`text-base text-black`}>{`RPE: ${set.rpe !== 'N/A' && set.rpe !== '' ? set.rpe : '0'}`}</Text>

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
