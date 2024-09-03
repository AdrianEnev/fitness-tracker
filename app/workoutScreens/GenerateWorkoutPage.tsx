import { View, Text, Pressable, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native'
import React, { useState, useRef } from 'react'
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

    const nextPage = () => {
        
        if (currentPage === 1 && experienceLevel !== 0) {
            setCurrentPage(currentPage + 1);
        }else if (currentPage === 2 && primaryGoal !== 0) {
            setCurrentPage(currentPage + 1);
        }else if (currentPage === 3 && numberOfDays !== 0) {
            setCurrentPage(currentPage + 1);
        }else if (currentPage === 4 && workoutLocation !== 0) {
            setCurrentPage(currentPage + 1);
        }else if (currentPage === 5) {
            setCurrentPage(currentPage + 1);
        }else if (currentPage === 6 && equipment.length > 0) {
            setCurrentPage(currentPage + 1);
        }else if (currentPage === 7) {

            let level = '';
            switch (experienceLevel) {
                case 1:
                    level = 'Beginner';
                    break;
                case 2:
                    level = 'Intermediate';
                    break;
                case 3:
                    level = 'Advanced';
                    break;
                case 4:
                    level = 'Elite';
                    break;
                default:
                    level = 'Beginner';
                    break;
            }

            let goal = '';
            switch (primaryGoal) {
                case 1:
                    goal = 'muscle gain';
                    break;
                case 2:
                    goal = 'fat loss';
                    break;
                case 3:
                    goal = 'endurance';
                    break;
                case 4:
                    goal = 'flexibility';
                    break;
                default:
                    goal = 'muscle gain';
                    break;
            }

            let location = '';
            switch (workoutLocation) {
                case 1:
                    location = 'gym';
                    break;
                case 2:
                    location = 'home';
                    break;
                case 3:
                    location = 'outdoors';
                    break;
                case 4:
                    location = 'calisthenics park';
                    break;
                default:
                    location = 'gym';
                    break;
            }

            let group = '';
            switch (equipmentGroup) {
                case 1:
                    group = 'no equipment';
                    break;
                case 2:
                    group = 'full gym';
                    break;
                case 3:
                    group = 'calisthenics park';
                    break;
                case 4:
                    group = 'home equipment';
                    break;
                default:
                    group = 'full gym';
                    break;
            }

            generateWorkout(level, goal, numberOfDays, location, specificBodyparts, group, equipment);
        }

    }
    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const scrollToEquipment = () => {
        if (scrollViewRef.current && equipmentRef.current) {
            equipmentRef.current.measure((x, y, width, height, pageX, pageY) => {
                const offset = -450; // Adjust this value as needed
                scrollViewRef.current?.scrollTo({ y: pageY - offset, animated: true });
            });
        }
    };

    const [currentPage, setCurrentPage] = useState(1);
    const scrollViewRef = useRef<ScrollView>(null);
    const equipmentRef = useRef<View>(null);

    const [experienceLevel, setExperienceLevel] = useState(0);
    const [primaryGoal, setPrimaryGoal] = useState(0);
    const [numberOfDays, setNumberOfDays] = useState(0);
    const [workoutLocation, setWorkoutLocation] = useState(0);
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

                        <View style={tw`h-full`}>

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
                                <ScrollView ref={scrollViewRef} style={tw`h-full`} contentContainerStyle={tw``}>
                                    <PageSix 
                                        equipment={equipment} 
                                        setEquipment={setEquipment} 
                                        equipmentGroup={equipmentGroup} 
                                        setEquipmentGroup={setEquipmentGroup}
                                        scrollToEquipment={scrollToEquipment}
                                        equipmentRef={equipmentRef}
                                    />
                                </ScrollView>
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