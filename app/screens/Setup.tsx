import { View, Text, TextInput, TouchableWithoutFeedback, Keyboard, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from "twrnc";

const Setup = ({navigation}: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const nutrientsDocRef = doc(userInfoCollectionRef, 'nutrients')

    const [calories, setCalories] = useState("");
    const [protein, setProtein] = useState("");
    const [carbs, setCarbs] = useState("");
    const [fat, setFat] = useState("");

    useEffect(() => {
        checkUserInfoCollection();
    }, [])
        
    const checkUserInfoCollection = async () => {
        try {
            const snapshot = await getDocs(userInfoCollectionRef);
            if (snapshot.empty) {
                
                console.log("userInfoCollectionRef e prazno. Suzdava se dokument...");

            } 
        } catch (err) {
            console.error(err);
        }
    }

    const setNutrients = async () => {
        try {
            const nutrients = {
                calories: calories,
                protein: protein,
                carbs: carbs,
                fat: fat
            }
            await setDoc(nutrientsDocRef, nutrients, { merge: true });

            navigation.navigate('Главна-Страница');
            
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
                                placeholder='Калории' 
                                keyboardType='number-pad' 
                                maxLength={4} 
                                onChangeText={(text) => setCalories(text)} 
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>Калории</Text>

                        </View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                placeholder='Протеин' 
                                keyboardType='number-pad' 
                                maxLength={3} 
                                onChangeText={(text) => setProtein(text)}
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>Протеин</Text>

                        </View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                placeholder='Въглехидрати' 
                                keyboardType='number-pad' 
                                maxLength={3} 
                                onChangeText={(text) => setCarbs(text)}
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>Въглехидрати</Text>

                        </View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                placeholder='Мазнини' 
                                keyboardType='number-pad' 
                                maxLength={3} 
                                onChangeText={(text) => setFat(text)}
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>Мазнини</Text>

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