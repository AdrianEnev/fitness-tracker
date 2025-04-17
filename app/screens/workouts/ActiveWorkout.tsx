import { View, Text, SafeAreaView, TextInput, TouchableWithoutFeedback, Pressable, TouchableOpacity, ScrollView, Keyboard, Modal, AppState } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useRef, useState } from 'react'
import tw from 'twrnc'
import BottomNavigationBar from '@components/BottomNavigationBar';
import { BlurView } from 'expo-blur';
import NoteModal from '@app/modals/workouts/NoteModal';
import EndWorkoutModal from '@modals/workouts/EndWorkoutModal';
import GlobalContext from '@config/GlobalContext';
import { diffTime, formatTime, getCurrentTimeWithMoment } from '@use/workouts/handlers/handleActiveWorkoutTimer';
import { addExercise, addSet, handleEndWorkoutVisibility, removeSet } from '@use/workouts/handlers/handleActiveWorkoutExercises';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';

const ActiveWorkout = ({route, navigation}: any) => {

    const {iphoneModel} = useContext(GlobalContext);

    const { exercises, workoutTitle, workout } = route.params;

    const {internetConnected} = useContext(GlobalContext);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [newExercises, setNewExercises] = useState<any>([...exercises]); // newExercises = copy of exercises
    const [userInputs, setUserInputs] = useState<any>(newExercises.map((exercise: any) => ({
        ...exercise,
        sets: exercise.sets.map((set: any) => ({...set, reps: "", weight: ""})),
        note: ""
    })));

    const [isNoteModalVisible, setIsNoteModalVisible] = useState(false);
    const [isEndWorkoutModalVisible, setIsEndWorkoutModalVisible] = useState(false);

    const [exercisesAdded, setExercisesAdded] = useState(1)

    const addExerciseFunc = () => {
        addExercise(newExercises, userInputs, setNewExercises, setUserInputs, exercises, exercisesAdded, setCurrentIndex, setExercisesAdded, i18next.language)
    }

    const addSetFunc = () => {
        addSet(newExercises, userInputs, currentIndex, setNewExercises, setUserInputs)
    }

    const handleEndWorkoutVisibilityFunc = () => {
        handleEndWorkoutVisibility(userInputs, setIsEndWorkoutModalVisible, navigation)
    }

    const updateNote = (exerciseIndex: number, note: string) => {
        const updatedInputs = [...userInputs];
        if (updatedInputs[exerciseIndex]) {
            updatedInputs[exerciseIndex].note = note; // Update the note for the specific exercise
            setUserInputs(updatedInputs); // Update the state
        }
    };

    useEffect(() => {
        if (exercises.length > 0) {
            setNewExercises([...exercises]);
        }
    }, [exercises]);

    // timer - start --------------------------------------------------------------------------------------------------
    const [time, setTime] = useState(0);
    const appState = useRef<any>(AppState.currentState);
    const backgroundTime = useRef<string | null>(null);

    const handleAppStateChange = (nextAppState: string) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
          // App has come to the foreground
          if (backgroundTime.current) {
            const now = getCurrentTimeWithMoment();
            const elapsedTime = diffTime(backgroundTime.current, now); // Calculate the elapsed time while app was in background
            setTime((prevTime) => prevTime + elapsedTime); // Adjust the timer
          }
          backgroundTime.current = null; // Reset the background time
        } else if (nextAppState.match(/inactive|background/)) {
          // App is going to the background
          backgroundTime.current = getCurrentTimeWithMoment(); // Store the current time when going to the background
        }
    
        appState.current = nextAppState; // Update the current app state
      };

    useEffect(() => {
        AppState.addEventListener('change', handleAppStateChange);

        return () => {
            //AppState.removeEventListener('change', handleAppStateChange);
        };
    }, []);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
            
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    // timer - end ----------------------------------------------------------------------------------------------------

    const forwardButton = () => {
        if (workout.numberOfExercises + exercisesAdded > 1) {
            setCurrentIndex((currentIndex + 1) % newExercises.length);
        } else {
            setCurrentIndex(0);
        }

        console.log(currentIndex)
    }
    
    const backButton = () => {
        if (workout.numberOfExercises + exercisesAdded > 1) {
            setCurrentIndex((currentIndex - 1 + newExercises.length) % newExercises.length);
        } else {
            setCurrentIndex(0);
        }

        console.log(currentIndex)
    }

    // Function to remove an exercise by index
    const removeExercise = (index: number) => {
        const updatedExercises = [...newExercises];
        const updatedUserInputs = [...userInputs];

        // Remove the exercise from both newExercises and userInputs
        updatedExercises.splice(index, 1);
        updatedUserInputs.splice(index, 1);

        // Re-index the remaining exercises
        updatedExercises.forEach((exercise: any, newIndex: number) => {
            exercise.exerciseIndex = newIndex + 1;
        });

        updatedUserInputs.forEach((input: any, newIndex: number) => {
            input.exerciseIndex = newIndex + 1;
        });

        // Update the state
        setNewExercises(updatedExercises);
        setUserInputs(updatedUserInputs);

        // Adjust currentIndex to prevent it from being out of bounds
        if (index >= updatedExercises.length) {
            setCurrentIndex(Math.max(0, updatedExercises.length - 1));
        }

        setExercisesAdded(exercisesAdded - 1)
    };

    // useEffect to check if the current exercise has 0 sets, and remove it if so
    useEffect(() => {
        const currentExercise = newExercises[currentIndex];
        
        if (currentExercise && currentExercise.sets.length === 0) {
            if (currentIndex != 0) {
                removeExercise(currentIndex);
            }
            
        }
    }, [currentIndex, newExercises]);

    const {t} = useTranslation();

    return (
        <>
            { (isNoteModalVisible || isEndWorkoutModalVisible) && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={tw`w-full h-full bg-white`}>

                      <NoteModal
                        isNoteModalVisible={isNoteModalVisible}
                        setIsNoteModalVisible={setIsNoteModalVisible}
                        userInputs={userInputs}
                        currentIndex={currentIndex}
                        updateNote={updateNote}
                    />
            
                    <EndWorkoutModal
                        isEndWorkoutModalVisible={isEndWorkoutModalVisible}
                        setIsEndWorkoutModalVisible={setIsEndWorkoutModalVisible}
                        navigation={navigation}
                        exercises={userInputs}
                        workoutTitle={workoutTitle}
                        duration={time}
                        internetConnected={internetConnected}
                    />

                    <View style={tw`flex items-center mx-3 w-[95%]`}>
                        <TouchableOpacity style={tw`w-32 h-10 bg-white shadow-lg rounded-xl flex justify-center items-center`}>
                            <Text style={tw`text-red-500 font-semibold text-lg`}>{formatTime(time)}</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={tw`text-2xl font-bold ml-3 mb-5 mt-2`} ellipsizeMode='tail' numberOfLines={3}>{workoutTitle}</Text>
                    
                    <View style={tw`flex flex-col gap-y-1`}>
                        {newExercises.map((exercise: any, index: any) => {
                            if (exercise.exerciseIndex === currentIndex + 1) {
                                return (
                                    <View key={exercise.id} style={tw`w-full`}>
                                        
                                        <View style={tw`gap-x-3 mx-3 mb-3`}>
                                            <Text style={tw`text-xl text-blue-500 font-medium max-w-[85%]`} ellipsizeMode='tail' numberOfLines={3}>{exercise.title}</Text>
                                        </View>

                                        <ScrollView style={tw`h-[75%] mb-3`}>
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
                                                        
                                                        <View key={set.id} style={tw`ml-3`}>
                                                            <View style={tw`flex flex-row gap-x-2`}>
                                                                
                                                                <View style={tw`flex flex-col`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{t('set')}</Text>

                                                                    <View style={tw`w-10 h-10 ${backgroundColor} rounded-xl flex items-center justify-center ${mapIndex != 0 ? '' : ''}`}>
                                                                        <Text style={tw`text-base font-medium ${textColor}`}>{mapIndex + 1}</Text>
                                                                    </View>
                                                                </View>
                                                            
                                                                <View style={tw`flex flex-row gap-x-2 mb-3`}>

                                                                    <View style={tw`${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "w-[28.8%]" : iphoneModel.includes('SE') ? "w-[24.8%]" : "w-[26.8%]"}`}>
                                                                        <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{t('reps-short')}</Text>

                                                                        <TextInput
                                                                            style={tw`bg-neutral-100 rounded-xl p-2 w-full h-10`}
                                                                            keyboardType='number-pad'
                                                                            maxLength={4}
                                                                            placeholder={set.reps === "" ? t('reps-short') : set.reps.toString()}
                                                                            placeholderTextColor='#94a3b8'
                                                                            value={userInputs[index].sets[mapIndex].reps}
                                                                            onChangeText={(text) => {
                                                                                let updatedInputs = [...userInputs];
                                                                                updatedInputs[index].sets[mapIndex].reps = text;
                                                                                setUserInputs(updatedInputs);
                                                                            }}
                                                                        />
                                                                    </View>
                                                                    
                                                                    <View style={tw`w-[30.3%]`}>
                                                                        <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{t('weight')}</Text>

                                                                        <TextInput
                                                                            style={tw`bg-neutral-100 rounded-xl p-2 w-full h-10`}
                                                                            keyboardType='number-pad'
                                                                            maxLength={4}
                                                                            placeholder={set.weight === "" ? t('kilograms') : set.weight.toString()}
                                                                            placeholderTextColor='#94a3b8'
                                                                            value={userInputs[index].sets[mapIndex].weight}
                                                                            onChangeText={(text) => {
                                                                                let updatedInputs = [...userInputs];
                                                                                updatedInputs[index].sets[mapIndex].weight = text;
                                                                                setUserInputs(updatedInputs);
                                                                            }}
                                                                        />
                                                                    </View>
                                                                    
                                                                    <View style={tw`w-16`}>
                                                                        <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>RPE</Text>

                                                                        <TextInput
                                                                            style={tw`bg-neutral-100 rounded-xl p-2 w-full h-10`}
                                                                            keyboardType='number-pad'
                                                                            maxLength={2}
                                                                            placeholder='RPE'
                                                                            placeholderTextColor='#94a3b8'
                                                                            value={userInputs[index].sets[mapIndex].rpe}
                                                                            onChangeText={(text) => {
                                                                                let updatedInputs = [...userInputs];
                                                                                updatedInputs[index].sets[mapIndex].rpe = text;
                                                                                setUserInputs(updatedInputs);
                                                                            }}
                                                                        />
                                                                    </View>

                                                                    <Pressable style={tw`absolute right-[22px] w-10 h-6 bg-white shadow-sm border border-gray-200 rounded-2xl flex items-center justify-center ${mapIndex != 0 ? 'hidden' : ''}`}
                                                                        onPress={() => {
                                                                            setIsNoteModalVisible(true);
                                                                        }} 
                                                                    >
                                                                        <Ionicons name='ellipsis-horizontal' size={24} color='black' />
                                                                    </Pressable>

                                                                    <TouchableOpacity style={tw`bg-[#fd354a] rounded-2xl w-10 h-10 flex items-center justify-center ${mapIndex != 0 ? '' : 'mt-[30px]'}`} 
                                                                    onPress={() => removeSet(exercise.exerciseIndex, set.id, setUserInputs, setNewExercises, userInputs, newExercises, currentIndex)}
                                                                    >
                                                                        <Ionicons name='close' size={36} color='white' />
                                                                    </TouchableOpacity>
                                                                
                                                                </View>
                                                            </View>
                                                        </View>
                                                        
                                                    )
                                                })
                                            }

                                        </ScrollView>
                                        
                                    </View>
                                );
                            }
                        })}
                    </View>

                    <BottomNavigationBar
                        currentPage='ActiveWorkout'
                        navigation={navigation}
                        toggleEndWorkoutModal={handleEndWorkoutVisibilityFunc}
                        forwardButton={forwardButton}
                        backButton={backButton}
                        addActiveWorkoutSet={addSetFunc}
                        addActiveWorkoutExercise={addExerciseFunc}
                        activeWorkoutNumberOfExercises={workout.numberOfExercises + exercisesAdded - 1}
                    />

                </SafeAreaView>
            </TouchableWithoutFeedback>

        </>
        
    );
}

export default ActiveWorkout