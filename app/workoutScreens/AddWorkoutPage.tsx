import React, { useContext, useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ScrollView } from 'react-native';
import tw from 'twrnc';
import { Exercise } from '../../interfaces';
import addWorkout from '../useWorkout/useAddWorkout';
import { Ionicons } from '@expo/vector-icons';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { BlurView } from 'expo-blur';
import { Dimensions } from 'react-native';
import CreateWorkoutModal from '../modals/CreateWorkoutModal';
import SetIntensityModal from '../modals/SetIntensityModal';
import GlobalContext from '../../GlobalContext';
import generateID from '../use/useGenerateID';
import generateRandomColour from '../use/useGenerateColour';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '../use/useGetEmail';
import { useTranslation } from 'react-i18next';

const AddWorkoutPage = ({ navigation, route }: any) => {

    const { internetConnected, internetSpeed, iphoneModel } = useContext(GlobalContext);

    const { folder } = route.params;

    const {t} = useTranslation();
    
    const getExerciseTitle = async () => {

        let exerciseTitle = "Exercise";

        const currentLanguage = await AsyncStorage.getItem('language');
        if (currentLanguage == "bg") {
            return "Упражнение";
        } else if (currentLanguage == "de") {
            return "Übung";
        } else if (currentLanguage == "ru") {
            return "Упражнение";
        } else if (currentLanguage == "es") {
            return "Ejercicio";
        } else if (currentLanguage == "it") {
            return "Esercizio";
        } else {
            return exerciseTitle;
        }
    }

    const [exerciseTitle, setExerciseTitle] = useState<string>("Exercise");

    useEffect(() => {
        const fetchExerciseTitle = async () => {
            const title = await getExerciseTitle();
            setExerciseTitle(title);
        };

        fetchExerciseTitle();
    }, []);

    const newExercise: any = {
        title: '',
        sets: [{ reps: '', weight: '', id: Math.random().toString() }],
        exerciseIndex: 0,
        id: Math.random().toString(),
    };

    const [exercises, setExercises] = useState<Exercise[]>([newExercise]);
    const [pageNumber, setPageNumber] = useState(1)

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

        if (pageNumber == 1) return;

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

    const nextExercise = async () => {
        if (pageNumber < exercises.length && exercises.length < 9) {
            
            setPageNumber(pageNumber + 1);
            
        } else if (exercises.length < 9) {

            // Create a new exercise
            const newExercise: Exercise = {
                title: '',
                sets: [{ reps: "", weight: "", id: Math.random().toString(), intensity: 0 }],
                exerciseIndex: exerciseIndex,
                id: Math.random().toString(),
            };
            setExercises([...exercises, newExercise]);
            setPageNumber(pageNumber + 1);
            setExerciseIndex(exerciseIndex + 1); // increment exerciseIndex
        }
    };
    
    const previousExercise = () => {
        
        if (pageNumber === 1) return;
    
        const currentExercise = exercises[pageNumber - 1];
        const lastExercise = exercises[exercises.length - 1];
    
        // Check if the last exercise has been edited or has more than one set
        const isLastExerciseEdited = lastExercise.sets.some((set) => set.reps !== '' || set.weight !== '') || lastExercise.title !== '';
        const hasLastExerciseMultipleSets = lastExercise.sets.length > 1;
    
        // Check if the current exercise is empty
        const isCurrentExerciseEmpty = currentExercise.sets.every((set) => set.reps === '' && set.weight === '') && currentExercise.title === '' && currentExercise.sets.length === 1;
    
        if (isCurrentExerciseEmpty && !isLastExerciseEdited && !hasLastExerciseMultipleSets) {
            setExercises(exercises.filter((exercise) => exercise.id !== currentExercise.id));
            setExerciseIndex(exerciseIndex - 1); // decrement exerciseIndex
            console.log(`Exercise with id ${currentExercise.id} has been deleted`);
        }
        setPageNumber(pageNumber - 1);
    };
    
    const updateExerciseTitle = (exerciseId: string, title: string) => {
        setExercises(exercises.map(exercise => 
            exercise.id === exerciseId 
            ? { ...exercise, title } 
            : exercise
        ));
    };

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
    
        setExercises(exercises.map((exercise, exerciseIndex) => 
            exerciseIndex === pageNumber - 1
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

    const addRestDay = async () => {

        const email = await getEmail();

        const existingWorkouts = await AsyncStorage.getItem(`workouts_${email}`);
        const workouts = existingWorkouts ? JSON.parse(existingWorkouts) : [];

        const id = generateID();

        const newWorkout = {
            id: id,
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

        navigation.goBack();

        if (internetConnected) {
            addWorkout(
                [], 
                'Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($', 
                id, 
                folder
            );
        }
    }

    const deleteCurrentExercise = () => {

        if (pageNumber == 1) return;

        const currentExercise = exercises[pageNumber - 1];
        setExercises(exercises.filter((exercise) => exercise.id !== currentExercise.id));
        setExerciseIndex(exerciseIndex - 1); // decrement exerciseIndex
        
        setPageNumber(pageNumber - 1);
    }

    useEffect(() => {
        // Run when pageNumber or exercises change
        const currentExercise = exercises[pageNumber - 1];
    
        if (currentExercise && currentExercise.sets.length === 0 && pageNumber != 1) {
          deleteCurrentExercise();
        }
    }, [pageNumber, exercises]); 
    
    return (
        <>
            
            { (isCreateWorkoutModalVisible || isSetIntensityModalVisible) && (
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
                        addRestDay={addRestDay}
                        internetSpeed={internetSpeed}
                    />

                    <View style={tw`flex flex-col gap-y-1 max-h-[82%]`}>
                        {exercises.map((exercise, index) => {
                            if (index === pageNumber - 1) {
                                return (
                                    <View key={exercise.id} style={tw`w-full`}>

                                        <TextInput 
                                            style={textInputStyle}
                                            keyboardType='default'
                                            multiline={true}
                                            numberOfLines={2}
                                            maxLength={50}
                                            placeholder={`${exerciseTitle} ${exercise.exerciseIndex + 1}`}
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
                                                                <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{t('set')}</Text>
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
                                                                <View style={tw`${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "w-[39.3%]" : iphoneModel.includes('SE') ? "w-[37.2%]" : "w-[37.8%]"}`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{getDimensions() > 400 ? t('reps') : t('reps-short')}</Text>
                                                                    <TextInput
                                                                        style={tw`bg-neutral-100 rounded-2xl ${mapIndex == 0 ? "pl-[8px]" : "pl-[8px]"} w-full h-10`}
                                                                        keyboardType='number-pad'
                                                                        maxLength={4}
                                                                        placeholder={t('reps')}
                                                                        placeholderTextColor='#94a3b8'
                                                                        value={set.reps.toString()}
                                                                        onChangeText={(value) => updateSet(exercise.id, set.id, 'reps', value)}
                                                                    />
                                                                </View>
                                                                <View style={tw`w-[39.3%]`}>
                                                                    <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{t('weight')}</Text>
                                                                    <TextInput
                                                                        style={tw`bg-neutral-100 rounded-2xl p-2 w-full h-10`}
                                                                        keyboardType='number-pad'
                                                                        maxLength={4}
                                                                        placeholder={t('weight')}
                                                                        placeholderTextColor='#94a3b8'
                                                                        value={set.weight.toString()}
                                                                        onChangeText={(value) => updateSet(exercise.id, set.id, 'weight', value)}
                                                                    />
                                                                </View>


                                                                <Pressable style={tw`absolute ${iphoneModel.includes('SE') ? "right-6" : "right-7"} w-10 h-6 bg-white shadow-sm border border-gray-200 rounded-2xl flex items-center justify-center ${pageNumber == 1 ? 'hidden' : ''}`}
                                                                    onPress={() => {
                                                                        deleteCurrentExercise();
                                                                    }} 
                                                                >
                                                                    <Ionicons name='close' size={24} color='black' />
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
                addSetButton={() => addSet(exercises[pageNumber - 1].id)}
                addWorkoutPageCurrentExercise={pageNumber}
            />
            
        </>
        
    );
};

export default AddWorkoutPage;