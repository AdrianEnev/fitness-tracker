import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Exercise, Set } from '../../interfaces';
import addWorkout from '../use/useAddWorkout';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { BlurView } from 'expo-blur';
import {LinearGradient} from 'expo-linear-gradient';
import CreateWorkoutModal from '../components/CreateWorkoutModal';

const AddWorkoutPage = ({ navigation }: any) => {

    const newExercise: any = {
        title: '',
        sets: [{ reps: '', weight: '', id: Math.random().toString() }],
        exerciseIndex: 0,
        id: Math.random().toString(),
    };

    const [exercises, setExercises] = useState<Exercise[]>([newExercise]);
    const [pageIndex, setPageIndex] = useState(1)

    const [exerciseIndex, setExerciseIndex] = useState(1);

    const [workoutTitle, setWorkoutTitle] = useState('' as string);

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
                exerciseIndex: exerciseIndex,
                id: Math.random().toString(),
            };
            setExercises([...exercises, newExercise]);
            setPageIndex(pageIndex + 1);
            setExerciseIndex(exerciseIndex + 1); // increment exerciseIndex
        }
    };
    
    const previousExercise = () => {

        if (pageIndex === 1) return;

        // before moving to the next exercise, check if the current one does not have any of its inputs filled and if so delete it
        const currentExercise = exercises[pageIndex - 1];
        let isCurrentExerciseEmpty = currentExercise.sets.every((set) => set.reps === '' && set.weight === '' && currentExercise.title === '');
    
        if (isCurrentExerciseEmpty) {
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

    //colors={['#FFEFBA', '#FF7F7F']}

    const [isCreateWorkoutModalVisible, setIsCreateWorkoutModalVisible] = useState(false)

    const handleContentSizeChange = (event: any) => {
        const { height } = event.nativeEvent.contentSize;
        const lineHeight = 20; // Assuming the line height is 20, adjust this based on your TextInput style
        const lines = height / lineHeight;
    
        if (lines >= 2) {
          // If content spans 2 or more lines, add bottom margin
          setTextInputStyle(tw`text-xl text-blue-500 font-medium max-w-[85%] min-h-16 max-h-32 ml-3 mt-3 mb-3`);
        } else {
          // No bottom margin needed for single line
          setTextInputStyle(tw`text-xl text-blue-500 font-medium max-w-[85%] min-h-16 max-h-32 ml-3 mt-3 mb-[-10px]`);
        }
    };

    const [textInputStyle, setTextInputStyle] = useState({});

    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

    return (
        <>
            
            { isCreateWorkoutModalVisible && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={tw`w-full h-full bg-white`}>

                    <CreateWorkoutModal
                        isCreateWorkoutModalVisible={isCreateWorkoutModalVisible}
                        setIsCreateWorkoutModalVisible={setIsCreateWorkoutModalVisible}
                        exercises={exercises}
                        navigation={navigation}
                        workoutTitle={workoutTitle}
                        setWorkoutTitle={setWorkoutTitle}
                        saveButtonDisabled={saveButtonDisabled}
                        setSaveButtonDisabled={setSaveButtonDisabled}
                    />

                    <View style={tw`flex flex-col gap-y-1 max-h-[82%]`}>
                        {exercises.map((exercise, index) => {
                            if (index === pageIndex - 1) {
                                return (
                                    <View key={exercise.id} style={tw`w-full`}>

                                        <View style={tw`flex flex-row justify-between mx-3 w-[95%]`}>
                                            <TouchableOpacity style={tw`w-22 h-10 bg-[#2fc766] shadow-md rounded-xl flex justify-center items-center`} onPress={() => setIsCreateWorkoutModalVisible(true)}>
                                                <Text style={tw`text-white font-medium text-base`}>Запази</Text>
                                            </TouchableOpacity>

                                            
                                            <TouchableOpacity style={tw`w-22 h-10 bg-blue-500 rounded-xl flex justify-center items-center`} onPress={() => addSet(exercise.id)}>
                                                <Text style={tw`text-base font-medium text-white`}>+ Серия</Text>
                                            </TouchableOpacity>
                                            
                                        </View>

                                        <TextInput 
                                            style={textInputStyle}
                                            keyboardType='default'
                                            multiline={true}
                                            numberOfLines={2}
                                            maxLength={50}
                                            placeholder={`Упражнение ${exercise.exerciseIndex + 1}`}
                                            placeholderTextColor='#93c5fd'
                                            value={exercise.title || ''}
                                            onChangeText={(text) => updateExerciseTitle(exercise.id, text)}
                                            onContentSizeChange={handleContentSizeChange}
                                        />
                                            
                                        <ScrollView style={tw`mb-10`}>
                                            {exercise.sets.map((set, setIndex) => (
                                                <View key={set.id} style={tw`ml-3`}>
                                                    <View style={tw`flex flex-row gap-x-2`}>
                                                        <View style={tw`w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center`}>
                                                            <Text style={tw`text-base ml-5 absolute font-medium`}>{setIndex + 1}</Text>
                                                        </View>

                                                        <View style={tw`flex flex-row gap-x-2 mb-3`}>
                                                            <TextInput
                                                                style={tw`bg-neutral-100 rounded-2xl p-2 w-32 h-10`}
                                                                keyboardType='number-pad'
                                                                maxLength={4}
                                                                placeholder='Повторения'
                                                                value={set.reps.toString()}
                                                                onChangeText={(value) => updateSet(exercise.id, set.id, 'reps', value)}
                                                            />

                                                            <TextInput
                                                                style={tw`bg-neutral-100 rounded-2xl p-2 w-32 h-10`}
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

                                        </ScrollView>

                                        

                                    </View>
                                );
                            }
                        })}
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
            

            <BottomNavigationBar 
                navigation={navigation} 
                currentPage='AddWorkout' 
                forwardButton={nextExercise}
                backButton={previousExercise}
            />
            
        </>
        
    );
};

export default AddWorkoutPage;