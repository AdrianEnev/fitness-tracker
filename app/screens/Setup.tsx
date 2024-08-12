import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button, Pressable, TouchableOpacity, FlatList, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from "twrnc";
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useContext } from 'react';
import GlobalContext from '../../GlobalContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import getLanguage from '../use/useGetLanguage';
import Ionicons from '@expo/vector-icons/Ionicons';
import SetupPageOne from '../components/SetupPageOne';
import SetupPageTwo from '../components/SetupPageTwo';
import SetupPageThree from '../components/SetupPageThree';
import SetupPageFour from '../components/SetupPageFour';
import SetupPageFive from '../components/SetupPageFive';
//import ScrollPicker from "react-native-wheel-scrollview-picker";

const Setup = ({route}: any) => {

    const { setSetupRan } = useContext(GlobalContext);

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const nutrientsDocRef = doc(userInfoCollectionRef, 'nutrients')

    const { t } = useTranslation();

    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");

    useEffect(() => {
        getLanguage(userInfoCollectionRef);
    }, [])

    const setNutrients = async () => {
        try {

            if (calories !== "" && protein !== "" && carbs !== "" && fat !== "") {
                    if (calories !== "0" && protein !== "0" && carbs !== "0" && fat !== "0") {

                    const nutrients = {
                        calories: calories,
                        protein: protein,
                        carbs: carbs,
                        fat: fat
                    }

                    await setDoc(nutrientsDocRef, nutrients, { merge: true });
                    setSetupRan(true);
                }else{
                    console.log('Please fill all fields');
                }
            }else{
                console.log('Please fill all fields');
            }
            
        } catch (err) {
            console.error(err);
        }
    }

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
    
    const [includeInBio, setIncludeInBio] = useState(false);
    const [gender, setGender] = useState('');

    const [age, setAge] = useState(1);

    const [weightType, setWeightType] = useState('KG');
    const [weight, setWeight] = useState(60);

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
                                <SetupPageThree weight={weight} weightType={weightType} setWeight={setWeight} setWeightType={setWeightType} />
                            ) : currentPage === 4 ? (
                                <SetupPageFour />
                            ) : currentPage === 5 ? (
                                <SetupPageFive />
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
                    if (currentPage != 5) {
                        nextPage()
                    }else {
                        console.log('finished setup')
                    }
                }}>
                    <Text style={tw`font-medium text-xl`}>{currentPage === 5 ? 'Finish' : 'Next'}</Text>
                    <Ionicons name='arrow-forward-outline' size={32}/>
                </Pressable>

            </View>
        </>
        
    )
}

export default Setup