import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button, Pressable, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import tw from "twrnc";
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useContext } from 'react';
import GlobalContext from '../../GlobalContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import SetupPageOne from '../setupComponents/SetupPageOne';
import SetupPageTwo from '../setupComponents/SetupPageTwo';
import SetupPageThree from '../setupComponents/SetupPageThree';
import SetupPageFour from '../setupComponents/SetupPageFour';
import SetupPageFive from '../setupComponents/SetupPageFive';
//import ScrollPicker from "react-native-wheel-scrollview-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '../use/useGetEmail';
import { getLanguageLocally } from '../use/useGetLanguageLocally';

const Setup = () => {

    const { setSetupRan, internetConnected } = useContext(GlobalContext);

    const { t } = useTranslation();

    useEffect(() => {
        getLanguageLocally();
    }, [])

    const [currentPage, setCurrentPage] = useState(1)

    const nextPage = () => {
        if (currentPage != 5) {

            if (currentPage == 1) {
                
                if (gender == '') {
                    return
                }

                setCurrentPage(currentPage + 1)

            }else if (currentPage == 2) {

                if (age == 1) {
                    return
                }

                setCurrentPage(currentPage + 1)

            }
            else if (currentPage == 3) {

                setCurrentPage(currentPage + 1)
            }
            else if (currentPage == 4) {
                setCurrentPage(currentPage + 1)
            }

            
        }else{
            finishSetup();
        }
    }

    const calculateCalories = (units: string) => {

        let w = weight;
        let h = height;
        let a = age;
        let g = gender

        if (units != "metric") {
            w = weight * 0.453592;
            h = height * 2.54;
            a = age;
            g = gender;
        }

        if (g == 'male') {

            let additionalCalories = 0;

            if (activityLevel == 1) {
                additionalCalories = 1.2;
            }
            else if (activityLevel == 2) {
                additionalCalories = 1.375;
            }
            else if (activityLevel == 3) {
                additionalCalories = 1.465;
            }
            else if (activityLevel == 4) {
                additionalCalories = 1.55;
            }
            else if (activityLevel == 5) {
                additionalCalories = 1.725;
            }
            else if (activityLevel == 6) {
                additionalCalories = 1.9;
            }

            const initBMR = (10 * w) + (6.25 * h) - (5 * a) + 5;
            const finalBMR = Math.round(initBMR * additionalCalories);

            return finalBMR
            
        }else{

            let additionalCalories = 0;

            if (activityLevel == 1) {
                additionalCalories = 1.2;
            }
            else if (activityLevel == 2) {
                additionalCalories = 1.375;
            }
            else if (activityLevel == 3) {
                additionalCalories = 1.465;
            }
            else if (activityLevel == 4) {
                additionalCalories = 1.55;
            }
            else if (activityLevel == 5) {
                additionalCalories = 1.725;
            }
            else if (activityLevel == 6) {
                additionalCalories = 1.9;
            }

            const initBMR = (10 * w) + (6.25 * h) - (5 * a) - 161;
            const finalBMR = Math.round(initBMR * additionalCalories);

            return finalBMR
        }

    }

    const finishSetup = async () => {

        if (activityLevel == 0) {
            return
        }

        console.log('finishing setup')

        const calories = calculateCalories("metric")

        const ratios = { protein: 0.2, carbs: 0.5, fats: 0.3 };
        const caloriesPerGram = { protein: 4, carbs: 4, fats: 9 };
    
        const proteinGrams = (calories * ratios.protein) / caloriesPerGram.protein;
        const carbsGrams = (calories * ratios.carbs) / caloriesPerGram.carbs;
        const fatsGrams = (calories * ratios.fats) / caloriesPerGram.fats;
    
        const nutrients = {
            calories: calories,
            protein: Math.round(proteinGrams),
            carbs: Math.round(carbsGrams),
            fat: Math.round(fatsGrams)
        }

        console.log('nutrients:', nutrients)

        const email = await getEmail();

        // nutrientite se dobavqt lokalno v telefona nezavisimo dali ima internet, ako ima internet se dobavqt i v bazata danni
        try {
            const jsonNutrients = JSON.stringify(nutrients);
            await AsyncStorage.setItem(`goal_nutrients_${email}`, jsonNutrients);
        } catch (error) {
            console.log('Error saving nutrients to AsyncStorage:', error);
        }

        console.log('setup ran')
        
        setSetupRan(true);

    }

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
            console.log('set current page to', currentPage)
        }else{
            console.log('limit exceeded')
        }
    }
    
    const [includeInBio, setIncludeInBio] = useState(false);
    const [gender, setGender] = useState('');

    const [age, setAge] = useState(1);

    const [weightType, setWeightType] = useState('KG');
    const [weight, setWeight] = useState(60);

    const [heightType, setHeightType] = useState('CM');
    const [height, setHeight] = useState(170);

    const [activityLevel, setActivityLevel] = useState(0)
    //const [additionalCalories, setAdditionalCalories] = useState(0);

    const setGenderButton = (input: string) => {

        setGender(input)

    }

    //weight, weightType, setWeight, setWeightType
         
    return (
        <>

            <SafeAreaView style={tw`flex-1 bg-white`}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={tw`flex-1`}>

                        <View style={tw`flex flex-row mx-3 gap-x-2`}>

                            <View style={tw`w-[23.5%] h-2 ${currentPage > 1 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>
                            <View style={tw`w-[23.5%] h-2 ${currentPage > 2 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>
                            <View style={tw`w-[23.5%] h-2 ${currentPage > 3 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>
                            <View style={tw`w-[23.5%] h-2 ${currentPage > 4 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>

                        </View>

                        <View style={tw``}>

                            {currentPage === 1 ? (
                                <SetupPageOne setGenderButton={setGenderButton} gender={gender} setIncludeInBio={setIncludeInBio} includeInBio={includeInBio}/>
                            ) : currentPage === 2 ? (
                                <SetupPageTwo age={age} setAge={setAge}/>
                            ) : currentPage === 3 ? (
                                <SetupPageThree weight={weight} weightType={weightType} setWeight={setWeight} setWeightType={setWeightType} setHeightType={setHeightType} setHeight={setHeight} height={height}/>
                            ) : currentPage === 4 ? (
                                <SetupPageFour height={height} setHeight={setHeight} heightType={heightType} setHeightType={setHeightType} setWeightType={setWeightType} setWeight={setWeight} weight={weight}/>
                            ) : currentPage === 5 ? (
                                <SetupPageFive activityLevel={activityLevel} setActivityLevel={setActivityLevel}/>
                            ) : null}

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

export default Setup