import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native';
import tw from 'twrnc';
import { Exercise, Set } from '../../interfaces';
import addWorkout from '../use/useAddWorkout';
import { Ionicons } from '@expo/vector-icons';

const AddWorkoutPage = ({ navigation }: any) => {

    const newExercise: any = {
        title: 'Ново Упражнение',
        sets: [{ reps: '', weight: '', id: Math.random().toString() }],
        description: 'Description',
        exerciseIndex: 0,
        id: Math.random().toString(),
    };

    const [exercises, setExercises] = useState<Exercise[]>([newExercise]);
    const [exerciseIndex, setExerciseIndex] = useState(1)

    const addSet = (exerciseId: string) => {
        setExercises(exercises.map(exercise => 
            exercise.id === exerciseId 
            ? { ...exercise, sets: [...exercise.sets, { reps: '', weight: '', id: Math.random().toString() }] } 
            : exercise
        ));
    };

    const removeSet = (exerciseId: string, setId: string) => {
        setExercises(exercises.map(exercise => 
            exercise.id === exerciseId 
            ? { ...exercise, sets: exercise.sets.filter(set => set.id !== setId) } 
            : exercise
        ));
    };

    const updateSet = (exerciseId: string, setId: string, field: 'reps' | 'weight', value: string) => {
        setExercises(exercises.map(exercise => 
            exercise.id === exerciseId 
            ? { ...exercise, sets: exercise.sets.map(set => 
                set.id === setId 
                ? { ...set, [field]: value } 
                : set
            )} 
            : exercise
        ));
    };

    const nextExercise = () => {
        if (exerciseIndex < exercises.length) {
            // Move to the next existing exercise
            setExerciseIndex(exerciseIndex + 1);
        } else {
            // Create a new exercise
            const newExercise: Exercise = {
                title: 'Ново Упражнение',
                sets: [{ reps: "", weight: "", id: Math.random().toString() }],
                description: 'Description',
                exerciseIndex: exerciseIndex,
                id: Math.random().toString(),
            };
            setExercises([...exercises, newExercise]);
            setExerciseIndex(exerciseIndex + 1);
        }
    };
    
    const previousExercise = () => {
        if (exerciseIndex > 1) {
            // Move to the previous exercise
            setExerciseIndex(exerciseIndex - 1);
        }
    };

    const saveWorkout = async () => {

        exercises.forEach((exercise) => {
            console.log(`Exercise ID: ${exercise.id}`);
            console.log(`Exercise Title: ${exercise.title}`);
            exercise.sets.forEach((set, index) => {
                console.log(`Set ${index + 1}:`);
                console.log(`Reps: ${set.reps}`);
                console.log(`Weight: ${set.weight}`);
            });
            console.log('-------------------');
        });

        /*await addWorkout(exercises);
        navigation.navigate('Тренировки');*/
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`w-full h-full`}>

                <View style={tw`flex flex-col gap-y-1`}>
                    {exercises.map((exercise, index) => {
                        if (index === exerciseIndex - 1) {
                            return (
                                <View key={exercise.id} style={tw`w-full`}>
                                    <Text style={tw`text-2xl font-medium text-center mb-5`} numberOfLines={1}>{exercise.title}</Text>
                                    {exercise.sets.map((set, setIndex) => (
                                        <View key={set.id} style={tw`ml-3`}>
                                            <View style={tw`flex flex-row gap-x-2`}>
                                                <View style={tw`w-10 h-10 bg-white rounded-xl flex items-center justify-center`}>
                                                    <Text style={tw`text-base ml-5 absolute font-medium`}>{setIndex + 1}</Text>
                                                </View>

                                                <View style={tw`flex flex-row gap-x-2 mb-3`}>
                                                    <TextInput
                                                        style={tw`bg-white rounded-2xl p-2 w-20 h-10`}
                                                        keyboardType='number-pad'
                                                        maxLength={4}
                                                        placeholder='Повт.'
                                                        value={set.reps.toString()}
                                                        onChangeText={(value) => updateSet(exercise.id, set.id, 'reps', value)}
                                                    />

                                                    <TextInput
                                                        style={tw`bg-white rounded-2xl p-2 w-20 h-10`}
                                                        keyboardType='number-pad'
                                                        maxLength={4}
                                                        placeholder='KG'
                                                        value={set.weight.toString()}
                                                        onChangeText={(value) => updateSet(exercise.id, set.id, 'weight', value)}
                                                    />


                                                    <TouchableOpacity style={tw`bg-red-500 rounded-2xl w-20 h-10 flex items-center justify-center`} onPress={() => removeSet(exercise.id, set.id)}>
                                                        <Text style={tw`text-white`}>Изтрий</Text>
                                                    </TouchableOpacity>

                                                </View>
                                            </View>
                                        </View>
                                    ))}

                                    <View style={tw`mx-3`}>
                                        <TouchableOpacity style={tw`w-full h-12 bg-green-500 rounded-xl flex justify-center items-center`} onPress={() => addSet(exercise.id)}>
                                            <Text style={tw`text-lg text-white`}>+ Добави Серия</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            );
                        }
                    })}
                </View>

                {/* Ako ima samo 1 uprajnenie ne se pokazva nishto*/}
                {/* ako e izbrano purvoto uprajennie se pokazva samo strelka napred zashtoto nqma drugo predi nego*/}
                {/* ako e izbrano poslednoto uprajennie se pokazva samo strelka nazad zashtoto nqma drugo sled nego*/}
                {/* v drugite sluchai se pokazvat i dvete strelki za nazad i za napred*/}
                <View style={tw`w-full absolute bottom-16`}>
                    {exerciseIndex == 1 ? (
                        <View style={tw`flex flex-row justify-between mx-3`}>
                            <Pressable onPress={previousExercise}>
                                <Ionicons name='arrow-back-circle-outline' size={77} color='#3B82F6' style={tw`hidden`}/>
                            </Pressable>

                            <Pressable  onPress={nextExercise}>
                                <Ionicons name='arrow-forward-circle-outline' size={77} color='#3B82F6'/>
                            </Pressable>
                        </View>
                    ) : exerciseIndex > 1 ? (
                        <View style={tw`flex flex-row justify-between mx-3`}>
                            
                            <Pressable onPress={previousExercise}>
                                <Ionicons name='arrow-back-circle-outline' size={77} color='#3B82F6'/>
                            </Pressable>

                            <Pressable  onPress={nextExercise}>
                                <Ionicons name='arrow-forward-circle-outline' size={77} color='#3B82F6'/>
                            </Pressable>

                        </View>
                    ) : null}
                </View>
                
                {/* Save Button */}
                <View style={tw`w-full absolute bottom-8`}>       
                    <View style={tw`mx-3 flex flex-col h-full gap-y-2`}>
                        <TouchableOpacity style={tw`w-full h-12 bg-[#4ecdc4] rounded-xl flex justify-center items-center`} onPress={saveWorkout}>
                            <Text style={tw`text-lg text-gray-100 font-medium`}>Запази</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default AddWorkoutPage;