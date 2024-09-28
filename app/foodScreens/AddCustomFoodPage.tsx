import { View, Text, TouchableWithoutFeedback, Button, Keyboard, TextInput } from 'react-native'
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

const AddCustomFoodPage = ({navigation, route}: any) => {

    const { t } = useTranslation();

    const { date } = route.params;

    const {internetConnected} = useContext(GlobalContext);

    const [name, setName] = useState("");
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
            return;
        }

        setSaveFoodRan(true)
    
        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${date.day}-${date.month}-${date.year}`;
        const storedData = await AsyncStorage.getItem(foodDayKey);
        const data = storedData ? JSON.parse(storedData) : [];

        const formattedDate = formatDate(date);
    
        const documentInfo = {
            id: generateID(),
            title: name.trim(),
            date: new Date().toISOString(),
            calories: Math.round(calories),
            protein: Math.round(protein),
            carbs: Math.round(carbs),
            fat: Math.round(fat),
            grams: Math.round(grams),
            //timestamp: serverTimestamp()
        };
    
        data.push(documentInfo);
        await AsyncStorage.setItem(foodDayKey, JSON.stringify(data));

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
        setSaveFoodRan(false)
        navigation.goBack();
    }

    const setNutrient = (value: any, nutrientType: any) => {
        switch (nutrientType) {
            case 'name':
                setName(value);
                break;
            case 'calories':
                setCalories(Number(value));
                break;
            case 'protein':
                setProtein(Number(value));
                break;
            case 'carbs':
                setCarbs(Number(value));
                break;
            case 'fat':
                setFat(Number(value));
                break;
            case 'grams':
                setGrams(Number(value));
                break;
            default:
                break;
        }
    }

    const box = (title: string, identifier: string) => (
        <View style={tw`w-[48%]`}>

            <Text style={tw`text-xl font-medium text-black ml-[6px] mb-1`}>{title}</Text>

            <TextInput 
                style={tw`w-full h-12 rounded-2xl bg-[#fd1c47] px-3 pb-2 text-white font-medium text-xl`} 
                keyboardType={title === t('food') ? 'default' : 'number-pad'} 
                maxLength={title === t('food') ? 40 : 5} 
                onChangeText={(text) => setNutrient(text, identifier)}
            />

        </View>
    );

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw`flex-1 mx-3`}>

                    <View style={tw`flex-1 flex-row flex-wrap w-full gap-x-3 gap-y-3 mt-3`}>

                        {box(t('food'), 'name')}
                        {box(t('calories'), 'calories')}
                        {box(t('protein'), 'protein')}
                        {box(t('carbs'), 'carbs')}
                        {box(t('fat'), 'fat')}
                        {box(t('grams'), 'grams')}

                    </View>
                </View>

            </TouchableWithoutFeedback>

            <BottomNavigationBar 
                currentPage='AddCustomFood' 
                navigation={navigation} 
                foodDayDate={date}
                saveCustomFood={() => saveFood()}
            />
        </SafeAreaView>
    )
}

export default AddCustomFoodPage