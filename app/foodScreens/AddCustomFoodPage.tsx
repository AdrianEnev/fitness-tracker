import { View, Text, TouchableWithoutFeedback, Button, Keyboard, TextInput, ScrollView } from 'react-native'
import React, { useContext, useState } from 'react'
import tw from "twrnc"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import getEmail from '../use/useGetEmail';
import GlobalContext from '../../GlobalContext';
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import generateID from '../use/useGenerateID';
import AddFoodNutrientsComponent from './AddFoodNutrientsComponent';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';

const AddCustomFoodPage = ({navigation, route}: any) => {

    const { t } = useTranslation();

    const { date } = route.params;

    const {internetConnected} = useContext(GlobalContext);

    const [name, setName] = useState("Example");
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);
    const [grams, setGrams] = useState(0);

    const formatDate = (date: any) => {
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const formatDatePretty = (date: any) => {
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        return `${day}.${month}.${year}`;
    }

    const updateCurrentNutrients = async () => {

        try {
            const email = await getEmail();
            const storedData = await AsyncStorage.getItem(`${email}-foodDay-${date.day}-${date.month}-${date.year}`);
            const data = storedData ? JSON.parse(storedData) : [];

            const formattedDate = formatDate(date);

            //console.log(`${email}-foodDay-${date.day}-${date.month}-${date.year}`)

            if (data.length === 0) {
                // foodDayCollectionRef is empty
                return;
            }

            let totalCalories = 0;
            let totalProtein = 0;
            let totalCarbs = 0;
            let totalFat = 0;

            data.forEach((food: any) => {
                totalCalories += food.calories || 0;
                totalProtein += food.protein || 0;
                totalCarbs += food.carbs || 0;
                totalFat += food.fat || 0;
            });

            /*if (totalCalories >= 9999) {
                totalCalories = 9999;
            }else if (totalProtein >= 9999) {
                totalProtein = 9999;
            }else if (totalCarbs >= 9999) {
                totalCarbs = 9999;
            }else if (totalFat >= 9999) {
                totalFat = 9999;
            }*/

            const updatedNutrients = {
                calories: totalCalories,
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat
            };

            await AsyncStorage.setItem(`${email}-foodDay-${date.day}-${date.month}-${date.year}-nutrients`, JSON.stringify(updatedNutrients));

            if (internetConnected) {

                // Update Firestore
                const usersCollectionRef = collection(FIRESTORE_DB, 'users');
                const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
                const foodDaysCollectionRef = collection(userDocRef, 'food_days');  
                const foodDayDocRef = doc(foodDaysCollectionRef, formattedDate);
    
                const docSnapshot = await getDoc(foodDayDocRef);

                if (docSnapshot.exists()) {
                    await updateDoc(foodDayDocRef, updatedNutrients);
                } else {
                    await setDoc(foodDayDocRef, updatedNutrients);
                }
            }
        } catch (err) {
            console.error(err);
        }

    };

    const [saveFoodRan, setSaveFoodRan] = useState(false)

    const saveFood = async () => {
        if (!name && saveFoodRan) {
            console.log('save food already ran')
            return;
        }

        setSaveFoodRan(true)
    
        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${date.day}-${date.month}-${date.year}`;
        const storedData = await AsyncStorage.getItem(foodDayKey);
        const data = storedData ? JSON.parse(storedData) : [];

        const formattedDate = formatDate(date);

        let newCalories = Number(String(calories).replace(',', '.'));
        newCalories = Math.ceil(newCalories);
    
        let newProtein = Number(String(protein).replace(',', '.'));
        newProtein = Math.ceil(newProtein);
        
        let newCarbs = Number(String(carbs).replace(',', '.'));
        newCarbs = Math.ceil(newCarbs);
        
        let newFat = Number(String(fat).replace(',', '.'));
        newFat = Math.ceil(newFat);

        /*if (newCalories >= 9999) {
            newCalories = 9999;
        }else if (newProtein >= 9999) {
            newProtein = 9999;
        }else if (newProtein >= 9999) {
            newProtein = 9999;
        }else if (newCarbs >= 9999) {
            newCarbs = 9999;
        }else if (newFat >= 9999) {
            newFat = 9999;
        }*/
        
        const documentInfo = {
            id: generateID(),
            title: name.trim(),
            date: new Date().toISOString(),
            calories: newCalories,
            protein: newProtein,
            carbs: newCarbs,
            fat: newFat,
            grams: Math.round(grams),
            //timestamp: serverTimestamp()
        };
    
        data.push(documentInfo);
        await AsyncStorage.setItem(foodDayKey, JSON.stringify(data));

        navigation.goBack();

        if (internetConnected) {
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            const foodDaysCollectionRef = collection(userDocRef, 'food_days');  
            const foodDayDocRef = doc(foodDaysCollectionRef, formattedDate);
            const foodDayFoodsCollectionRef = collection(foodDayDocRef, 'foods');
            const foodDocRef = doc(foodDayFoodsCollectionRef, documentInfo.id);
    
            await setDoc(foodDocRef, documentInfo);
        }
        
        updateCurrentNutrients();
        
    }

    return (
        <View style={tw`h-full w-full bg-white`}>
            
            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>Add Food-</Text>
            </View>

            <View style={tw`flex flex-row justify-between mx-4`}>
                <Text style={tw`text-xl font-medium text-gray-500 mt-2`}>Add food manually</Text>
                <Text style={tw`text-xl font-medium text-gray-500 mt-2`}>{formatDatePretty(date)}</Text>
            </View>

            <AddFoodNutrientsComponent
                navigation={navigation} 
                calories={calories} 
                protein={protein} 
                carbs={carbs} 
                fat={fat} 
                setCalories={setCalories} 
                setProtein={setProtein} 
                setCarbs={setCarbs} 
                setFat={setFat}    
                saveFood={saveFood} 
                name={name}
                setName={setName}        
                grams={grams}
                setGrams={setGrams}   
            />

            <BottomNavigationBar currentPage='AddCustomFoodPage' navigation={navigation} addCustomFoodPageAddFood={saveFood}/>
            
        </View>
    )
}

export default AddCustomFoodPage