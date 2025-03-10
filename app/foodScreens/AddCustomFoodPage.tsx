import { View, Text} from 'react-native'
import React, { useContext, useState } from 'react'
import tw from "twrnc"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '../components/BottomNavigationBar';
import getEmail from '../use/useGetEmail';
import GlobalContext from '../../GlobalContext';
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import generateID from '../use/useGenerateID';
import AddFoodNutrientsComponent from './AddFoodNutrientsComponent';

const AddCustomFoodPage = ({navigation, route}: any) => {

    const { t } = useTranslation();

    const { date } = route.params;

    const {internetConnected, internetSpeed} = useContext(GlobalContext);

    const [name, setName] = useState(t('example-food'));
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);
    const [grams, setGrams] = useState(0);

    // Format date to work with the database
    const formatDate = (date: any) => {
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Format date to be displayed to the user
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

            const updatedNutrients = {
                calories: totalCalories,
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat
            };

            await AsyncStorage.setItem(`${email}-foodDay-${date.day}-${date.month}-${date.year}-nutrients`, JSON.stringify(updatedNutrients));

            // add to database in the background
            if (internetConnected && internetSpeed > 32) {

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
            //console.log('save food already ran')
            return;
        }

        setSaveFoodRan(true)
    
        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${date.day}-${date.month}-${date.year}`;
        console.log(foodDayKey)
        const storedData = await AsyncStorage.getItem(foodDayKey);
        const data = storedData ? JSON.parse(storedData) : [];

        const formattedDate = formatDate(date); // 2024-11-15

        let newCalories = Number(String(calories).replace(',', '.'));
        newCalories = Math.ceil(newCalories);
    
        let newProtein = Number(String(protein).replace(',', '.'));
        newProtein = Math.ceil(newProtein);
        
        let newCarbs = Number(String(carbs).replace(',', '.'));
        newCarbs = Math.ceil(newCarbs);
        
        let newFat = Number(String(fat).replace(',', '.'));
        newFat = Math.ceil(newFat);
        
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
        console.log("Adding item to async storage:", documentInfo);
        await AsyncStorage.setItem(foodDayKey, JSON.stringify(data));
        
        navigation.goBack();

        if (internetConnected) {
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            const foodDaysCollectionRef = collection(userDocRef, 'food_days');  
            const foodDayDocRef = doc(foodDaysCollectionRef, formattedDate);

            //await setDoc(foodDayDocRef, { calories: newCalories, protein: newProtein, carbs: newCarbs, fat: newFat }, { merge: true });

            const foodDayFoodsCollectionRef = collection(foodDayDocRef, 'foods');
            const foodDocRef = doc(foodDayFoodsCollectionRef, documentInfo.id);
    
            await setDoc(foodDocRef, documentInfo);
        }
        
        updateCurrentNutrients();
    }

    return (
        <View style={tw`h-full w-full bg-white`}>
            
            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('add-food')}</Text>
            </View>

            <View style={tw`flex flex-row justify-between mx-4`}>
                <Text style={tw`text-xl font-medium text-gray-500 mt-2`}>{t('add-food-manually')}</Text>
                <Text style={tw`text-xl font-medium text-gray-500 mt-2`}>{formatDatePretty(date)}</Text>
            </View>

            <AddFoodNutrientsComponent
                calories={calories} 
                protein={protein} 
                carbs={carbs} 
                fat={fat} 
                setCalories={setCalories} 
                setProtein={setProtein} 
                setCarbs={setCarbs} 
                setFat={setFat}    
                name={name}
                setName={setName}        
                grams={grams}
                setGrams={setGrams} 
                translation={t}  
            />

            <BottomNavigationBar currentPage='AddCustomFoodPage' navigation={navigation} addCustomFoodPageAddFood={saveFood}/>
            
        </View>
    )
}

export default AddCustomFoodPage