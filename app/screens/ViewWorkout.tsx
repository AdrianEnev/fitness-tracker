import { View, Text, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, TextInput, Pressable, Button, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { addDoc, collection, deleteDoc, doc, getDocs, runTransaction, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { Ionicons } from '@expo/vector-icons';
import generateID from '../use/useGenerateID';
import saveWorkoutEdits from '../use/useSaveWorkoutEdits';
import startWorkout from '../use/useStartWorkout';
import { BlurView } from 'expo-blur';
import SetIntensityModal from '../components/SetIntensityModal';

const ViewWorkout = ({route, navigation}: any) => {

    const { exercises, workout, workoutTitle } = route.params;

    const [newWorkoutTitle, setNewWorkoutTitle] = useState('');

    const [currentIndex, setCurrentIndex] = useState(0);
    const [newExercises, setNewExercises] = useState<any>([...exercises]); // newExercises = copy of exercises
    const [userInputs, setUserInputs] = useState<any>(newExercises.map((exercise: any) => ({
        ...exercise,
        sets: exercise.sets.map((set: any) => ({...set, reps: set.reps, weight: set.weight}))
    })));

    const addSet = () => {
        const updatedExercises = [...newExercises];
        const updatedUserInputs = [...userInputs];
        const currentExerciseIndex = updatedExercises.findIndex((exercise: any) => exercise.exerciseIndex === currentIndex + 1);
        
        if (currentExerciseIndex !== -1) {
            if (updatedExercises[currentExerciseIndex].sets.length < 15) { // Check if the number of sets is less than 20
                const newSet = {
                    id: generateID(),
                    reps: "",
                    weight: ""
                };
                updatedExercises[currentExerciseIndex].sets.push(newSet);
                updatedUserInputs[currentExerciseIndex].sets.push({...newSet}); // Clone newSet to avoid direct reference
                
                setNewExercises(updatedExercises);
                setUserInputs(updatedUserInputs); // Ensure userInputs is also updated
            } else {
                console.log("Maximum number of sets reached");
            }
        }
    }

    const removeSet = (exerciseIndex: number, setId: string) => {
        const updatedExercises = [...newExercises];
        const updatedUserInputs = [...userInputs];
        const currentExerciseIndex = updatedExercises.findIndex((exercise: any) => exercise.exerciseIndex === exerciseIndex);
    
        if (currentExerciseIndex !== -1) {
            updatedExercises[currentExerciseIndex].sets = updatedExercises[currentExerciseIndex].sets.filter((set: any) => set.id !== setId);
            updatedUserInputs[currentExerciseIndex].sets = updatedUserInputs[currentExerciseIndex].sets.filter((set: any) => set.id !== setId);
            
            setNewExercises(updatedExercises);
            setUserInputs(updatedUserInputs); // Ensure userInputs is also updated
        }

        const currentExercise = updatedExercises.find(exercise => exercise.exerciseIndex === exerciseIndex);
        if (currentExercise) {
            currentExercise.sets.forEach((set: any, index: any) => {
                set.setIndex = index + 1;
            });
        }
    }

    const saveChanges = async () => {
        await saveWorkoutEdits(workout, userInputs, newExercises, newWorkoutTitle);
        navigation.navigate('Тренировки');
    }
    
    const addExercise = () => {
        if (newExercises.length < 9) {
            const newSet = {
                id: generateID(),
                reps: "", 
                weight: "" 
            };
        
            const newExercise = {
                id: generateID(),
                title: "Упражнение " + (newExercises.length + 1),
                exerciseIndex: newExercises.length + 1,
                sets: [newSet]
            };
        
            setNewExercises([...newExercises, newExercise]);
            setUserInputs([...userInputs, { ...newExercise, sets: [newSet] }]);
        
            // Update currentIndex to the newly added exercise
            setCurrentIndex(newExercises.length);
        }
    };

    const deleteWorkout = async () => {
        // delete the workout from the database
        const usersCollectionRef = collection(FIRESTORE_DB, "users");
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const userWorkoutsCollectionRef = collection(userDocRef, "workouts");
        const workoutDocRef = doc(userWorkoutsCollectionRef, workout.id);

        await deleteDoc(workoutDocRef);
        navigation.navigate('Тренировки');
    }

    const handleContentSizeChange = (event: any) => {
        const { height } = event.nativeEvent.contentSize;
        const lineHeight = 20; // Assuming the line height is 20, adjust this based on your TextInput style
        const lines = height / lineHeight;
    
        if (lines >= 2) {
          // If content spans 2 or more lines, add bottom margin
          setTextInputStyle(tw`text-xl text-blue-500 font-medium max-w-[85%] min-h-16 max-h-32 ml-3 mb-3`);
        } else {
          // No bottom margin needed for single line
          setTextInputStyle(tw`text-xl text-blue-500 font-medium max-w-[85%] min-h-16 max-h-32 ml-3 mb-[-10px]`);
        }
    };

    const updateExerciseTitle = (exerciseId: string, title: string) => {
    
        // Use newExercises instead of exercises to ensure we're updating the latest state
        const newExercisesUpdated = newExercises.map((exercise: any) => 
            exercise.id.toString() === exerciseId.toString() 
            ? { ...exercise, title } 
            : exercise
        );
        setNewExercises(newExercisesUpdated);
    
        // Ensure userInputs is also updated based on newExercisesUpdated to keep the state consistent
        const updatedUserInputs = userInputs.map((input: any) => 
            input.id.toString() === exerciseId.toString() 
            ? { ...input, title } 
            : input
        );
        setUserInputs(updatedUserInputs);
    };

    const [textInputStyle, setTextInputStyle] = useState({});

    const [saveButtonDisabled, setSaveButtonDisabled] = useState(false);

    const getDimensions = () => {
        const {width} = Dimensions.get('window')
        return width;
    }

    const [isSetIntensityModalVisible, setIsSetIntensityModalVisible] = useState(false)
    const [currentSelectedSet, setCurrentSelectedSet] = useState(0);

    const [intensityBoxSelected, setIntensityBoxSelected] = useState(0);

    const setSetIntensity = (setIntensityNumber: number) => {
        // Find the current exercise based on the currentIndex
        const updatedExercises = [...newExercises];
        const updatedUserInputs = [...userInputs];
    
        const currentExerciseIndex = updatedExercises.findIndex(
            (exercise: any) => exercise.exerciseIndex === currentIndex + 1
        );
    
        if (currentExerciseIndex !== -1) {
            // Assign the setIntensityNumber to the current selected set in both arrays
            updatedExercises[currentExerciseIndex].sets[currentSelectedSet - 1].intensity = setIntensityNumber;
            updatedUserInputs[currentExerciseIndex].sets[currentSelectedSet - 1].intensity = setIntensityNumber;
    
            // Update the state with the modified arrays
            setNewExercises(updatedExercises);
            setUserInputs(updatedUserInputs);
        }
    };
    

    return (
        <>

        { (isSetIntensityModalVisible) && (
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

                    <View style={tw`flex flex-row justify-between mx-3 w-[95%]`}>
                        <TouchableOpacity style={tw`w-22 h-10 bg-[#2fc766] shadow-md rounded-xl flex justify-center items-center`} onPress={saveChanges}>
                            <Text style={tw`text-white font-medium text-base`}>Назад</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={tw`w-22 h-10 bg-blue-500 rounded-xl flex justify-center items-center`} onPress={() => startWorkout(workout, navigation)}>
                            <Text style={tw`text-base font-medium text-white`}>Старт</Text>
                        </TouchableOpacity>
                        
                    </View>
                    
                    <TextInput 
                        style={tw`text-2xl font-bold mx-3 my-5`}
                        keyboardType='default'
                        multiline={true}
                        numberOfLines={2}
                        maxLength={50}
                        placeholder={workoutTitle}
                        placeholderTextColor='#93c5fd'
                        defaultValue={workoutTitle}
                        onChangeText={(text) => setNewWorkoutTitle(text)}
                    />

                    <View style={tw`flex flex-col gap-y-1`}>
                        {newExercises.map((exercise: any, index: any) => {
                            if (exercise.exerciseIndex === currentIndex + 1) {
                                return (
                                    <View key={exercise.id} style={tw`w-full h-[82%]`}>

                                        <TextInput 
                                            style={textInputStyle}
                                            keyboardType='default'
                                            multiline={true}
                                            numberOfLines={2}
                                            maxLength={50}
                                            placeholder={exercise.title}
                                            placeholderTextColor='#93c5fd'
                                            defaultValue={exercise.title}
                                            onChangeText={(text) => updateExerciseTitle(exercise.id, text)}
                                            onContentSizeChange={handleContentSizeChange}
                                        />
                                    
                                        <ScrollView style={tw`h-[75%] w-full mb-3`}>
                                            <View style={tw`flex-1`}>
                                                {exercise.sets.sort((a: any, b: any) => a.setIndex - b.setIndex).map((set: any, mapIndex: any) => {

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
                                                        (
                                                            <View key={set.id} style={tw`ml-3`}>
                                                                <View style={tw`flex flex-row gap-x-2`}>
                                                                    
                                                                    <View style={tw`flex flex-col`}>
                                                                        <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Сет</Text>
        
                                                                        <Pressable style={tw`w-10 h-10 ${backgroundColor} rounded-xl flex items-center justify-center`}
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
        
                                                                        <View style={tw`w-[39%]`}>
                                                                            <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>{getDimensions() > 400 ? 'Повторения' : 'Повт.'}</Text>
        
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
        
                                                                        <View style={tw`w-[39%]`}>
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
        
                                                                        <TouchableOpacity style={tw`bg-[#fd354a] rounded-2xl w-10 h-10 flex items-center justify-center ${mapIndex != 0 ? '' : 'mt-[30px]'}`} 
                                                                            onPress={() => removeSet(exercise.exerciseIndex, set.id)}
                                                                            >
                                                                                <Ionicons name='close' size={36} color='white' />
                                                                            </TouchableOpacity>
        
                                                                    </View>
                                                                </View>
                                                            </View>
                                                        ))}
                                                    )
                                                } 
                                            </View>
                                        </ScrollView>
                                    </View>
                                );
                            }
                        })}
                    </View>
                    
                    {newExercises.length > 1 ? (
                        <BottomNavigationBar
                            currentPage='ViewWorkout'
                            navigation={navigation}
                            deleteSavedWorkout={deleteWorkout}
                            workout={workout}
                            forwardButton={() => setCurrentIndex((currentIndex + 1) % newExercises.length)}
                            backButton={() => setCurrentIndex((currentIndex - 1 + newExercises.length) % exercises.length)}
                            viewWorkoutNumberOfExercises={newExercises.length}
                        />
                    ) : null}
                    

                </SafeAreaView>
            </TouchableWithoutFeedback>
        </>
    );
}

export default ViewWorkout