import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button, Pressable, TouchableOpacity } from 'react-native'
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

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw`flex-1 mx-3`}>

                    <Text style={tw`text-3xl font-medium text-center my-2 mt-5`}>Welcome to Lunge!</Text>

                    <Text style={tw`text-2xl font-medium text-center mt-[-4px]`}>Set your daily goals:</Text>

                    <View style={tw`flex flex-row flex-wrap w-full gap-x-3 gap-y-3 mt-6`}>
                    
                        <View style={tw`w-[48%]`}>
                            <Text style={tw`text-xl font-medium text-black ml-[6px] mb-1`}>{t('calories')}</Text>
                            <TextInput 
                                style={tw`w-full h-12 rounded-2xl bg-[#fd1c47] pb-[6px] pl-3 text-white font-medium text-xl`} 
                                keyboardType='number-pad' 
                                maxLength={4} 
                                onChangeText={setCalories} 
                                
                            />
                        </View>

                        <View style={tw`w-[48%]`}>
                            <Text style={tw`text-xl font-medium text-black ml-[6px] mb-1`}>{t('protein')}</Text>
                            <TextInput 
                                style={tw`w-full h-12 rounded-2xl bg-[#fd1c47] pb-[6px] pl-3 text-white font-medium text-xl`} 
                                keyboardType='number-pad' 
                                maxLength={4} 
                                onChangeText={setProtein} 
                            />
                        </View>

                        <View style={tw`w-[48%]`}>
                            <Text style={tw`text-xl font-medium text-black ml-[6px] mb-1`}>{t('carbs')}</Text>
                            <TextInput 
                                style={tw`w-full h-12 rounded-2xl bg-[#fd1c47] pb-[6px] pl-3 text-white font-medium text-xl`} 
                                keyboardType='number-pad' 
                                maxLength={4} 
                                onChangeText={setCarbs} 
                            />
                        </View>

                        <View style={tw`w-[48%]`}>
                            <Text style={tw`text-xl font-medium text-black ml-[6px] mb-1`}>{t('fat')}</Text>
                            <TextInput 
                                style={tw`w-full h-12 rounded-2xl bg-[#fd1c47] pb-[6px] pl-3 text-white font-medium text-xl`} 
                                keyboardType='number-pad' 
                                maxLength={4} 
                                onChangeText={setFat} 
                            />
                        </View>

                    </View>

                    <View style={tw`flex-1 justify-end mb-4`}>
                        <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-2xl flex justify-center items-center shadow-md mt-1`}
                        onPress={() => setNutrients()}>

                            <Text style={tw`text-2xl text-white`}>{t('save')}</Text>

                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default Setup