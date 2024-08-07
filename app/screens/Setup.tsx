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
        if (currentPage <= 4) {
            setCurrentPage(currentPage + 1)
            console.log('set current page to', currentPage)
        }else{
            console.log('limit exceeded')
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

    const setGenderButton = (input: string) => {

        setGender(input)

    }

    const ages = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
        61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
        71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        91, 92, 93, 94, 95, 96, 97, 98, 99, 100
      ];
      
    const AgesComponent = ({item}: any) => {
        return (
            <View style={tw`w-full`}>

                
                <Text style={tw`font-medium text-3xl my-2 ${item < 10 ? 'ml-[23px]' : 'ml-5'}`}>{item}</Text>
                

            </View>
        )
    }

    return (
        <>

            <SafeAreaView style={tw`flex-1 bg-white`}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={tw`flex-1`}>

                        <View style={tw`flex flex-row mx-3 gap-x-2`}>

                            <View style={tw`w-[23.5%] h-2 ${currentPage > 0 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>
                            <View style={tw`w-[23.5%] h-2 ${currentPage > 1 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>
                            <View style={tw`w-[23.5%] h-2 ${currentPage > 2 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>
                            <View style={tw`w-[23.5%] h-2 ${currentPage > 3 ? 'bg-[#fd3e4b]' : 'bg-gray-300'} rounded-lg`}></View>

                        </View>

                        <View style={tw``}>

                            {currentPage === 1 ? (
                                <SetupPageOne setGenderButton={setGenderButton} gender={gender} setIncludeInBio={setIncludeInBio} includeInBio={includeInBio}/>
                            ) : currentPage === 2 ? (
                                <View style={tw`flex flex-col mt-[15%] h-full`}>
                                    <View style={tw`mx-5`}>
                                        <Text style={tw`font-medium text-2xl text-center`}>Please enter your age.</Text>
                                        <Text style={tw`font-medium text-lg text-gray-500 mt-1 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to calculate your daily BMR!</Text>
                                    </View>
                                    
                                    <View style={tw`flex-1 items-center mt-[5%]`}>
                                        <View style={tw`w-[37%] h-[60%] bg-gray-200 rounded-[47px] flex items-center pt-3`}>

                                            <FlatList 
                                                data={ages}
                                                renderItem={({ item }) => <AgesComponent item={item}/>} 
                                                scrollEnabled={true}
                                            />

                                        </View>
                                    </View>
                                    

                                </View>
                            ) : null}

                        </View>

                        

                    </View>
                    
                </TouchableWithoutFeedback>
            </SafeAreaView>

            <View style={tw`w-full h-28 bg-[#fd3e4b] absolute bottom-0 flex flex-row justify-between items-center pr-5 pl-2`}>

                <Pressable style={tw`w-[30%] h-[60%] flex flex-row items-center gap-x-1 mb-2`} onPress={previousPage}>
                    <Ionicons name='arrow-back-outline' size={32} color='white'/>
                    <Text style={tw`text-white font-medium text-2xl`}>Назад</Text>
                </Pressable>

                <Pressable style={tw`bg-white rounded-2xl w-[50%] h-[55%] flex flex-row pl-4 pr-2 items-center justify-between mb-2`} onPress={nextPage}>
                    <Text style={tw`font-medium text-xl`}>Напред</Text>
                    <Ionicons name='arrow-forward-outline' size={32}/>
                </Pressable>

            </View>
        </>
        
    )
}

export default Setup