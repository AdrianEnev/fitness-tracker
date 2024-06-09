import { View, Text, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'

const ViewSavedWorkout = ({route}: any) => {

    const { exercises, workout, workoutTitle } = route.params;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [newExercises, setNewExercises] = useState<any>([...exercises]); // newExercises = copy of exercises

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`w-full h-full`}>
                
                <Text style={tw`text-2xl font-medium m-2`}>{workoutTitle}</Text>

                <View style={tw`flex flex-col gap-y-1`}>
                    {newExercises.map((exercise: any, index: any) => {
                        if (exercise.exerciseIndex === currentIndex + 1) {
                            return (
                                <View key={exercise.id} style={tw`w-full`}>

                                    <Text style={tw`text-xl ml-3 mb-4`} numberOfLines={1}>{exercise.title}</Text>
                                    
                                    <ScrollView style={tw``}>
                                        {exercise.sets.sort((a: any, b: any) => a.setIndex - b.setIndex).map((set: any, mapIndex: any) => (
                                            <View key={set.id} style={tw`ml-3`}>
                                                <View style={tw`flex flex-row gap-x-2`}>
                                                    <View style={tw`w-10 h-10 bg-white rounded-xl flex items-center justify-center`}>
                                                        <Text style={tw`text-base ml-5 absolute font-medium`}>{mapIndex + 1}</Text>
                                                    </View>

                                                    <View style={tw`flex flex-row gap-x-2 mb-3 w-full`}>

                                                        <View style={tw`w-[42%] h-10 bg-white rounded-2xl flex items-start justify-center`}>
                                                            <Text style={tw`ml-3`}>{set.reps === "" ? '0 Повторения' : set.reps.toString() + ' Повт.'}</Text>
                                                        </View>

                                                        <View style={tw`w-[42%] h-10 bg-white rounded-2xl flex items-start justify-center`}>
                                                            <Text style={tw`ml-3`}>{set.weight === "" ? '0 KG' : set.weight.toString() + ' KG'}</Text>
                                                        </View>

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
                </View>

            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default ViewSavedWorkout;