import { View, Text, Pressable, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, Alert, Vibration } from 'react-native'
import React, { useState, useRef, useContext } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'

import PageOne from '@components/generate_workout/PageOne'
import PageTwo from '@components/generate_workout/PageTwo'
import PageThree from '@components/generate_workout/PageThree'
import PageFour from '@components/generate_workout/PageFour'
import PageFive from '@components/generate_workout/PageFive'
import PageSix from '@components/generate_workout/PageSix'
import generateWorkout from '@use/workouts/add/useGenerateWorkout'
import GenerateWorkoutModal from '@modals/workouts/GeneratingWorkoutModal'
import { BlurView } from 'expo-blur'
import addGeneratedWorkoutLocally from '@use/workouts/add/useAddGeneratedWorkoutLocally'
import GlobalContext from '@config/GlobalContext'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { decrementLungeCoins } from '@app/use/settings/useHandleLungeCoins'

const GenerateWorkoutPage = ({navigation, route}: any) => {

    const {t} = useTranslation();

    const {folder = null} = route.params || {};

    const {internetConnected, internetSpeed, setGeneratingWorkout, setGeneratingWorkoutInFolder, lungeCoinsAmount} = useContext(GlobalContext)

    const setupFinished = async () => {
        
        console.log('setupFinished function ran...');

        if (!internetConnected || internetSpeed < 64) {
            alert(t('unstable-connection'));
            return;
        }

        const levels = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
        const goals = ['muscle gain', 'fat loss', 'endurance', 'flexibility'];
        const locations = ['gym', 'home', 'outdoors', 'calisthenics park'];
        //const groups = ['no equipment', 'full gym', 'calisthenics park', 'home equipment'];
        const languages: { [key: string]: string } = {
            en: 'english',
            bg: 'bulgarian',
            de: 'german',
            ru: 'russian',
            fr: 'french',
            sp: 'spanish',
            it: 'italian',
        };

        const level = levels[experienceLevel - 1] || 'unspecified';
        const goal = goals[primaryGoal - 1] || 'unspecified';
        const location = locations[workoutLocation - 1] || 'unspecified';
        //const group = groups[equipmentGroup - 1] || 'unspecified';
        const language = languages[i18next.language as keyof typeof languages] || 'english';

        //setIsGenerateWorkoutModalVisible(true);
        setGeneratingWorkout(true)

        if (folder) {
            setGeneratingWorkoutInFolder(folder)
        }
        
        if (folder) {
            navigation.navigate('Workouts');
        }else{
            navigation.goBack();
        }

        decrementLungeCoins(1);
        const generatedWorkout = await generateWorkout(level, goal, numberOfDays, location, specificBodyparts, equipment, language);
        await addGeneratedWorkoutLocally(generatedWorkout, setGeneratingWorkout, folder)
        console.log('Finished adding generated workout');
    }

    const nextPage = async () => {
        
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
        }else if (currentPage === 6) {
            
            if (!internetConnected || internetSpeed < 64) {
                alert(t('unstable-connection'));
                return;
            }

            if (equipment.length === 0) return;
            setupFinished();
            
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
                const offset = -450; 
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

    const [isGenerateWorkoutModalVisible, setIsGenerateWorkoutModalVisible] = useState(false);

    return (
        <>
            {(
                isGenerateWorkoutModalVisible
            ) && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <GenerateWorkoutModal
                isGenerateWorkoutModalVisible={isGenerateWorkoutModalVisible}
                setIsGenerateWorkoutModalVisible={setIsGenerateWorkoutModalVisible}
            />

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
                    <Text style={tw`text-white font-medium text-2xl`}>{t(`back`)}</Text>
                </Pressable>

                <Pressable style={tw`bg-white rounded-2xl w-[50%] h-[55%] flex flex-row pl-4 pr-2 items-center justify-between mb-2`} onPress={() => {
                    nextPage();
                }}>
                    <Text style={tw`font-medium text-xl`}>{currentPage === 6 ? t(`done`) : t(`next`)}</Text>
                    <Ionicons name='arrow-forward-outline' size={32}/>
                </Pressable>

            </View>
        </>
    )
}

export default GenerateWorkoutPage