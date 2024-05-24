import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Exercise, Set } from '../../interfaces';
import addWorkout from '../use/useAddWorkout';
import { Ionicons } from '@expo/vector-icons';

const AddWorkoutPage = ({ navigation }: any) => {

    const newExercise: any = {
        title: '',
        sets: [{ reps: '', weight: '', id: Math.random().toString() }],
        description: 'Description',
        exerciseIndex: 0,
        id: Math.random().toString(),
    };

    const [exercises, setExercises] = useState<Exercise[]>([newExercise]);
    const [pageIndex, setPageIndex] = useState(1)

    const [exerciseIndex, setExerciseIndex] = useState(1);

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
        if (pageIndex < exercises.length) {
            // Move to the next existing exercise
            setPageIndex(pageIndex + 1);
        } else {
            // Create a new exercise
            const newExercise: Exercise = {
                title: '',
                sets: [{ reps: "", weight: "", id: Math.random().toString() }],
                description: 'Description',
                exerciseIndex: exerciseIndex,
                id: Math.random().toString(),
            };
            setExercises([...exercises, newExercise]);
            setPageIndex(pageIndex + 1);
            setExerciseIndex(exerciseIndex + 1); // increment exerciseIndex
        }
    };
    
    const previousExercise = () => {

        // before moving to the next exercise, check if the current one does not have any of its inputs filled and if so delete it
        const currentExercise = exercises[pageIndex - 1];
        let isCurrentExerciseValid = true;
        currentExercise.sets.forEach((set) => {
            if (set.reps === '' && set.weight === '') {
                isCurrentExerciseValid = false;
            }
        });

        if (!isCurrentExerciseValid) {
            setExercises(exercises.filter((exercise) => exercise.id !== currentExercise.id));
            setExerciseIndex(exerciseIndex - 1); // decrement exerciseIndex
        }
        setPageIndex(pageIndex - 1);

    };

    const updateExerciseTitle = (exerciseId: string, title: string) => {
        setExercises(exercises.map(exercise => 
            exercise.id === exerciseId 
            ? { ...exercise, title } 
            : exercise
        ));
    };

    const saveWorkout = async () => {

        console.log('saving...')
        await addWorkout(exercises, navigation);
        console.log('saved.')
        //navigation.navigate('Тренировки');
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`w-full h-full`}>

                <View style={tw`flex flex-col gap-y-1 mb-15`}>
                    {exercises.map((exercise, index) => {
                        if (index === pageIndex - 1) {
                            return (
                                <View key={exercise.id} style={tw`w-full`}>

                                    <View style={tw`flex flex-row justify-between mb-6 mx-3`}>
                                        <TextInput 
                                            style={tw`text-2xl font-medium p-2 w-80 h-16`}
                                            keyboardType='default'
                                            multiline={false}
                                            maxLength={50}
                                            placeholder='Име на Упражнение'
                                            value={exercise.title || ''}
                                            onChangeText={(text) => updateExerciseTitle(exercise.id, text)}
                                        />
                                        
                                        <View style={tw`flex flex-col h-full gap-y-2`}>
                                            <TouchableOpacity style={tw`w-12 h-12 bg-green-500 rounded-full flex justify-center items-center`} onPress={saveWorkout}>
                                               <Ionicons name='save' size={24} color='#fff'/>
                                            </TouchableOpacity>
                                        </View>
                                        
                                    </View>
                                   
                                    <ScrollView style={tw`mb-10`}>
                                        {exercise.sets.map((set, setIndex) => (
                                            <View key={set.id} style={tw`ml-3`}>
                                                <View style={tw`flex flex-row gap-x-2`}>
                                                    <View style={tw`w-10 h-10 bg-white rounded-xl flex items-center justify-center`}>
                                                        <Text style={tw`text-base ml-5 absolute font-medium`}>{setIndex + 1}</Text>
                                                    </View>

                                                    <View style={tw`flex flex-row gap-x-2 mb-3`}>
                                                        <TextInput
                                                            style={tw`bg-white rounded-2xl p-2 w-32 h-10`}
                                                            keyboardType='number-pad'
                                                            maxLength={4}
                                                            placeholder='Повторения'
                                                            value={set.reps.toString()}
                                                            onChangeText={(value) => updateSet(exercise.id, set.id, 'reps', value)}
                                                        />

                                                        <TextInput
                                                            style={tw`bg-white rounded-2xl p-2 w-32 h-10`}
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

                                    </ScrollView>

                                    

                                </View>
                            );
                        }
                    })}
                </View>

                {/* Ako ima samo 1 uprajnenie ne se pokazva nishto*/}
                {/* ako e izbrano purvoto uprajennie se pokazva samo strelka napred zashtoto nqma drugo predi nego*/}
                {/* ako e izbrano poslednoto uprajennie se pokazva samo strelka nazad zashtoto nqma drugo sled nego*/}
                {/* v drugite sluchai se pokazvat i dvete strelki za nazad i za napred*/}
                <View style={tw`w-full absolute bottom-0`}>
                    {pageIndex == 1 ? (
                        <View style={tw`flex flex-row justify-between mx-3`}>
                            <Pressable onPress={previousExercise}>
                                <Ionicons name='arrow-back-circle-outline' size={77} color='#3B82F6' style={tw`hidden`}/>
                            </Pressable>

                            <Pressable  onPress={nextExercise}>
                                <Ionicons name='arrow-forward-circle-outline' size={77} color='#3B82F6'/>
                            </Pressable>
                        </View>
                    ) : pageIndex > 1 ? (
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
                
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default AddWorkoutPage;