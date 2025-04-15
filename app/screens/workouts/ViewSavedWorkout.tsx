import { View, Text, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc'
import BottomNavigationBar from '@components/BottomNavigationBar';
import GlobalContext from '@config/GlobalContext';
import { BlurView } from 'expo-blur';
import DeleteSavedWorkoutModal from '@modals/workouts/DeleteSavedWorkoutModal';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import SavedWorkoutNotes from '@modals/workouts/SavedWorkoutNotes';
import deleteSavedWorkout from '@app/use/workouts/delete/deleteSavedWorkout';

const ViewSavedWorkout = ({navigation, route}: any) => {

    const { exercises, workoutTitle, date, time, workout } = route.params;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDeleteSavedWorkoutModalVisible, setIsDeleteSavedWorkoutModalVisible] = useState(false);
    const [isSavedWorkoutNotesVisible, setIsSavedWorkoutNotesVisible] = useState(false);

    const {t} = useTranslation();

    const {internetConnected} = useContext(GlobalContext)

    const [startEnd, setStartEnd] = useState<any>();

    const deleteSavedWorkoutFunc = async () => {
        if (!internetConnected) {
            return;
        }

        await deleteSavedWorkout(workout, navigation, internetConnected);
    }
    
    const getStartEnd = () => {

        // Example -> 18:34ч.
        const timeClock = time;
    
        // Example -> 6 (type: number, indicates: seconds)
        const duration = workout.duration;
    
        // Calculate start time by subtracting formatted seconds from timeClock
        // First parse timeClock so you only get 18:34 without "ч.", then separate by the ":" symbol and calculate hours/minutes
        const [hours, minutes] = timeClock.replace('ч.', '').split(':').map(Number);
        const totalMinutes = hours * 60 + minutes;
        const startMinutes = totalMinutes - Math.floor(duration / 60);
        const startHours = Math.floor(startMinutes / 60);
        const startFormattedMinutes = startMinutes % 60;
    
        const formattedStartTime = `${startHours.toString().padStart(2, '0')}:${startFormattedMinutes.toString().padStart(2, '0')}`;
        const formattedEndTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
        // Calculate the difference in seconds
        const differenceInSeconds = duration % 60;
    
        // Set start and end time
        if (differenceInSeconds < 60) {
            setStartEnd(`${differenceInSeconds}s`);
        } else {
            setStartEnd(`${formattedStartTime} -> ${formattedEndTime}`);
        }
    };

    useEffect(() => {
        getStartEnd();
    }, [])

    return (
        <>
            { (isDeleteSavedWorkoutModalVisible || isSavedWorkoutNotesVisible) && (

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
                        deleteSavedWorkout={deleteSavedWorkoutFunc}
                    />

                    <SavedWorkoutNotes 
                        isSavedWorkoutNotesVisible={isSavedWorkoutNotesVisible}
                        setIsSavedWorkoutNotesVisible={setIsSavedWorkoutNotesVisible}
                        exercises={exercises}
                        currentIndex={currentIndex}
                    />

                    <Text style={tw`text-2xl font-bold mx-3 mb-5 max-w-[81%] mt-2`}>
                        {workoutTitle}
                    </Text>

                    <View style={tw`flex flex-col gap-y-1`}>
                        {exercises.map((exercise: any, index: any) => {
                            if (exercise.exerciseIndex === currentIndex + 1) {
                                return (
                                    <View key={exercise.exerciseIndex} style={tw`w-full`}>
                                        <Text style={tw`text-xl text-blue-500 font-medium max-w-[85%] min-h-16 max-h-32 ml-3 mt-1 mb-[-10px]`}>
                                            {exercise.title}
                                        </Text>
                                        
                                        <ScrollView style={tw``}>
                                            {exercise.sets.sort((a: any, b: any) => a.setIndex - b.setIndex).map((set: any, mapIndex: any) => 
                                            {
                                                // Get the intensity value
                                                const intensity = set.intensity;

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
                                                    <View key={set.setIndex} style={tw`ml-3`}>
                                                        <View style={tw`flex flex-row gap-x-2`}>

                                                            <View style={tw`flex flex-col`}>
                                                                <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{t('set')}</Text>
                                                                <View style={tw`w-10 h-10 ${backgroundColor} rounded-xl flex items-center justify-center`}>
                                                                    <Text style={tw`text-base ml-5 absolute font-medium ${textColor}`}>{mapIndex + 1}</Text>
                                                                </View>
                                                            </View>

                                                            <View style={tw`flex flex-row gap-x-2 mb-3 w-full`}>

                                                                <View style={tw`w-[30%]`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{t('reps')}</Text>
                                                                    <View style={tw`w-full h-10 bg-neutral-100 rounded-2xl flex items-start justify-center`}>
                                                                        <Text style={tw`ml-3`}>{set.reps === "" ? '0' : set.reps.toString()}</Text>
                                                                    </View>
                                                                </View>

                                                                <View style={tw`w-[26%]`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{t('weight')}</Text>
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

                                                                <Pressable style={tw`${mapIndex != 0 || !exercises[currentIndex].note ? 'hidden' : 'absolute right-16'}  
                                                                w-10 h-6 bg-white shadow-sm border border-gray-200 rounded-2xl flex items-center justify-center
                                                                `}
                                                                onPress={() => {
                                                                    setIsSavedWorkoutNotesVisible(true);
                                                                }}>
                                                                    <Ionicons name='ellipsis-horizontal' size={24} color='black' />
                                                                </Pressable>
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