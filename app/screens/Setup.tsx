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

                    <Text style={tw`text-2xl font-medium text-center my-2`}>Добре Дошъл!</Text>

                    <Text style={tw`text-xl font-medium text-center`}>Дневна цел:</Text>

                    <View style={tw`flex flex-row flex-wrap gap-y-3 mt-5 mx-2`}>
                    
                        <View style={tw`w-1/2 flex items-start justify-start mb-2`}>

                            <Text style={tw`text-xl font-medium mb-[-5px]`}>Калории</Text>
                            <TextInput
                                onChangeText={setCalories}
                                keyboardType='numeric' 
                                style={tw`bg-white shadow-lg border border-red-600 rounded-md w-[97%] h-12 p-1 mt-2`}
                            />

                        </View>

                        <View style={tw`w-1/2 flex items-start justify-start mb-2`}>

                            <Text style={tw`text-xl font-medium mb-[-5px]`}>Протеин</Text>
                            <TextInput
                                onChangeText={setProtein}
                                keyboardType='numeric' 
                                style={tw`bg-white shadow-lg border border-red-600 rounded-md w-[97%] h-12 p-1 mt-2`}
                            />

                        </View>

                        <View style={tw`w-1/2 flex items-start justify-start mb-2`}>

                            <Text style={tw`text-xl font-medium mb-[-5px]`}>Въглехидрати</Text>
                            <TextInput
                                onChangeText={setCarbs}
                                keyboardType='numeric' 
                                style={tw`bg-white shadow-lg border border-red-600 rounded-md w-[97%] h-12 p-1 mt-2`}
                            />

                        </View>

                        <View style={tw`w-1/2 flex items-start justify-start mb-2`}>

                            <Text style={tw`text-xl font-medium mb-[-5px]`}>Мазнини</Text>
                            <TextInput
                                onChangeText={setFat}
                                keyboardType='numeric' 
                                style={tw`bg-white shadow-lg border border-red-600 rounded-md w-[97%] h-12 p-1 mt-2`}
                            />

                        </View>

                    </View>

                    <View style={tw`flex-1 justify-end mb-8`}>
                        <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-2xl flex justify-center items-center shadow-md mt-1`}
                        onPress={() => setNutrients()}>

                            <Text style={tw`text-2xl text-white`}>Запази</Text>

                        </TouchableOpacity>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default Setup