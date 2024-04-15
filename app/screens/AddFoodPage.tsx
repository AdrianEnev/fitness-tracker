import { View, Text, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';
import { getFoodNutrients } from '../use/useAddFood';
import { FlatList } from 'react-native-gesture-handler';
import { addDoc, collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Food } from './FoodDay';

const AddFoodPage = ({route, navigation}: any) => {

    const { date } = route.params;

    const [searchQuery, setSearchQuery] = useState('');
    const [grams, setGrams] = useState('');

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const foodDaysCollectionRef = collection(userDocRef, 'food_days');
    const foodDayDocRef = doc(foodDaysCollectionRef, `${date.day}-${date.month}-${date.year}`);
    const foodDayCollectionRef = collection(foodDayDocRef, 'foods');
    
    // tuk narochno ne se polzva interface zashtoto nqma da e lesno da dobavq gramove kum nego
    const [foods, setFoods] = useState<{ 
        title: any; 
        calories: number | undefined; 
        protein: number | undefined; 
        carbs: number | undefined; 
        fat: number | undefined; 
    }[] | undefined>([]);

    const displayFoods = async () => {

        const results = await getFoodNutrients(searchQuery, grams);
        
        setFoods(results)
        
    }

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

    const renderSearchedFoods = (item: any) => {

        // da moje choveka da si izbira makronutrientite na ruka ako ne e dovolen s rezultatite
        // otdelno da preimenuvam "nutrients" na "goalNutrients" i da opravq flatlista 
        // da izlizat nai-chesto izpolzvanite hrani predi tursene
        // moga da translate-na rezultata

        const addItem = async (item: any) => { 

            const foodDayDocRef = doc(foodDaysCollectionRef, `${date.day}-${date.month}-${date.year}`);
            
            await setDoc(foodDayDocRef, {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            })

            const foodDayCollectionRef = collection(foodDayDocRef, 'foods');
            
            const documentInfo = {
                title: item.title,
                calories: item.calories,
                protein: item.protein,
                carbs: item.carbs,
                fat: item.fat,
                grams: item.grams
            };

            await addDoc(foodDayCollectionRef, documentInfo);
            updateCurrentNutrients();
            navigation.goBack();
            
        }
        
        const foodTitle = item.title;
        const foodGrams = item.grams;

        let foodCalories = item.calories ? item.calories.toFixed(0) : "0";

        let foodProtein = item.protein ? item.protein.toFixed(0) : "0";

        let foodCarbs = item.carbs ? item.carbs.toFixed(0) : "0";

        let foodFat = item.fat ? item.fat.toFixed(0) : "0";

        return (

            <Pressable style={tw`bg-blue-500 w-full h-64 my-1 pt-2 pl-3 rounded-xl`} onPress={() => addItem(item)}>

                <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-white text-lg`}>{foodTitle}</Text>
                    <Text style={tw`text-white text-lg pr-3`}>{foodGrams || 0} грама</Text>
                </View>
                
                <Text style={tw`text-white text-lg`}>{foodCalories} калории</Text>
                <Text style={tw`text-white text-lg`}>{foodProtein}г. протеин</Text>
                <Text style={tw`text-white text-lg`}>{foodCarbs}г. въглехидрати</Text>
                <Text style={tw`text-white text-lg`}>{foodFat}г. мазнини</Text>

            </Pressable>
        )
    }

    return (
        <View style={tw`bg-white h-full`}>
            <View style={tw`bg-white w-full h-12`}></View>

            <View style={tw`flex flex-row justify-between mt-4 mx-2`}>

                <Pressable style={tw`bg-blue-500 w-12 h-12 rounded-full items-center justify-center self-center mr-3`} onPress={()=>displayFoods()}>
                    <Ionicons name="search" size={24} color="white"/>
                </Pressable>

                <TextInput
                    style={tw`text-2xl w-[200px] h-16 bg-blue-500 text-white rounded-lg p-3`}
                    maxLength={20}
                    placeholder='Apple'
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TextInput
                    style={tw`text-2xl w-[100px] h-16 bg-blue-500 text-white rounded-lg p-3 ml-2`}
                    keyboardType='number-pad'
                    placeholder='200'
                    maxLength={4}
                    value={grams}
                    onChangeText={setGrams}
                />

            </View>

            <View style={tw`mt-2 mx-3 flex-1 mb-5`}>
                <FlatList data={foods} renderItem={({item}) => renderSearchedFoods(item)} showsVerticalScrollIndicator={false}/>
            </View>

           
        </View>
    )
}

export default AddFoodPage