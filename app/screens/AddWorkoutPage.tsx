import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Exercise, Set } from '../../interfaces';
import addWorkout from '../use/useAddWorkout';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { BlurView } from 'expo-blur';
import { Dimensions } from 'react-native';
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

        exercises.map(exercise => {
            if (exercise.exerciseIndex == pageIndex - 1 && exercise.sets.length < 15) {
                setExercises(exercises.map(exercise => 
                    exercise.id === exerciseId 
                    ? { ...exercise, sets: [...exercise.sets, { reps: '', weight: '', id: Math.random().toString() }] } 
                    : exercise
                ));
            }
        })
       
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
        if (pageIndex < exercises.length && exercises.length < 9) {
            // Move to the next existing exercise
            setPageIndex(pageIndex + 1);
        } else if (exercises.length < 9) {
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

    const getDimensions = () => {
        const {width} = Dimensions.get('window')
        return width;
    }

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
                                            
                                        <ScrollView style={tw`mb-13`}>
                                            {exercise.sets.map((set, mapIndex) => (
                                                <View key={set.id} style={tw`ml-3`}>
                                                    <View style={tw`flex flex-row gap-x-2`}>
                                                        
                                                        <View style={tw`flex flex-col`}>
                                                            <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Сет</Text>

                                                            <View style={tw`w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center ${mapIndex != 0 ? '' : ''}`}>
                                                                <Text style={tw`text-base font-medium`}>{mapIndex + 1}</Text>
                                                            </View>
                                                        </View>

                                                        <View style={tw`flex flex-row gap-x-2 mb-3`}>

                                                            <View style={tw`w-[39.3%]`}>

                                                                <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{getDimensions() > 400 ? 'Повторения' : 'Повт.'}</Text>

                                                                <TextInput
                                                                    style={tw`bg-neutral-100 rounded-2xl p-2 w-full h-10`}
                                                                    keyboardType='number-pad'
                                                                    maxLength={4}
                                                                    value={set.reps.toString()}
                                                                    onChangeText={(value) => updateSet(exercise.id, set.id, 'reps', value)}
                                                                />

                                                            </View>

                                                            <View style={tw`w-[39.3%]`}>
                                                                <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Тежест</Text>

                                                                <TextInput
                                                                    style={tw`bg-neutral-100 rounded-2xl p-2 w-full h-10`}
                                                                    keyboardType='number-pad'
                                                                    maxLength={4}
                                                                    value={set.weight.toString()}
                                                                    onChangeText={(value) => updateSet(exercise.id, set.id, 'weight', value)}
                                                                />
                                                            </View>

                                                            <TouchableOpacity style={tw`bg-[#fd354a] rounded-2xl w-10 h-10 flex items-center justify-center ${mapIndex != 0 ? '' : 'mt-[30px]'}`} 
                                                            onPress={() => removeSet(exercise.id, set.id)}
                                                            >
                                                                <Ionicons name='close' size={36} color='white' />
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
                addWorkoutButton={() => setIsCreateWorkoutModalVisible(true)}
                addSetButton={() => addSet(exercises[pageIndex - 1].id)}
            />
            
        </>
        
    );
};

export default AddWorkoutPage;