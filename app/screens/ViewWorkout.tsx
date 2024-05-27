import { View, Text, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';

const ViewWorkout = ({route, navigation}: any) => {

    const { exercises, workout, workoutTitle } = route.params;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [newExercises, setNewExercises] = useState<any>([...exercises]); // newExercises = copy of exercises
    const [userInputs, setUserInputs] = useState<any>(newExercises.map((exercise: any) => ({
        ...exercise,
        sets: exercise.sets.map((set: any) => ({...set, reps: set.reps, weight: set.weight}))
    })));

    const addSet = () => {
        const updatedExercises = [...exercises];
        const currentExercise = updatedExercises.find((exercise: any) => exercise.exerciseIndex === currentIndex + 1);
        if (currentExercise) {
            const newSet = {
                id: Math.random().toString(),
                reps: "",
                weight: ""
            };
            currentExercise.sets.push(newSet);
        }
        setNewExercises(updatedExercises);
    }

    const removeSet = (exerciseIndex: number, setId: string) => {
        const updatedExercises = [...newExercises];
        const currentExercise = updatedExercises.find((exercise: any) => exercise.exerciseIndex === exerciseIndex);
        if (currentExercise) {
            currentExercise.sets = currentExercise.sets.filter((set: any) => set.id !== setId);
        }
        setNewExercises(updatedExercises);
    }

    const saveWorkout = async () => {
        
        // update the exercises in the database to match userInputs
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
                            weight: currentSet.weight
                        });
                    }
                }
            }

        }

        navigation.navigate('Тренировки');
        
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`w-full h-full`}>
                
                <Text>{workoutTitle}</Text>

                <View style={tw`flex flex-col gap-y-1`}>
                    {newExercises.map((exercise: any, index: any) => {
                        if (exercise.exerciseIndex === currentIndex + 1) {
                            return (
                                <View key={exercise.id} style={tw`w-full`}>

                                    <Text style={tw`text-2xl font-medium text-center mb-4`} numberOfLines={1}>{exercise.title}</Text>
                                    
                                    <ScrollView style={tw``}>
                                        {exercise.sets.sort((a: any, b: any) => a.setIndex - b.setIndex).map((set: any, mapIndex: any) => (
                                            <View key={set.id} style={tw`ml-3`}>
                                                <View style={tw`flex flex-row gap-x-2`}>
                                                    <View style={tw`w-10 h-10 bg-white rounded-xl flex items-center justify-center`}>
                                                        <Text style={tw`text-base ml-5 absolute font-medium`}>{mapIndex + 1}</Text>
                                                    </View>

                                                    <View style={tw`flex flex-row gap-x-2 mb-3`}>
                                                        <TextInput
                                                            style={tw`bg-white rounded-2xl p-2 w-32 h-10`}
                                                            keyboardType='number-pad'
                                                            maxLength={4}
                                                            placeholder={set.reps === "" ? 'Повторения' : set.reps.toString() + ' Повт.'}
                                                            value={userInputs[index].sets[mapIndex].reps}
                                                            onChangeText={(text) => {
                                                                let updatedInputs = [...userInputs];
                                                                updatedInputs[index].sets[mapIndex].reps = text;
                                                                setUserInputs(updatedInputs);
                                                            }}
                                                           
                                                        />

                                                        <TextInput
                                                            style={tw`bg-white rounded-2xl p-2 w-32 h-10`}
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

                                                        <TouchableOpacity style={tw`bg-red-500 rounded-2xl w-21 h-10 flex items-center justify-center`} onPress={() => removeSet(exercise.exerciseIndex, set.id)}>
                                                            <Text style={tw`text-white`}>Изтрий</Text>
                                                        </TouchableOpacity>

                                                    </View>
                                                </View>
                                            </View>
                                        ))}

                                        <View style={tw`mx-3`}>
                                            <TouchableOpacity style={tw`w-full h-12 bg-green-500 rounded-xl flex justify-center items-center`} onPress={addSet}>
                                                <Text style={tw`text-lg text-white`}>+ Добави Серия</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </ScrollView>
                                </View>
                            );
                        }
                    })}
                </View>

                <View style={tw`flex flex-row justify-between p-4`}>
                    <TouchableOpacity 
                        style={tw`w-24 h-12 bg-green-500 rounded-full flex justify-center items-center`}
                        onPress={() => setCurrentIndex((currentIndex - 1 + newExercises.length) % exercises.length)} // Switch to previous exercise
                    >
                        <Text style={tw`text-lg text-white`}>-</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={tw`w-24 h-12 bg-green-500 rounded-full flex justify-center items-center`}
                        onPress={() => setCurrentIndex((currentIndex + 1) % newExercises.length)} // Switch to next exercise
                    >
                        <Text style={tw`text-lg text-white`}>+</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={tw`w-24 h-12 bg-green-500 rounded-full flex justify-center items-center`}
                        onPress={saveWorkout} // Save the workout
                    >
                        <Text style={tw`text-lg text-white`}>Save</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default ViewWorkout