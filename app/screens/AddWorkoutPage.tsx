import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import tw from 'twrnc';
import { Exercise, Set } from '../../interfaces';
import addWorkout from '../use/useAddWorkout';

const AddWorkoutPage = ({ navigation }: any) => {

    const newExercise: any = {
        title: 'Ново Упражнение',
        sets: [{ reps: 1, weight: 0, id: Math.random().toString() }],
        description: 'Description',
        exerciseIndex: 0,
        id: Math.random().toString(),
    };

    const [exercises, setExercises] = useState<Exercise[]>([newExercise]);

    const addSet = (exerciseId: string) => {
        setExercises(exercises.map(exercise => 
            exercise.id === exerciseId 
            ? { ...exercise, sets: [...exercise.sets, { reps: 1, weight: 0, id: Math.random().toString() }] } 
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

    const saveWorkout = async () => {

        console.log(exercises);

        /*await addWorkout(exercises);
        navigation.navigate('Тренировки');*/
    };

    return (
        <SafeAreaView style={tw`w-full h-full`}>
            <View style={tw`flex flex-col mx-3 gap-y-1`}>
                <Text style={tw`text-2xl font-medium`}>currentDayTitle</Text>
                {exercises.map((exercise, exerciseIndex) => (
                    <View key={exercise.id} style={tw`w-[86%]`}>
                        <Text style={tw`text-lg`} numberOfLines={1}>{exercise.title}</Text>
                        {exercise.sets.map((set, setIndex) => (
                            <View key={set.id} style={tw`mt-3 ml-5`}>
                                <View style={tw`flex flex-row gap-x-2`}>
                                    <View style={tw`w-10 h-10 bg-[#F2F2F2] rounded-xl flex items-center justify-center`}>
                                        <Text style={tw`text-base ml-5 absolute font-medium`}>{setIndex + 1}</Text>
                                    </View>
                                    <View style={tw`flex flex-row gap-x-2`}>
                                        <TextInput
                                            style={tw`bg-[#F2F2F2] rounded-2xl p-2 w-20 h-10 mb-5`}
                                            keyboardType='number-pad'
                                            maxLength={4}
                                            placeholder='reps'
                                        />
                                        <TextInput
                                            style={tw`bg-[#F2F2F2] rounded-2xl p-2 w-20 h-10 mb-5`}
                                            keyboardType='number-pad'
                                            maxLength={4}
                                            placeholder='KG'
                                        />
                                        <TextInput
                                            style={tw`bg-[#F2F2F2] rounded-2xl p-2 w-20 h-10 mb-5 `}
                                            keyboardType='number-pad'
                                            maxLength={2}
                                            placeholder='RPE'
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
                ))}
            </View>
            {/* Save Button */}
            <View style={tw`w-full absolute bottom-8`}>       
                <View style={tw`mx-2 flex flex-col h-full gap-y-2`}>
                    <TouchableOpacity style={tw`w-full h-12 bg-[#4ecdc4] rounded-xl flex justify-center items-center`} onPress={saveWorkout}>
                        <Text style={tw`text-lg text-gray-100 font-medium`}>Запази</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AddWorkoutPage;