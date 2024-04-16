import { View, Text, TouchableWithoutFeedback, Button, Keyboard, TextInput } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc"
import { addDoc, collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Food } from './FoodDay';

const AddCustomFoodPage = ({navigation, route}: any) => {

    const { date } = route.params;

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const foodDaysCollectionRef = collection(userDocRef, 'food_days');
    const foodDayDocRef = doc(foodDaysCollectionRef, `${date.day}-${date.month}-${date.year}`);
    const foodDayCollectionRef = collection(foodDayDocRef, 'foods');

    const [name, setName] = useState("");
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);
    const [grams, setGrams] = useState(0);

    const updateCurrentNutrients = async () => {
        try {
            const data = await getDocs(foodDayCollectionRef);

            if (data.empty) {
                // foodDayCollectionRef is empty
                return;
            }

            let totalCalories = 0;
            let totalProtein = 0;
            let totalCarbs = 0;
            let totalFat = 0;

            data.forEach((doc) => {
                const food = doc.data() as Food;
                totalCalories += food.calories || 0;
                totalProtein += food.protein || 0;
                totalCarbs += food.carbs || 0;
                totalFat += food.fat || 0;
            });

            const updatedNutrients = {
                calories: totalCalories,
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat
            };

            await updateDoc(foodDayDocRef, updatedNutrients);
        } catch (err) {
            console.error(err);
        }
    };

    const saveFood = async () => {
        
        const foodDayDocRef = doc(foodDaysCollectionRef, `${date.day}-${date.month}-${date.year}`);
            
            await setDoc(foodDayDocRef, {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            })

            const foodDayCollectionRef = collection(foodDayDocRef, 'foods');
            
            const documentInfo = {
                title: name,
                calories: Math.round(calories),
                protein: Math.round(protein),
                carbs: Math.round(carbs),
                fat: Math.round(fat),
                grams: Math.round(grams)
            };

            await addDoc(foodDayCollectionRef, documentInfo);
            updateCurrentNutrients();
            navigation.goBack();
            
    }

    return (
        <View style={tw`mx-3 h-full flex-1 mt-10`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw`flex-1`}>

                    <View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                placeholder='име' 
                                maxLength={20} 
                                onChangeText={(text) => setName(text)} 
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>Име</Text>

                        </View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                placeholder='Калории' 
                                keyboardType='number-pad' 
                                maxLength={4} 
                                onChangeText={(text) => setCalories(Number(text))} 
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>Калории</Text>

                        </View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                placeholder='Протеин' 
                                keyboardType='number-pad' 
                                maxLength={3} 
                                onChangeText={(text) => setProtein(Number(text))}
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>Протеин</Text>

                        </View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                placeholder='Въглехидрати' 
                                keyboardType='number-pad' 
                                maxLength={3} 
                                onChangeText={(text) => setCarbs(Number(text))}
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>Въглехидрати</Text>

                        </View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                placeholder='Мазнини' 
                                keyboardType='number-pad' 
                                maxLength={3} 
                                onChangeText={(text) => setFat(Number(text))}
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>Мазнини</Text>

                        </View>

                        <View style={tw`flex flex-row justify-between`}>

                            <TextInput 
                                style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                                placeholder='грамове' 
                                keyboardType='number-pad' 
                                maxLength={5} 
                                onChangeText={(text) => setGrams(Number(text))}
                            />

                            <Text style={tw`font-medium text-xl mt-3`}>Грамове</Text>

                        </View>
                    
                    </View>

                    <View style={tw`flex-1 justify-end mb-3`}>
                        <Button onPress={saveFood} title='Запази'/> 
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

export default AddCustomFoodPage