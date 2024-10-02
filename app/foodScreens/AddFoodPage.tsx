import { View, Text, TextInput, Pressable, ActivityIndicator, Button, Keyboard } from 'react-native'
import React, { useState, useContext } from 'react'
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { addDoc, collection, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Food } from '../../interfaces';
import getNutrients from '../use/useGetNutrients';
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalContext from '../../GlobalContext';
import getEmail from '../use/useGetEmail';
import generateID from '../use/useGenerateID';

const AddFoodPage = ({route, navigation}: any) => {
    
    const {t} = useTranslation();

    const { date } = route.params;

    const {internetConnected} = useContext(GlobalContext);

    const [searchQuery, setSearchQuery] = useState('');
    const [grams, setGrams] = useState('');
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    
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

    const renderSearchedFoods = (item: any) => {

        return (

            <Pressable style={tw`bg-white shadow-md border border-gray-200 w-full min-h-16 my-1 pt-2 pb-2 rounded-xl flex flex-row justify-between items-center px-3`} 
                onPress={() => navigation.navigate('Храна-Добави-Подробности', {food: item, date: date})}>

                <Text style={tw`text-black text-2xl font-medium max-w-[75%]`}>{item.title}</Text>
                <Text style={tw`text-black text-2xl font-medium`}>{item.grams}g</Text>
                

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

            <Pressable style={tw`w-full h-full my-2 bg-white shadow-lg border border-gray-200`} onPress={() => Keyboard.dismiss()}>

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
                        <View style={tw`w-[96%] h-[82%] mx-2 mt-2`}>
                            <FlatList data={foods} renderItem={({item}) => renderSearchedFoods(item)} showsVerticalScrollIndicator={false}/>
                        </View>
                    )}
                     
            </Pressable>
           
            <BottomNavigationBar currentPage='AddFoodPage' navigation={navigation} displayFoods={displayFoods} clearSearchFoodSuggestionList={clearSearchList}/>

        </SafeAreaView>
    )
}

export default AddFoodPage