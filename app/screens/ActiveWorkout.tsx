import { View, Text, SafeAreaView, TextInput, TouchableWithoutFeedback, Pressable, TouchableOpacity, ScrollView, Keyboard } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'

const ActiveWorkout = ({route}: any) => {

    const { exercises } = route.params;

    const [currentIndex, setCurrentIndex] = useState(0);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`w-full h-full`}>

                <View style={tw`flex flex-col gap-y-1 mb-15`}>
                    {exercises.map((exercise: any, index: any) => {
                        if (exercise.exerciseIndex === currentIndex + 1) {
                            return (
                                <View key={exercise.id} style={tw`w-full`}>

                                    <View style={tw`flex flex-row justify-between mb-6 mx-3`}>
                                        <Text style={tw`text-2xl font-medium text-center`} numberOfLines={1}>{exercise.title}</Text>
                                        
                                               
                                        <View style={tw`flex flex-col h-full gap-y-2`}>
                                            <TouchableOpacity style={tw`w-12 h-12 bg-green-500 rounded-full flex justify-center items-center`}>
                                               <Ionicons name='save' size={24} color='#fff'/>
                                            </TouchableOpacity>
                                        </View>
                                        
                                    </View>
                                   
                                    <ScrollView style={tw`mb-10`}>
                                        {exercise.sets.map((set: any, setIndex: any) => (
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
                                                           
                                                        />

                                                        <TextInput
                                                            style={tw`bg-white rounded-2xl p-2 w-32 h-10`}
                                                            keyboardType='number-pad'
                                                            maxLength={4}
                                                            placeholder='KG'
                                                            value={set.weight.toString()}
                                                            
                                                        />


                                                        <TouchableOpacity style={tw`bg-red-500 rounded-2xl w-20 h-10 flex items-center justify-center`}>
                                                            <Text style={tw`text-white`}>Изтрий</Text>
                                                        </TouchableOpacity>

                                                    </View>
                                                </View>
                                            </View>
                                        ))}

                                        <View style={tw`mx-3`}>
                                            <TouchableOpacity style={tw`w-full h-12 bg-green-500 rounded-xl flex justify-center items-center`}>
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
                        onPress={() => setCurrentIndex((currentIndex - 1 + exercises.length) % exercises.length)} // Switch to previous exercise
                    >
                        <Text style={tw`text-lg text-white`}>Previous</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={tw`w-24 h-12 bg-green-500 rounded-full flex justify-center items-center`}
                        onPress={() => setCurrentIndex((currentIndex + 1) % exercises.length)} // Switch to next exercise
                    >
                        <Text style={tw`text-lg text-white`}>Next</Text>
                    </TouchableOpacity>
                </View>

                
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

export default ActiveWorkout