import { View, Text, TextInput, Pressable, ActivityIndicator, Button, Keyboard } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
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

        if (grams === '0' || grams === '00' || grams === '000' || grams === '0000' || grams === '') {
            setGrams('100');
        }

        const results = await getNutrients(searchQuery, grams);

        setFoods(results);

        if (results.length === 0) {
            setNoResults(true);
        }else {
            setSearchText('');
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

            <Pressable style={tw`bg-white shadow-md border border-gray-200 w-full min-h-43 my-1 pt-2 pb-2 rounded-xl`} onPress={() => addItem(item)}>

                
                <Text style={tw`text-black text-xl font-medium text-center`}>{foodTitle}</Text>

                <View style={tw`pl-2 mt-[2px]`}>
                    
                    
                    <Text style={tw`text-black text-lg pr-3`}>{foodGrams || 0} {t('grams')}</Text>
                    <Text style={tw`text-black text-lg`}>{foodCalories} {t('calories')}</Text>
                    <Text style={tw`text-black text-lg`}>{foodProtein}г. {t('protein')}</Text>
                    <Text style={tw`text-black text-lg`}>{foodCarbs}г. {t('carbs')}</Text>
                    <Text style={tw`text-black text-lg`}>{foodFat}г. {t('fat')}</Text>
                </View>

            </Pressable>
        )
    }

    const clearSearchList = () => {
        setFoods([]);
        setSearchQuery('');
        setGrams('');
        setSearchText('Search-food-in-english...');
        setLoading(false);
        setNoResults(false);
    }

    const [searchText, setSearchText] = useState('Search-food-in-english...');

    return (
        <SafeAreaView style={tw`bg-white h-full w-full`}>

            <View style={tw`flex flex-row justify-between mt-1 mx-2 gap-x-2 w-[95.5%]`}>

                <TextInput
                    style={tw`w-[75%] h-13 bg-white shadow-md rounded-xl border border-gray-200 font-medium text-lg pb-2 pl-3`}
                    maxLength={20}
                    placeholder={t('food')}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />

                <TextInput
                    style={tw`w-[22%] h-13 bg-white shadow-md rounded-xl border border-gray-200 font-medium text-lg pb-2 pl-2`}
                    keyboardType='number-pad'
                    placeholder='Грамаж'
                    maxLength={4}
                    value={grams}
                    onChangeText={setGrams}
                />

            </View>

            <Pressable style={tw`w-[96%] h-[82.5%] mx-2 my-2 bg-white shadow-lg border border-gray-200 rounded-lg`} onPress={() => Keyboard.dismiss()}>

                    {!loading && searchText ? (
                        <Text style={tw`text-lg font-medium text-center mt-3`}>{searchText}</Text>
                    ): null}
                    
                    {loading ? (

                        <View style={tw`flex-1 items-center justify-center mt-3`}>
                            <ActivityIndicator size="large" color="#fa1148" />
                        </View>

                    ) : noResults ? (
                        <View>
                            <Text style={tw`text-lg font-medium text-center mt-3`}>Няма резултати...</Text>
                        </View>
                    ) : (
                        <View style={tw`w-[96%] mx-2 mt-2`}>
                            <FlatList data={foods} renderItem={({item}) => renderSearchedFoods(item)} showsVerticalScrollIndicator={false}/>
                        </View>
                    )}
                     
            </Pressable>
           
            <BottomNavigationBar currentPage='AddFoodPage' navigation={navigation} displayFoods={displayFoods} clearSearchFoodSuggestionList={clearSearchList}/>

        </SafeAreaView>
    )
}

export default AddFoodPage