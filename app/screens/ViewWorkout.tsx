import { View, Text, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, TextInput, Pressable, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { addDoc, collection, deleteDoc, doc, getDocs, runTransaction, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { Ionicons } from '@expo/vector-icons';

const ViewWorkout = ({route, navigation}: any) => {

    const { exercises, workout, workoutTitle } = route.params;

    const [newWorkoutTitle, setNewWorkoutTitle] = useState('');

    const [currentIndex, setCurrentIndex] = useState(0);
    const [newExercises, setNewExercises] = useState<any>([...exercises]); // newExercises = copy of exercises
    const [userInputs, setUserInputs] = useState<any>(newExercises.map((exercise: any) => ({
        ...exercise,
        sets: exercise.sets.map((set: any) => ({...set, reps: set.reps, weight: set.weight}))
    })));

    const generateID = () => {
        // generate ID that would resemble what firebase would generate
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    const addSet = () => {
        const updatedExercises = [...newExercises];
        const updatedUserInputs = [...userInputs];
        const currentExerciseIndex = updatedExercises.findIndex((exercise: any) => exercise.exerciseIndex === currentIndex + 1);
        
        if (currentExerciseIndex !== -1) {
            const newSet = {
                id: generateID(),
                reps: "",
                weight: ""
            };
            updatedExercises[currentExerciseIndex].sets.push(newSet);
            updatedUserInputs[currentExerciseIndex].sets.push({...newSet}); // Clone newSet to avoid direct reference
            
            setNewExercises(updatedExercises);
            setUserInputs(updatedUserInputs); // Ensure userInputs is also updated
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

    const saveWorkout = async () => {
        
        const usersCollectionRef = collection(FIRESTORE_DB, "users");
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const userWorkoutsCollectionRef = collection(userDocRef, "workouts");
        const workoutDocRef = doc(userWorkoutsCollectionRef, workout.id);
        const workoutInfoCollectionRef = collection(workoutDocRef, "info");

        const data = await getDocs(workoutInfoCollectionRef);
        const exercisesData: any[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        navigation.navigate('Тренировки');

        for (let exercise of exercisesData) {
            const setsCollectionRef = collection(workoutInfoCollectionRef, exercise.id, "sets");
            const setsData = await getDocs(setsCollectionRef);
            const sets: any[] = setsData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            exercise.sets = sets;

            const currentExercise = userInputs.find((input: any) => input.id === exercise.id);
            if (currentExercise) {
               
                for (let set of exercise.sets) {
                    const currentSet = currentExercise.sets.find((inputSet: any) => inputSet.id === set.id);
                    if (currentSet) {
                        setDoc(doc(setsCollectionRef, set.id), {
                            reps: currentSet.reps,
                            weight: currentSet.weight,
                            setIndex: currentSet.setIndex
                        });
                    }
                }

                // Adding new sets
                const addedSets = currentExercise.sets.filter((set: any) => !sets.some((dbSet: any) => dbSet.id === set.id));
                let nextIndex = sets.length; // Start indexing for new sets after the existing ones
                for (let addedSet of addedSets) {
                    const newSetRef = doc(setsCollectionRef);
                    setDoc(newSetRef, {
                        reps: addedSet.reps,
                        weight: addedSet.weight,
                        setIndex: nextIndex + 1
                    });
                    nextIndex++;
                }

                // Check if any sets were removed (and not added)
                const removedSetsExist = sets.length > currentExercise.sets.length;
                if (removedSetsExist) {
                    // First, delete all existing sets in Firestore to start fresh
                    for (let set of sets) {
                        const setDocRef = doc(setsCollectionRef, set.id);
                        deleteDoc(setDocRef);
                    }

                    // Then, add back all current sets with new indexes
                    currentExercise.sets.forEach((set: any, index: number) => {
                        const newSetRef = doc(setsCollectionRef, set.id ? set.id : generateID()); // Use existing ID or generate a new one
                        setDoc(newSetRef, {
                            reps: set.reps,
                            weight: set.weight,
                            setIndex: index + 1 // Re-index starting from 1
                        });
                    });
                }

                // check if any of the exercise titles have been updated
                const currentExerciseTitle = newExercises.find((ex: any) => ex.id === exercise.id);
                if (currentExerciseTitle) {
                    setDoc(doc(workoutInfoCollectionRef, exercise.id), {
                        title: currentExerciseTitle.title,
                        exerciseIndex: currentExerciseTitle.exerciseIndex
                    });
                }
            }

        }

        // check if any new exercises have been added to the workout
        const addedExercises = userInputs.filter((input: any) => !exercisesData.some((dbExercise: any) => dbExercise.id === input.id));
        let nextIndex = exercisesData.length;

        for (let addedExercise of addedExercises) {
            // Generate title if empty, similar to useAddWorkout.tsx logic
            if (addedExercise.title === '') {
                addedExercise.title = "Упражнение " + (nextIndex + 1);
            }

            const newExerciseRef = doc(workoutInfoCollectionRef, (nextIndex + 1).toString());
            await setDoc(newExerciseRef, {
                title: addedExercise.title.trim(),
                exerciseIndex: nextIndex + 1
            });

            const setsCollectionRef = collection(newExerciseRef, "sets");
            let setIndex = 1;
            for (let set of addedExercise.sets) {
                await addDoc(setsCollectionRef, {
                    reps: set.reps,
                    weight: set.weight,
                    setIndex: setIndex
                });
                setIndex++;
            }
            nextIndex++;
        }

        if (newWorkoutTitle === '') {
            setDoc(workoutDocRef, {
                title: workout.title,
                created: workout.created,
                colour: workout.colour,
                numberOfExercises: nextIndex
            });
            return;
        }
        setDoc(workoutDocRef, {
            title: newWorkoutTitle,
            created: workout.created,
            colour: workout.colour,
            numberOfExercises: nextIndex
        });
    }

    const deleteExercise = (exerciseIndex: number) => {

        const updatedExercises = newExercises.filter((exercise: any) => exercise.exerciseIndex !== exerciseIndex);
        const updatedUserInputs = userInputs.filter((input: any) => input.exerciseIndex !== exerciseIndex);
        setNewExercises(updatedExercises);
        setUserInputs(updatedUserInputs);

        setCurrentIndex(currentIndex - 1);
    }

    const addExercise = () => {
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

        setCurrentIndex(newExercises.length);
    }

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
          setTextInputStyle(tw`text-xl text-blue-500 font-medium max-w-[85%] min-h-16 max-h-32 ml-3 mt-3 mb-3`);
        } else {
          // No bottom margin needed for single line
          setTextInputStyle(tw`text-xl text-blue-500 font-medium max-w-[85%] min-h-16 max-h-32 ml-3 mt-3 mb-[-10px]`);
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

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`w-full h-full bg-white`}>

                <View style={tw`flex flex-row justify-between mx-3 w-[95%]`}>
                    <TouchableOpacity style={tw`w-22 h-10 bg-[#2fc766] shadow-md rounded-xl flex justify-center items-center`} onPress={saveWorkout}>
                        <Text style={tw`text-white font-medium text-base`}>Запази</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity style={tw`w-22 h-10 bg-blue-500 rounded-xl flex justify-center items-center`} onPress={addSet}>
                        <Text style={tw`text-base font-medium text-white`}>+ Серия</Text>
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

                                    {currentIndex > 0 ? <Button title='delete' onPress={() => deleteExercise(exercise.exerciseIndex)} /> : null}
                                
                                    <ScrollView style={tw`h-[75%] mb-3`}>
                                        {exercise.sets.sort((a: any, b: any) => a.setIndex - b.setIndex).map((set: any, mapIndex: any) => (
                                            <View key={set.id} style={tw`ml-3`}>
                                                <View style={tw`flex flex-row gap-x-2`}>
                                                    
                                                    <View style={tw`flex flex-col`}>
                                                        <Text style={tw`text-base font-medium mb-1 ml-1 ${mapIndex != 0 ? 'hidden' : ''}`}>Сет</Text>

                                                        <View style={tw`w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center ${mapIndex != 0 ? '' : ''}`}>
                                                            <Text style={tw`text-base font-medium`}>{mapIndex + 1}</Text>
                                                        </View>
                                                    </View>

                                                    <View style={tw`flex flex-row gap-x-2 mb-3`}>

                                                        <View style={tw`w-[39%]`}>
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

                                    </ScrollView>
                                </View>
                            );
                        }
                    })}
                </View>

                <Pressable style={tw`
                    absolute w-[96.5%] h-16 shadow-lg bottom-30 mx-2 rounded-2xl flex flex-row justify-around items-center
                    bg-[#fd1c47]
                `}
                onPress={addExercise}
                >
                    <Text style={tw`text-white text-3xl font-medium`}>+ Упражнение</Text>
                </Pressable>

                <BottomNavigationBar
                    currentPage='ViewWorkout'
                    navigation={navigation}
                    deleteSavedWorkout={deleteWorkout}
                    workout={workout}
                    forwardButton={() => setCurrentIndex((currentIndex + 1) % newExercises.length)}
                    backButton={() => setCurrentIndex((currentIndex - 1 + newExercises.length) % exercises.length)}
                    viewWorkoutNumberOfExercises={newExercises.length}
                />

            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default ViewWorkout