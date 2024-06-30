import { View, Text, TextInput, Pressable, ActivityIndicator, Button } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';
import { addDoc, collection, doc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Food } from '../../interfaces';
import getNutrients from '../use/useGetNutrients';
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { SafeAreaView } from 'react-native-safe-area-context';

const AddFoodPage = ({route, navigation}: any) => {
    
    const {t} = useTranslation();

    const { date } = route.params;

    const [searchQuery, setSearchQuery] = useState('');
    const [grams, setGrams] = useState('');
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);

    // izpolzva se za da predodvrati spamene pri dobavqne na hrana
    const [itemAdded, setItemAdded] = useState(false);

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

        setNoResults(false);
        setFoods([]);
        setLoading(true);

        if (!searchQuery) {
            setLoading(false);
            return;
        }

        if (grams === '0' || grams === '') {
            setGrams('100');
        }

        const results = await getNutrients(searchQuery, grams);
        
        setFoods(results);
        
        if (results.length === 0) {
            setNoResults(true);
        }

        setLoading(false);
        
    }

    const updateCurrentNutrients = async () => {
        try {
            const data = await getDocs(foodDayCollectionRef);

            if (data.empty) {
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

        const addItem = async (item: any) => { 

            if (itemAdded) {
                return;
            }

            setItemAdded(true);

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
                date: serverTimestamp(),
                calories: Math.round(item.calories),
                protein: Math.round(item.protein),
                carbs: Math.round(item.carbs),
                fat: Math.round(item.fat),
                grams: Math.round(item.grams)
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

            <Pressable style={tw`bg-[#fc2d42] w-full min-h-43 my-1 pt-2 pl-3 rounded-xl`} onPress={() => addItem(item)}>

                <View style={tw`flex flex-row justify-between`}>
                    <Text style={tw`text-white text-lg`}>{foodTitle}</Text>
                    <Text style={tw`text-white text-lg pr-3`}>{foodGrams || 0} {t('grams')}</Text>
                </View>
                
                <Text style={tw`text-white text-lg`}>{foodCalories} {t('calories')}</Text>
                <Text style={tw`text-white text-lg`}>{foodProtein}г. {t('protein')}</Text>
                <Text style={tw`text-white text-lg`}>{foodCarbs}г. {t('carbs')}</Text>
                <Text style={tw`text-white text-lg`}>{foodFat}г. {t('fat')}</Text>

            </Pressable>
        )
    }

    const clearSearchList = () => {
        setFoods([]);
        setSearchQuery('');
        setGrams('');
    }

    return (
        <SafeAreaView style={tw`bg-white h-full w-full`}>

            <View style={tw`flex flex-row justify-between mt-4 mx-2`}>

                <TextInput
                    style={tw`w-[75%] h-13 bg-white text-black font-medium text-lg shadow-md rounded-xl pl-4 pb-2 z-10`}
                    maxLength={20}
                    placeholder={t('food')}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <TextInput
                    style={tw`w-[20%] h-13 bg-white text-black font-medium text-lg shadow-md rounded-xl text-center pb-2 z-10`}
                    keyboardType='number-pad'
                    placeholder={t('grams')}
                    maxLength={4}
                    value={grams}
                    onChangeText={setGrams}
                />

            </View>

            <View style={tw`mt-2 mx-3 w-[94.5%] h-[80%] mb-5`}>
                <FlatList data={foods} renderItem={({item}) => renderSearchedFoods(item)} showsVerticalScrollIndicator={false}/>
            </View>
           
            <BottomNavigationBar currentPage='AddFoodPage' navigation={navigation} displayFoods={displayFoods} clearSearchFoodSuggestionList={clearSearchList}/>

           
        </SafeAreaView>
    )
}

export default AddFoodPage