import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from "twrnc";
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { useRoute } from '@react-navigation/native';
import { useContext } from 'react';
import GlobalContext from '../../GlobalContext';

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
        <View style={tw`mx-3 h-full flex-1 mt-10`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw`flex-1`}>

                    <View>
                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                keyboardType='number-pad' 
                                maxLength={4} 
                                onChangeText={(text) => setCalories(text)} 
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>{t('calories')}</Text>

                        </View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                keyboardType='number-pad' 
                                maxLength={3} 
                                onChangeText={(text) => setProtein(text)}
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>{t('protein')}</Text>

                        </View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                keyboardType='number-pad' 
                                maxLength={3} 
                                onChangeText={(text) => setCarbs(text)}
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>{t('carbs')}</Text>

                        </View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                keyboardType='number-pad' 
                                maxLength={3} 
                                onChangeText={(text) => setFat(text)}
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>{t('fat')}</Text>

                        </View>
                    
                    </View>

                    <View style={tw`flex-1 justify-end mb-3`}>
                        <Button onPress={() => setNutrients()} title='Запази'/> 
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default Setup