import { View, Text, SafeAreaView, TextInput, TouchableWithoutFeedback, Pressable, TouchableOpacity, ScrollView, Keyboard } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import endWorkout from '../use/useEndWorkout';

const ActiveWorkout = ({route, navigation}: any) => {

    const { exercises } = route.params;
    const { workoutTitle } = route.params;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [newExercises, setNewExercises] = useState<any>([...exercises]); // newExercises = copy of exercises
    const [userInputs, setUserInputs] = useState<any>(newExercises.map((exercise: any) => ({
        ...exercise,
        sets: exercise.sets.map((set: any) => ({...set, reps: "", weight: ""}))
    })));

    

    const addSet = () => {
        const updatedExercises = [...exercises];
        const currentExercise = updatedExercises.find((exercise: any) => exercise.exerciseIndex === currentIndex + 1);
        if (currentExercise) {
            const newSet = {
                id: Math.random().toString(),
                reps: "",
                weight: ""
            };
            currentExercise.sets.push(newSet);
        }
        setNewExercises(updatedExercises);
    }

    const removeSet = (exerciseIndex: number, setId: string) => {
        const updatedExercises = [...newExercises];
        const currentExercise = updatedExercises.find((exercise: any) => exercise.exerciseIndex === exerciseIndex);
        if (currentExercise) {
            currentExercise.sets = currentExercise.sets.filter((set: any) => set.id !== setId);
        }
        setNewExercises(updatedExercises);
    }

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

    // <Ionicons name='save' size={24} color='#fff'/>

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`w-full h-full`}>

                <View style={tw`flex flex-row justify-between mt-2 mb-2 mx-3`}>
                    <TouchableOpacity style={tw`w-20 h-10 bg-white shadow-md rounded-xl flex justify-center items-center`}>
                        <Text>{formatTime(time)}</Text>
                    </TouchableOpacity>

                    <Text>{workoutTitle}</Text>

                    <View style={tw`flex flex-col h-full gap-y-2`}>
                        <TouchableOpacity style={tw`w-18 h-10 bg-white shadow-md rounded-xl flex justify-center items-center`} onPress={() => endWorkout(navigation, userInputs, workoutTitle)}>
                            <Text style={tw`text-black`}>Край</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                 

                <View style={tw`flex flex-col gap-y-1`}>
                    {newExercises.map((exercise: any, index: any) => {
                        if (exercise.exerciseIndex === currentIndex + 1) {
                            return (
                                <View key={exercise.id} style={tw`w-full`}>

                                    <Text style={tw`text-2xl font-medium text-center mb-4`} numberOfLines={1}>{exercise.title}</Text>
                                    
                                    <ScrollView style={tw``}>
                                        {exercise.sets.sort((a: any, b: any) => a.setIndex - b.setIndex).map((set: any, mapIndex: any) => (
                                            <View key={set.id} style={tw`ml-3`}>
                                                <View style={tw`flex flex-row gap-x-2`}>
                                                    <View style={tw`w-10 h-10 bg-white rounded-xl flex items-center justify-center`}>
                                                        <Text style={tw`text-base ml-5 absolute font-medium`}>{mapIndex + 1}</Text>
                                                    </View>

                                                    <View style={tw`flex flex-row gap-x-2 mb-3`}>
                                                        <TextInput
                                                            style={tw`bg-white rounded-2xl p-2 w-32 h-10`}
                                                            keyboardType='number-pad'
                                                            maxLength={4}
                                                            placeholder={set.reps === "" ? 'Повторения' : set.reps.toString() + ' Повт.'}
                                                            value={userInputs[index].sets[mapIndex].reps}
                                                            onChangeText={(text) => {
                                                                let updatedInputs = [...userInputs];
                                                                updatedInputs[index].sets[mapIndex].reps = text;
                                                                setUserInputs(updatedInputs);
                                                            }}
                                                           
                                                        />

                                                        <TextInput
                                                            style={tw`bg-white rounded-2xl p-2 w-32 h-10`}
                                                            keyboardType='number-pad'
                                                            maxLength={4}
                                                            placeholder={set.weight === "" ? 'Килограми' : set.weight.toString() + ' KG'}
                                                            value={userInputs[index].sets[mapIndex].weight}
                                                            onChangeText={(text) => {
                                                                let updatedInputs = [...userInputs];
                                                                updatedInputs[index].sets[mapIndex].weight = text;
                                                                setUserInputs(updatedInputs);
                                                            }}
                                                            
                                                        />

                                                        <TouchableOpacity style={tw`bg-red-500 rounded-2xl w-21 h-10 flex items-center justify-center`} onPress={() => removeSet(exercise.exerciseIndex, set.id)}>
                                                            <Text style={tw`text-white`}>Изтрий</Text>
                                                        </TouchableOpacity>

                                                    </View>
                                                </View>
                                            </View>
                                        ))}

                                        <View style={tw`mx-3`}>
                                            <TouchableOpacity style={tw`w-full h-12 bg-green-500 rounded-xl flex justify-center items-center`} onPress={addSet}>
                                                <Text style={tw`text-lg text-white`}>+ Добави Серия</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </ScrollView>
                                </View>
                            );
                        }
                    })}
                </View>

                <View style={tw`flex flex-row justify-between p-4`}>
                    <TouchableOpacity 
                        style={tw`w-24 h-12 bg-green-500 rounded-full flex justify-center items-center`}
                        onPress={() => setCurrentIndex((currentIndex - 1 + newExercises.length) % exercises.length)} // Switch to previous exercise
                    >
                        <Text style={tw`text-lg text-white`}>-</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={tw`w-24 h-12 bg-green-500 rounded-full flex justify-center items-center`}
                        onPress={() => setCurrentIndex((currentIndex + 1) % newExercises.length)} // Switch to next exercise
                    >
                        <Text style={tw`text-lg text-white`}>+</Text>
                    </TouchableOpacity>
                </View>

                
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default ActiveWorkout