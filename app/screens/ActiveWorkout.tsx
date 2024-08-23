import { View, Text, SafeAreaView, TextInput, TouchableWithoutFeedback, Pressable, TouchableOpacity, ScrollView, Keyboard, Modal } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc'
import BottomNavigationBar from '../components/BottomNavigationBar';
import { BlurView } from 'expo-blur';
import NoteModal from '../components/NoteModal';
import EndWorkoutModal from '../components/EndWorkoutModal';
import GlobalContext from '../../GlobalContext';

const ActiveWorkout = ({route, navigation}: any) => {

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

    const addSet = () => {
        // Use newExercises for updates to ensure UI consistency
        const updatedExercises = [...newExercises];
        const updatedUserInputs = [...userInputs]; // Clone userInputs for updates
    
        const currentExerciseIndex = updatedExercises.findIndex((exercise: any) => exercise.exerciseIndex === currentIndex + 1);
        if (currentExerciseIndex !== -1) {
            // Check if the current number of sets is less than 20
            if (updatedExercises[currentExerciseIndex].sets.length < 15) {
                const newSet = {
                    id: Math.random().toString(),
                    reps: "",
                    weight: ""
                };
    
                // Update both exercises and userInputs
                updatedExercises[currentExerciseIndex].sets.push(newSet);
                updatedUserInputs[currentExerciseIndex].sets.push({...newSet}); // Clone newSet for userInputs
    
                setNewExercises(updatedExercises);
                setUserInputs(updatedUserInputs); // Update userInputs to reflect the new set
            } else {
                // Optionally, you can show a message to the user indicating the max limit has been reached
                console.log("Maximum number of sets reached");
            }
        }
    }

    const addExercise = () => {
        // Use newExercises for updates to ensure UI consistency
        const updatedExercises = [...newExercises];
        const updatedUserInputs = [...userInputs]; // Clone userInputs for updates
    
        const newExercise = {
            id: Math.random().toString(),
            title: "New Exercise",
            sets: [{id: Math.random().toString(), reps: "", weight: ""}],
            exerciseIndex: updatedExercises.length + 1
        };
    
        updatedExercises.push(newExercise);
        updatedUserInputs.push({
            ...newExercise,
            sets: [{id: Math.random().toString(), reps: "", weight: ""}],
            note: ""
        });
    
        setNewExercises(updatedExercises);
        setUserInputs(updatedUserInputs);
    }

    useEffect(() => {
        if (exercises.length > 0) {
            setNewExercises([...exercises]);
        }
    }, [exercises]);

    const removeSet = (exerciseIndex: number, setId: string) => {
        // Update newExercises
        const updatedExercises = [...newExercises];
        const currentExercise = updatedExercises.find((exercise: any) => exercise.exerciseIndex === exerciseIndex);
        if (currentExercise) {
            currentExercise.sets = currentExercise.sets.filter((set: any) => set.id !== setId);
        }
        setNewExercises(updatedExercises);
    
        // Update userInputs to reflect the change
        const updatedUserInputs = [...userInputs];
        const currentUserInputExercise = updatedUserInputs.find((input: any) => input.exerciseIndex === exerciseIndex);
        if (currentUserInputExercise) {
            currentUserInputExercise.sets = currentUserInputExercise.sets.filter((set: any) => set.id !== setId);
        }
        setUserInputs(updatedUserInputs);
    };

    const updateNote = (exerciseIndex: number, note: string) => {
        const updatedInputs = [...userInputs];
        if (updatedInputs[exerciseIndex]) {
            updatedInputs[exerciseIndex].note = note; // Update the note for the specific exercise
            setUserInputs(updatedInputs); // Update the state
        }
    };

    const [time, setTime] = useState(0);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        const timeString = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        return timeString;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTime((prevTime) => prevTime + 1);
            
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const forwardButton = () => {

       

        if (workout.numberOfExercises > 1) {
            setCurrentIndex((currentIndex + 1) % newExercises.length);
        } else {
            setCurrentIndex(0);
        }
        
    }
    
    const backButton = () => {
       

        if (workout.numberOfExercises > 1) {
            setCurrentIndex((currentIndex - 1 + newExercises.length) % newExercises.length);
        } else {
            setCurrentIndex(0);
        }
        
    }

    const handleEndWorkoutVisibility = () => {
        // Check if userInputs are not empty and at least one userInput has sets with meaningful input
        const shouldShowModal = userInputs.length && userInputs.some((userInput: any) => {
            return userInput.sets && 
            userInput.sets.length > 0 && 
            userInput.sets.some((set: any) => set.reps !== '' || set.weight !== '');
        });
    
        // Additional check: Consider workout empty if all sets in all userInputs have no reps and weight input
        const isEverySetEmpty = userInputs.every((userInput: any) => {
            return userInput.sets.every((set: any) => set.reps === '' && set.weight === '');
        });
    
        if (shouldShowModal && !isEverySetEmpty) {
            setIsEndWorkoutModalVisible(true);
        } else {
            // If the condition is not met or all sets are empty, navigate to the main page directly
            navigation.navigate('Главна Страница');
        }
    };

    const getWorkoutDuration = () => {
       
        return time;
    }

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
                        duration={getWorkoutDuration()}
                        internetConnected={internetConnected}
                    />
                    

                    <View style={tw`flex flex-row justify-between mx-3 w-[95%]`}>
                        <TouchableOpacity style={tw`w-22 h-10 bg-[#fd354a] shadow-md rounded-xl flex justify-center items-center`}>
                            <Text style={tw`text-white font-medium text-base`}>{formatTime(time)}</Text>
                        </TouchableOpacity>

                        
                        <TouchableOpacity style={tw`w-22 h-10 bg-[#2fc766] rounded-xl flex justify-center items-center`} onPress={addSet}>
                            <Text style={tw`text-base font-medium text-white`}>+ Серия</Text>
                        </TouchableOpacity>
                        
                    </View>

                    
                    <Text style={tw`text-2xl font-bold ml-3 my-5`} ellipsizeMode='tail' numberOfLines={3}>{workoutTitle}</Text>
                    
                    <View style={tw`flex flex-col gap-y-1`}>
                        {newExercises.map((exercise: any, index: any) => {
                            if (exercise.exerciseIndex === currentIndex + 1) {
                                return (
                                    <View key={exercise.id} style={tw`w-full`}>
                                        
                                        <View style={tw`flex flex-row gap-x-3 mx-3 mb-3`}>
                                            <Text style={tw`text-xl text-blue-400 font-medium max-w-[85%]`} ellipsizeMode='tail' numberOfLines={3}>{exercise.title}</Text>
                                            
                                            <Pressable style={tw`w-12 h-8 bg-blue-200 rounded-xl flex items-center justify-center mt-[2px]`}
                                            onPress={() => setIsNoteModalVisible(true)}
                                            >
                                                <Ionicons name='folder-outline' color='#60a5fa' style={tw`mt-[-1px]`} size={24}/>
                                            </Pressable>
                                        </View>

                                        <ScrollView style={tw`h-[75%] mb-3`}>
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

                                                                    <View style={tw`w-10 h-10 ${backgroundColor} rounded-xl flex items-center justify-center ${mapIndex != 0 ? '' : ''}`}>
                                                                        <Text style={tw`text-base font-medium ${textColor}`}>{mapIndex + 1}</Text>
                                                                    </View>
                                                                </View>
                                                            
                                                                <View style={tw`flex flex-row gap-x-2 mb-3`}>

                                                                    <View style={tw`w-[30.3%]`}>
                                                                        <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Повт.</Text>

                                                                        <TextInput
                                                                            style={tw`bg-neutral-100 rounded-xl p-2 w-full h-10`}
                                                                            keyboardType='number-pad'
                                                                            maxLength={4}
                                                                            placeholder={set.reps === "" ? 'Повторения' : set.reps.toString()}
                                                                            value={userInputs[index].sets[mapIndex].reps}
                                                                            onChangeText={(text) => {
                                                                                let updatedInputs = [...userInputs];
                                                                                updatedInputs[index].sets[mapIndex].reps = text;
                                                                                setUserInputs(updatedInputs);
                                                                            }}
                                                                        />
                                                                    </View>
                                                                    
                                                                    <View style={tw`w-[30.3%]`}>
                                                                        <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Тежест</Text>

                                                                        <TextInput
                                                                            style={tw`bg-neutral-100 rounded-xl p-2 w-full h-10`}
                                                                            keyboardType='number-pad'
                                                                            maxLength={4}
                                                                            placeholder={set.weight === "" ? 'Килограми' : set.weight.toString()}
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
                                                                            value={userInputs[index].sets[mapIndex].rpe}
                                                                            onChangeText={(text) => {
                                                                                let updatedInputs = [...userInputs];
                                                                                updatedInputs[index].sets[mapIndex].rpe = text;
                                                                                setUserInputs(updatedInputs);
                                                                            }}
                                                                        />
                                                                    </View>

                                                                    <TouchableOpacity style={tw`bg-[#fd354a] rounded-2xl w-10 h-10 flex items-center justify-center ${mapIndex != 0 ? '' : 'mt-[30px]'}`} 
                                                                    onPress={() => removeSet(exercise.exerciseIndex, set.id)}
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
                        toggleEndWorkoutModal={handleEndWorkoutVisibility}
                        forwardButton={forwardButton}
                        backButton={backButton}
                        addActiveWorkoutSet={addSet}
                        addActiveWorkoutExercise={addExercise}
                    />

                </SafeAreaView>
            </TouchableWithoutFeedback>

        </>
        
    );
}

export default ActiveWorkout