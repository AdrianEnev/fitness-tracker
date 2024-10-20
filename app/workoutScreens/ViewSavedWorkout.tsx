import { View, Text, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc'
import BottomNavigationBar from '../components/BottomNavigationBar';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, deleteDoc, doc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalContext from '../../GlobalContext';
import { BlurView } from 'expo-blur';
import DeleteSavedWorkoutModal from '../modals/DeleteSavedWorkoutModal';
import { duration } from 'moment';

const ViewSavedWorkout = ({navigation, route}: any) => {

    const { exercises, workoutTitle, date, time, workout } = route.params;

    const [currentIndex, setCurrentIndex] = useState(0);

    const {internetConnected} = useContext(GlobalContext)

    const deleteSavedWorkout = async () => {

        // Delete the workout from AsyncStorage
        const savedWorkouts = await AsyncStorage.getItem('savedWorkouts');
        const savedWorkoutsArray = savedWorkouts ? JSON.parse(savedWorkouts) : [];

        const updatedWorkoutsArray = savedWorkoutsArray.filter((savedWorkout: any) => savedWorkout.id !== workout.id);
        await AsyncStorage.setItem('savedWorkouts', JSON.stringify(updatedWorkoutsArray));

        navigation.goBack();
       
        if (internetConnected ) {
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            const savedWorkoutsCollectionRef = collection(userDocRef, 'saved_workouts');

            const workoutDocRef = doc(savedWorkoutsCollectionRef, workout.id);
            const workoutDocSnapshot = await getDoc(workoutDocRef);

            if (workoutDocSnapshot.exists()) {
                await deleteDoc(workoutDocRef);
                
            }
        }
       
    }

    useEffect(() => {
        getStartEnd();
    }, [])
   
    const getStartEndT = () => {

       const cleanedTime = time.replace(/[^\d:]/g, '');
    
        // Extract hours and minutes from the cleaned 'time' prop
        const [startHour, startMinute] = cleanedTime.split(':').map(Number);

        // Calculate the total minutes from the start time
        const startTotalMinutes = startHour * 60 + startMinute;

        // Calculate the end total minutes by adding the workout duration (in seconds converted to minutes)
        const endTotalMinutes = startTotalMinutes + Math.floor(workout.duration / 60);

        // Calculate the end hour and minute
        const endHour = Math.floor(endTotalMinutes / 60) % 24; // Ensure it wraps around 24 hours
        const endMinute = endTotalMinutes % 60;

        // Format the start and end time as "HH:MM - HH:MM"
        const formattedStartTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
        const formattedEndTime = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}`;

        setStartEnd(`${formattedStartTime} -> ${formattedEndTime}`);
    }
    
    const getStartEnd = () => {
        // Assume 'time' is your formatted end time, like '18:46'
        const cleanedTime = time.replace(/[^\d:]/g, '');
    
        // Extract hours and minutes from the cleaned 'time' prop
        const [hour, minute] = cleanedTime.split(':').map(Number);
    
        // Calculate the total minutes from the end time
        const totalMinutes = hour * 60 + minute;
    
        // Duration to subtract in minutes (16 minutes in this case)
        const duration = 16;
    
        // Subtract the duration from the total minutes
        const startTotalMinutes = totalMinutes - duration;
    
        // Calculate start hour and minute
        const startHour = Math.floor(startTotalMinutes / 60) % 24;
        const startMinute = startTotalMinutes % 60;
    
        // Format start and end times
        const formattedStartTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
        const formattedEndTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    
        // Set start and end time
        setStartEnd(`${formattedStartTime} -> ${formattedEndTime}`);
    };

    const [startEnd, setStartEnd] = useState<any>();

    const [isDeleteSavedWorkoutModalVisible, setIsDeleteSavedWorkoutModalVisible] = useState(false);

    return (
        <>

            { isDeleteSavedWorkoutModalVisible && (

                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                
                <SafeAreaView style={tw`w-full h-full bg-white`}>

                    <DeleteSavedWorkoutModal
                        isDeleteSavedWorkoutModalVisible={isDeleteSavedWorkoutModalVisible}
                        setIsDeleteSavedWorkoutModalVisible={setIsDeleteSavedWorkoutModalVisible}
                        deleteSavedWorkout={deleteSavedWorkout}
                    />

                    <Text style={tw`text-2xl font-bold mx-3 mb-5 max-w-[81%] mt-2`}>
                        {workoutTitle}
                    </Text>

                    <View style={tw`flex flex-col gap-y-1`}>
                        {exercises.map((exercise: any, index: any) => {
                            if (exercise.exerciseIndex === currentIndex + 1) {
                                return (
                                    <View key={index} style={tw`w-full`}>
                                        <Text style={tw`text-xl text-blue-500 font-medium max-w-[85%] min-h-16 max-h-32 ml-3 mt-1 mb-[-10px]`}>
                                            {exercise.title}
                                        </Text>
                                        
                                        <ScrollView style={tw``}>
                                            {exercise.sets.sort((a: any, b: any) => a.setIndex - b.setIndex).map((set: any, mapIndex: any) => 
                                            {
                                                // Get the intensity value
                                                const intensity = set.intensity;  // Assuming you want to get the intensity from newExercises or userInputs

                                                // Determine the background color based on the intensity value
                                                let backgroundColor = 'bg-neutral-100';
                                                let textColor = 'text-black';
                                                if (intensity === 1) {
                                                    backgroundColor = 'bg-green-500';
                                                    textColor = 'text-white';
                                                } else if (intensity === 2) {
                                                    backgroundColor = 'bg-yellow-400';
                                                    textColor = 'text-white';
                                                } else if (intensity === 3) {
                                                    backgroundColor = 'bg-red-500';
                                                    textColor = 'text-white';
                                                }

                                                return (
                                                    <View key={set.id} style={tw`ml-3`}>
                                                        <View style={tw`flex flex-row gap-x-2`}>

                                                            <View style={tw`flex flex-col`}>
                                                                <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Сет</Text>
                                                                <View style={tw`w-10 h-10 ${backgroundColor} rounded-xl flex items-center justify-center`}>
                                                                    <Text style={tw`text-base ml-5 absolute font-medium ${textColor}`}>{mapIndex + 1}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={tw`flex flex-row gap-x-2 mb-3 w-full`}>

                                                                <View style={tw`w-[30%]`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Повторения</Text>
                                                                    <View style={tw`w-full h-10 bg-neutral-100 rounded-2xl flex items-start justify-center`}>
                                                                        <Text style={tw`ml-3`}>{set.reps === "" ? '0' : set.reps.toString()}</Text>
                                                                    </View>
                                                                </View>

                                                                <View style={tw`w-[26%]`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Тежест</Text>
                                                                    <View style={tw`w-full h-10 bg-neutral-100 rounded-2xl flex items-start justify-center`}>
                                                                        <Text style={tw`ml-3`}>{set.weight === "" ? '0' : set.weight.toString()}</Text>
                                                                    </View>
                                                                </View>

                                                                <View style={tw`w-[26%]`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>RPE</Text>
                                                                    <View style={tw`w-full h-10 bg-neutral-100 rounded-2xl flex items-start justify-center`}>
                                                                        <Text style={tw`ml-3`}>{set.rpe === "" ? '0' : set.rpe.toString()}</Text>
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                )
                                            })}
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
                            
                            setCurrentIndex((prevIndex) => {
                                const newIndex = (prevIndex + 1) % exercises.length;
                                
                                return newIndex;
                            });
                        }}
                        backButton={exercises.length === 1 ? null : () => {
                            
                            setCurrentIndex((prevIndex) => {
                                const newIndex = (prevIndex - 1 + exercises.length) % exercises.length;
                                
                                return newIndex;
                            });
                        }}
                        deleteSavedWorkout={() => setIsDeleteSavedWorkoutModalVisible(true)}
                        viewSavedWorkoutNumberOfExercises={exercises.length}
                        viewSavedWorkoutDate={date}
                        viewSavedWorkoutStartEnd={startEnd}
                    />

                </SafeAreaView>
                
            </TouchableWithoutFeedback>

        </>
    );
}

export default ViewSavedWorkout;