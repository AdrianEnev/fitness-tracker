import React, { useContext, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Exercise, Set } from '../../interfaces';
import addWorkout from '../useWorkout/useAddWorkout';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { BlurView } from 'expo-blur';
import { Dimensions } from 'react-native';
import CreateWorkoutModal from '../modals/CreateWorkoutModal';
import SetIntensityModal from '../modals/SetIntensityModal';
import GlobalContext from '../../GlobalContext';
import ExerciseOptionsModal from '../modals/ExerciseOptionsModal';
import generateID from '../use/useGenerateID';
import generateRandomColour from '../use/useGenerateColour';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '../use/useGetEmail';

const AddWorkoutPage = ({ navigation, route }: any) => {

    const {internetConnected} = useContext(GlobalContext);

    const { folder } = route.params;

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
            exercise.id === exerciseId && exercise.sets.length < 15
            ? { ...exercise, sets: [...exercise.sets, { reps: '', weight: '', id: Math.random().toString(), intensity: 0 }] }
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
        if (pageIndex < exercises.length && exercises.length < 9) {
            // Move to the next existing exercise
            setPageIndex(pageIndex + 1);
        } else if (exercises.length < 9) {
            // Create a new exercise
            const newExercise: Exercise = {
                title: '',
                sets: [{ reps: "", weight: "", id: Math.random().toString(), intensity: 0 }],
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
        let isCurrentExerciseEmpty = currentExercise.sets.every((set) => set.reps === '' && set.weight === '' && currentExercise.title === '') && currentExercise.sets.length === 1;
    
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

    // dont remove set if set number == 1

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

    
    const [isSetIntensityModalVisible, setIsSetIntensityModalVisible] = useState(false)
    const [currentSelectedSet, setCurrentSelectedSet] = useState(0)
    const [intensityBoxSelected, setIntensityBoxSelected] = useState(0)
    
    const setSetIntensity = (setIntensityNumber: number) => {
        console.log('setSetIntensity called with:', setIntensityNumber);
        console.log('currentSelectedSet:', currentSelectedSet);
        console.log('pageIndex:', pageIndex);
    
        setExercises(exercises.map((exercise, exerciseIndex) => 
            exerciseIndex === pageIndex - 1
            ? { 
                ...exercise, 
                sets: exercise.sets.map((set, setIndex) => 
                    setIndex === currentSelectedSet - 1
                    ? { ...set, intensity: setIntensityNumber }
                    : set
                )
            }
            : exercise
        ));
    };

    const [isExerciseOptionsModalVisible, setIsExerciseOptionsModalVisible] = useState(false);

    const addRestDay = async () => {
        //add empty workout with name 'Rest Day'

        const email = await getEmail();

        const existingWorkouts = await AsyncStorage.getItem(`workouts_${email}`);
        const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        const newWorkout = {
            id: generateID(),
            title: 'Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($',
            created: new Date().toISOString(),
            colour: generateRandomColour(),
            numberOfExercises: 0,
            info: [] as any[]
        };

        workouts.push(newWorkout);

        if (folder) {
            const data = await AsyncStorage.getItem(`folders_${email}`);
            let folders = data ? JSON.parse(data) : [];
            const index = folders.findIndex((f: any) => f.id === folder.id);
            folders[index].workouts.push(newWorkout);
            await AsyncStorage.setItem(`folders_${email}`, JSON.stringify(folders));
        }else{
            await AsyncStorage.setItem(`workouts_${email}`, JSON.stringify(workouts));
        }
    }


    const deleteCurrentExercise = () => {

        const currentExercise = exercises[pageIndex - 1];
        setExercises(exercises.filter((exercise) => exercise.id !== currentExercise.id));
        setExerciseIndex(exerciseIndex - 1); // decrement exerciseIndex
        
        if (pageIndex !== 1) {
            setPageIndex(pageIndex - 1);
        }
    }

    return (
        <>
            
            { (isCreateWorkoutModalVisible || isSetIntensityModalVisible || isExerciseOptionsModalVisible) && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={tw`w-full h-full bg-white`}>

                    <SetIntensityModal
                        isSetIntensityModalVisible={isSetIntensityModalVisible}
                        setIsSetIntensityModalVisible={setIsSetIntensityModalVisible}
                        setNumber={currentSelectedSet}
                        intensityBoxSelected={intensityBoxSelected}
                        setIntensityBoxSelected={setIntensityBoxSelected}
                        setSetIntensity={setSetIntensity}
                    />

                    <CreateWorkoutModal
                        isCreateWorkoutModalVisible={isCreateWorkoutModalVisible}
                        setIsCreateWorkoutModalVisible={setIsCreateWorkoutModalVisible}
                        exercises={exercises}
                        navigation={navigation}
                        workoutTitle={workoutTitle}
                        setWorkoutTitle={setWorkoutTitle}
                        saveButtonDisabled={saveButtonDisabled}
                        setSaveButtonDisabled={setSaveButtonDisabled}
                        internetConnected={internetConnected}
                        folder={folder}
                    />

                    <ExerciseOptionsModal 
                        navigation={navigation}
                        isExerciseOptionsModalVisible={isExerciseOptionsModalVisible}
                        setIsExerciseOptionsModalVisible={setIsExerciseOptionsModalVisible}
                        addRestDay={addRestDay}
                        pageIndex={pageIndex}
                        deleteCurrentExercise={deleteCurrentExercise}
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
                                            {exercise.sets.map((set, mapIndex) => {
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
                                                                <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Сет</Text>
                                                                <Pressable
                                                                    style={tw`w-10 h-10 ${backgroundColor} rounded-xl flex items-center justify-center`}
                                                                    onPress={() => {
                                                                        setIsSetIntensityModalVisible(true);
                                                                        setCurrentSelectedSet(mapIndex + 1);
                                                                        setIntensityBoxSelected(0);

                                                                    }}
                                                                >
                                                                    <Text style={tw`text-base font-medium ${textColor}`}>{mapIndex + 1}</Text>
                                                                </Pressable>
                                                            </View>
                                                            <View style={tw`flex flex-row gap-x-2 mb-3`}>
                                                                <View style={tw`w-[39.3%]`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{getDimensions() > 400 ? 'Повторения' : 'Повт.'}</Text>
                                                                    <TextInput
                                                                        style={tw`bg-neutral-100 rounded-2xl p-2 w-full h-10`}
                                                                        keyboardType='number-pad'
                                                                        maxLength={4}
                                                                        placeholder='Повторения'
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
                                                                        placeholder='Тежест'
                                                                        value={set.weight.toString()}
                                                                        onChangeText={(value) => updateSet(exercise.id, set.id, 'weight', value)}
                                                                    />
                                                                </View>


                                                                <Pressable style={tw`absolute right-7 w-10 h-6 bg-white shadow-sm border border-gray-200 rounded-2xl flex items-center justify-center ${mapIndex != 0 ? 'hidden' : ''}`}
                                                                    onPress={() => {
                                                                        setIsExerciseOptionsModalVisible(true)
                                                                    }} 
                                                                >
                                                                    <Ionicons name='ellipsis-horizontal' size={24} color='black' />
                                                                </Pressable>

                                                                <TouchableOpacity
                                                                    style={tw`bg-[#fd354a] rounded-2xl w-10 h-10 flex items-center justify-center ${mapIndex != 0 ? '' : 'mt-[30px]'}`}
                                                                    onPress={() => removeSet(exercise.id, set.id)}
                                                                >
                                                                    <Ionicons name='close' size={36} color='white' />
                                                                </TouchableOpacity>
                                                            </View>
                                                        </View>
                                                    </View>
                                                );
                                            })}
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
                addWorkoutPageCurrentExercise={pageIndex}
            />
            
        </>
        
    );
};

export default AddWorkoutPage;