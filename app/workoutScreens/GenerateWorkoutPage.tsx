import { View, Text, Pressable, SafeAreaView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'

import PageOne from '../generateWorkoutComponents/PageOne'
import PageTwo from '../generateWorkoutComponents/PageTwo'
import PageThree from '../generateWorkoutComponents/PageThree'
import PageFour from '../generateWorkoutComponents/PageFour'
import PageFive from '../generateWorkoutComponents/PageFive'
import PageSix from '../generateWorkoutComponents/PageSix'
import generateWorkout from '../useWorkout/useGenerateWorkout'

const GenerateWorkoutPage = () => {

    const [currentPage, setCurrentPage] = useState(1);

    const nextPage = () => {
        if (currentPage != 6) {
            setCurrentPage(currentPage + 1);
        }else{
            generateWorkout();
        }
        
    }
    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            console.log('set current page to', currentPage)
        }else{
            console.log('limit exceeded')
        }
    }

    const [experienceLevel, setExperienceLevel] = useState(1);
    const [primaryGoal, setPrimaryGoal] = useState('');
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [workoutLocation, setWorkoutLocation] = useState('');
    const [specificBodyparts, setSpecificBodyparts] = useState([]);
    const [equipmentGroup, setEquipmentGroup] = useState(0);
    const [equipment, setEquipment] = useState([]);

    return (
        <>

            <SafeAreaView style={tw`flex-1 bg-white`}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={tw`flex-1`}>

                        <View style={tw`flex flex-row mx-3 gap-x-2`}>

                            <View style={tw`w-[18.5%] h-2 ${currentPage > 1 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>
                            <View style={tw`w-[18.5%] h-2 ${currentPage > 2 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>
                            <View style={tw`w-[18.5%] h-2 ${currentPage > 3 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>
                            <View style={tw`w-[18.5%] h-2 ${currentPage > 4 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>
                            <View style={tw`w-[18.5%] h-2 ${currentPage > 5 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>

                        </View>

                        <View style={tw``}>

                            {currentPage === 1 ? (
                                <PageOne experienceLevel={experienceLevel} setExperienceLevel={setExperienceLevel}/>
                            ) : currentPage === 2 ? (
                                <PageTwo primaryGoal={primaryGoal} setPrimaryGoal={setPrimaryGoal}/>      
                            ) : currentPage === 3 ? (
                                <PageThree numberOfDays={numberOfDays} setNumberOfDays={setNumberOfDays}/>
                            ) : currentPage === 4 ? (
                                <PageFour workoutLocation={workoutLocation} setWorkoutLocation={setWorkoutLocation}/>
                            ) : currentPage === 5 ? (
                                <PageFive specificBodyparts={specificBodyparts} setSpecificBodyparts={setSpecificBodyparts}/>
                            ) : (
                                <PageSix equipment={equipment} setEquipment={setEquipment} equipmentGroup={equipmentGroup} setEquipmentGroup={setEquipmentGroup}/>
                            )}

                        </View>

                    </View>
                    
                </TouchableWithoutFeedback>
            </SafeAreaView>

            <View style={tw`w-full h-28 bg-[#fd3e4b] absolute bottom-0 flex flex-row justify-between items-center pr-5 pl-2`}>

                <Pressable style={tw`w-[30%] h-[60%] flex flex-row items-center gap-x-1 mb-2`} onPress={previousPage}>
                    <Ionicons name='arrow-back-outline' size={32} color='white'/>
                    <Text style={tw`text-white font-medium text-2xl`}>Back</Text>
                </Pressable>

                <Pressable style={tw`bg-white rounded-2xl w-[50%] h-[55%] flex flex-row pl-4 pr-2 items-center justify-between mb-2`} onPress={() => {
                    nextPage();
                }}>
                    <Text style={tw`font-medium text-xl`}>{currentPage === 5 ? 'Finish' : 'Next'}</Text>
                    <Ionicons name='arrow-forward-outline' size={32}/>
                </Pressable>

            </View>
        </>
    )
}

export default GenerateWorkoutPage