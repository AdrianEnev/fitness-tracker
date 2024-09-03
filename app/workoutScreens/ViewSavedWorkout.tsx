import { View, Text, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import BottomNavigationBar from '../components/BottomNavigationBar';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, deleteDoc, doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewSavedWorkout = ({navigation, route}: any) => {

    const { exercises, workoutTitle, date, time, workout } = route.params;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [newExercises, setNewExercises] = useState<any>([...exercises]);

    const deleteSavedWorkout = async () => {

        const deleteWorkout = async () => {
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            const savedWorkoutsCollectionRef = collection(userDocRef, 'saved_workouts');

            const workoutDocRef = doc(savedWorkoutsCollectionRef, workout.id);
            const workoutDocSnapshot = await getDoc(workoutDocRef);

            if (workoutDocSnapshot.exists()) {
                await deleteDoc(workoutDocRef);
                
            }

            // Delete the workout from AsyncStorage
            const savedWorkouts = await AsyncStorage.getItem('savedWorkouts');
            const savedWorkoutsArray = savedWorkouts ? JSON.parse(savedWorkouts) : [];

            const updatedWorkoutsArray = savedWorkoutsArray.filter((savedWorkout: any) => savedWorkout.id !== workout.id);
            await AsyncStorage.setItem('savedWorkouts', JSON.stringify(updatedWorkoutsArray));

            navigation.navigate('Главна Страница');
        }

        Alert.alert(
            'Изтриване на Тренировка',
            'Сигурен ли си, че искаш да изтриеш тази тренировка?',
            [
            {
                text: 'Отказ',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            },
            { text: 'Изтрий', onPress: () => deleteWorkout() }
            ],
            { cancelable: false }
        );
       
    }

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        return timeString;
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                {exercises.length === 0 ? (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <ActivityIndicator size='large' color="#fd3e6b" />
                    </View>
                ) : (

                    <SafeAreaView style={tw`w-full h-full`}>
                
                        <View style={tw`flex flex-col mx-3 mb-3`}>
                            <Text style={tw`text-2xl font-medium`}>{workoutTitle}</Text>
                            <Text style={tw`text-2xl font-medium`}>data: {date}</Text>
                            <Text style={tw`text-2xl font-medium`}>krai: {time}</Text>
                            <Text style={tw`text-2xl font-medium`}>{formatTime(workout.duration)}</Text>
                        </View>

                        <View style={tw`flex flex-col gap-y-1`}>
                            {newExercises.map((exercise: any, index: any) => {
                                if (exercise.exerciseIndex === currentIndex + 1) {
                                    return (
                                        <View key={index} style={tw`w-full`}>
                                            <Text style={tw`text-2xl text-center mb-4`} numberOfLines={1}>{exercise.title}</Text>
                                            
                                            <ScrollView style={tw``}>
                                                {exercise.sets.sort((a: any, b: any) => a.setIndex - b.setIndex).map((set: any, mapIndex: any) => (
                                                    <View key={set.id} style={tw`ml-3`}>
                                                        <View style={tw`flex flex-row gap-x-2`}>
                                                            <View style={tw`flex flex-col`}>
                                                                <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Сет</Text>
                                                                <View style={tw`w-10 h-10 bg-white rounded-xl flex items-center justify-center`}>
                                                                    <Text style={tw`text-base ml-5 absolute font-medium`}>{mapIndex + 1}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={tw`flex flex-row gap-x-2 mb-3 w-full`}>
                                                                <View style={tw`w-[30%]`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Повторения</Text>
                                                                    <View style={tw`w-full h-10 bg-white rounded-2xl flex items-start justify-center`}>
                                                                        <Text style={tw`ml-3`}>{set.reps === "" ? '0' : set.reps.toString()}</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={tw`w-[26%]`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Тежест</Text>
                                                                    <View style={tw`w-full h-10 bg-white rounded-2xl flex items-start justify-center`}>
                                                                        <Text style={tw`ml-3`}>{set.weight === "" ? '0' : set.weight.toString()}</Text>
                                                                    </View>
                                                                </View>
                                                                <View style={tw`w-[26%]`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>RPE</Text>
                                                                    <View style={tw`w-full h-10 bg-white rounded-2xl flex items-start justify-center`}>
                                                                        <Text style={tw`ml-3`}>{set.rpe === "" ? '0' : set.rpe.toString()}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))}
                                            </ScrollView>
                                        </View>
                                    );
                                }
                            })}
                        </View>

                        <BottomNavigationBar
                            currentPage='SavedWorkout'
                            navigation={navigation}
                            forwardButton={() => {

                                if (workout.numberOfExercises > 1) {
                                    setCurrentIndex((currentIndex + 1) % newExercises.length)
                                }

                                
                            }}
                            backButton={() => {

                                if (workout.numberOfExercises > 1) {
                                    setCurrentIndex((currentIndex - 1 + newExercises.length) % exercises.length)
                                }
                                
                            }}
                            deleteSavedWorkout={deleteSavedWorkout}
                        />

                    </SafeAreaView>
                    
                )}

            
        </TouchableWithoutFeedback>
    );
}

export default ViewSavedWorkout;