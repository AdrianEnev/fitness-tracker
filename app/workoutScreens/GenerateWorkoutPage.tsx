import { View, Text, Pressable, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, Alert, Vibration } from 'react-native'
import React, { useState, useRef, useContext, useEffect } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'

import PageOne from '../generateWorkoutComponents/PageOne'
import PageTwo from '../generateWorkoutComponents/PageTwo'
import PageThree from '../generateWorkoutComponents/PageThree'
import PageFour from '../generateWorkoutComponents/PageFour'
import PageFive from '../generateWorkoutComponents/PageFive'
import PageSix from '../generateWorkoutComponents/PageSix'
import generateWorkout from '../useWorkout/useGenerateWorkout'
import GenerateWorkoutModal from '../modals/GeneratingWorkoutModal'
import { BlurView } from 'expo-blur'
import addGeneratedWorkoutLocally from '../useWorkout/useAddGeneratedWorkoutLocally'
import GlobalContext from '../../GlobalContext'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig'
import { usePaymentSheet, useStripe } from '@stripe/stripe-react-native'
import { buy, initializePaymentSheet } from '../handleStripe/handlePayment'
import StripeModal from '../handleStripe/StripeModal'

const GenerateWorkoutPage = ({navigation, route}: any) => {

    const {initPaymentSheet} = usePaymentSheet();
    const [ready, setReady] = useState(false);
    const [isPaymentSheetShown, setIsPaymentSheetShown] = useState(false);
    const [isPaymentSheetLoading, setPaymentSheetLoading] = useState(false);

    const {t} = useTranslation();

    const {folder = null} = route.params || {};

    const {internetConnected, internetSpeed, setGeneratingWorkout, setGeneratingWorkoutInFolder} = useContext(GlobalContext)

    const [lungeCoins, setlungeCoins] = useState<number>(0);

    const getLungeCoins = async () => {

        console.log('getLungeCoins ran...');
    
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    
        const userInfo = await getDoc(userDocRef).then((doc) => {
            if (doc.exists()) {
                const data = doc.data();
                console.log('Free trials fetched:', data.lungeCoins);
                return data.lungeCoins; // Return the fetched free trials value
            } else {
                console.log('No user document found.');
                return 0; // Return 0 if no document is found
            }
        });
    
        return userInfo;
    }

    const decrementLungeCoins = async () => {

        console.log('decrementLungeCoins function ran...');
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        
        await getDoc(userDocRef).then(async (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                
                if (data.lungeCoins > 0) {

                    data.lungeCoins -= 1;
                    data.lastGeneratedWorkout = new Date().toISOString();
                    await updateDoc(userDocRef, { lungeCoins: data.lungeCoins, lastGeneratedWorkout: data.lastGeneratedWorkout });
                    console.log('Free trials decremented:', data.lungeCoins);

                } else {
                    console.log('No free trials left to decrement.');
                }
                
            } else {
                console.log('No user document found.');
                return false;
            }
        })
    }

    useEffect(() => {
        const query = async () => {
            const lungeCoins = await getLungeCoins();
            
            if (lungeCoins){
                setlungeCoins(lungeCoins);
            }
        }

        query();

    }, [])

    const setupFinished = async () => {

        const levels = ['Beginner', 'Intermediate', 'Advanced', 'Elite'];
        const goals = ['muscle gain', 'fat loss', 'endurance', 'flexibility'];
        const locations = ['gym', 'home', 'outdoors', 'calisthenics park'];
        const groups = ['no equipment', 'full gym', 'calisthenics park', 'home equipment'];
        const languages: { [key: string]: string } = {
            en: 'english',
            bg: 'bulgarian',
            de: 'german',
            rs: 'russian',
            fr: 'french'
        };

        const level = levels[experienceLevel - 1] || 'unspecified';
        const goal = goals[primaryGoal - 1] || 'unspecified';
        const location = locations[workoutLocation - 1] || 'unspecified';
        const group = groups[equipmentGroup - 1] || 'unspecified';
        const language = languages[i18next.language as keyof typeof languages] || 'english';

        //setIsGenerateWorkoutModalVisible(true);
        setGeneratingWorkout(true)

        if (folder) {
            setGeneratingWorkoutInFolder(folder)
        }
        
        if (folder) {
            navigation.navigate('Тренировки');
        }else{
            navigation.goBack();
        }

        //const generatedWorkout = await generateWorkout(level, goal, numberOfDays, location, specificBodyparts, group, equipment, language);
        //await addGeneratedWorkoutLocally(generatedWorkout, setGeneratingWorkout, folder)

        console.log('generated workout')
        await decrementLungeCoins();

    }

    const purchaseFirstTier = async () => {
        if (isPaymentSheetLoading) return;
        setPaymentSheetLoading(true);

        await initializePaymentSheet(initPaymentSheet, setReady, 199);
        buy(setIsPaymentSheetShown, setPaymentSheetLoading);
        setIsPaymentSheetShown(true);
        setPaymentSheetLoading(false);

    }

    const purchaseSecondTier = async () => {
        if (isPaymentSheetLoading) return;
        setPaymentSheetLoading(true);

        await initializePaymentSheet(initPaymentSheet, setReady, 699);
        buy(setIsPaymentSheetShown, setPaymentSheetLoading);
        setIsPaymentSheetShown(true);
        setPaymentSheetLoading(false);

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
            }

            if (equipment.length === 0) return;
            
            if (lungeCoins === 0) {

                Vibration.vibrate();
                setIsStripeModalVisible(true);

                return;

            }else{
                Alert.alert(
                    'Generate Workout',
                    'Would you like to use 1 Lunge Coin to generate a workout?',
                    [
                        {
                            text: 'Cancel',
                            style: 'destructive',
                        },
                        {
                            text: 'Proceed',
                            style: 'default',
                            onPress: () => {
                                setupFinished();
                            },
                        },
                    ],
                    
                );
            }
            
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
    const [isStripeModalVisible, setIsStripeModalVisible] = useState(false);

    return (
        <>
            { (isGenerateWorkoutModalVisible || isPaymentSheetShown || isStripeModalVisible) && (
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

            <StripeModal 
                isStripeModalVisible={isStripeModalVisible}
                setIsStripeModalVisible={setIsStripeModalVisible}
                purchaseFirstTier={purchaseFirstTier}
                purchaseSecondTier={purchaseSecondTier}
                isPaymentSheetLoading={isPaymentSheetLoading}
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