import { View, Text, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import BottomNavigationBar from '../components/BottomNavigationBar';

const ViewWorkout = ({route, navigation}: any) => {

    const { exercises, workout, workoutTitle } = route.params;

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
                id: generateID(), // Generates a random ID
                reps: "0",
                weight: "0"
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
            }

        }

        navigation.navigate('Тренировки');
        
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
                
                <Text style={tw`text-2xl font-bold ml-3 my-5`} ellipsizeMode='tail' numberOfLines={3}>{workoutTitle}</Text>

                <View style={tw`flex flex-col gap-y-1`}>
                    {newExercises.map((exercise: any, index: any) => {
                        if (exercise.exerciseIndex === currentIndex + 1) {
                            return (
                                <View key={exercise.id} style={tw`w-full`}>

                                    <Text style={tw`text-xl text-blue-400 font-medium max-w-[85%] ml-3 mb-3`} ellipsizeMode='tail' numberOfLines={3}>{exercise.title}</Text>
                                    
                                    <ScrollView style={tw``}>
                                        {exercise.sets.sort((a: any, b: any) => a.setIndex - b.setIndex).map((set: any, mapIndex: any) => (
                                            <View key={set.id} style={tw`ml-3`}>
                                                <View style={tw`flex flex-row gap-x-2`}>
                                                    <View style={tw`w-10 h-10 bg-neutral-100 rounded-xl flex items-center justify-center`}>
                                                        <Text style={tw`text-base ml-5 absolute font-medium`}>{mapIndex + 1}</Text>
                                                    </View>

                                                    <View style={tw`flex flex-row gap-x-2 mb-3`}>
                                                        <TextInput
                                                            style={tw`bg-neutral-100 rounded-2xl p-2 w-[34%] h-10`}
                                                            keyboardType='number-pad'
                                                            maxLength={4}
                                                            
                                                            value={userInputs[index].sets[mapIndex].reps}
                                                            onChangeText={(text) => {
                                                                let updatedInputs = [...userInputs];
                                                                updatedInputs[index].sets[mapIndex].reps = text;
                                                                setUserInputs(updatedInputs);
                                                            }}
                                                           
                                                        />

                                                        <TextInput
                                                            style={tw`bg-neutral-100 rounded-2xl p-2 w-[34%] h-10`}
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

                                                        <TouchableOpacity style={tw`bg-red-500 rounded-2xl w-[21%] h-10 flex items-center justify-center`} onPress={() => removeSet(exercise.exerciseIndex, set.id)}>
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

                <BottomNavigationBar
                    currentPage='SavedWorkout'
                    navigation={navigation}
                    deleteSavedWorkout={deleteWorkout}
                    forwardButton={() => setCurrentIndex((currentIndex + 1) % newExercises.length)}
                    backButton={() => setCurrentIndex((currentIndex - 1 + newExercises.length) % exercises.length)}
                />

            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default ViewWorkout