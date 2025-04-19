import { View, Text, TextInput, Pressable, ActivityIndicator, Keyboard } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';
import { FlatList } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '@components/BottomNavigationBar';
import getNutrients from '@use/food/useGetNutrients';

const AddFoodPage = ({route, navigation}: any) => {
    
    const {t} = useTranslation();

    const { date } = route.params;

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
        }

        setLoading(false);
        
    }

    const renderSearchedFoods = (item: any) => {

        return (

            <Pressable style={tw`bg-white shadow-md border border-gray-200 w-full min-h-16 my-1 pt-2 pb-2 rounded-xl flex flex-row justify-between items-center px-3`} 
                onPress={() => navigation.navigate('Храна-Добави-Подробности', {food: item, date: date})}>

                <Text style={tw`text-black text-2xl font-medium max-w-[75%]`}>{item.title}</Text>
                <Text style={tw`text-black text-2xl font-medium`}>{item.calories.toFixed(0)}{t('calories-short')}</Text>
                
            </Pressable>
        )
    }

    const clearSearchList = () => {
        setFoods([]);
        setSearchQuery('');
        setGrams('');
        setLoading(false);
        setNoResults(false);
    }

    return (
        <View style={tw`h-full w-full bg-white`}>
            

            <View style={tw`bg-gray-100 w-full h-[15%] flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('search-foods')}</Text> 
            </View>

            <Pressable style={tw`w-full h-[76%] my-2 bg-white`} onPress={() => Keyboard.dismiss()}>

                <View style={tw`flex flex-row justify-between mt-1 mx-2 w-[95.5%] my-1`}>

                    <View style={tw`flex flex-row items-center bg-white rounded-xl shadow-md border border-gray-200`}>
                        <Ionicons name='search' size={28} style={tw`ml-2`} color='#9ca3af' onPress={displayFoods}/>
                        <TextInput
                            style={tw`w-[67.5%] h-13 font-medium text-lg pb-[8px] pl-3`}
                            maxLength={20}
                            placeholder={t('food')}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    <TextInput
                        style={tw`w-[22.5%] h-[13.5] bg-white shadow-md rounded-xl border border-gray-200 font-medium text-base pb-2 text-center`}
                        keyboardType='number-pad'
                        placeholder={t('grams-2')}
                        maxLength={4}
                        value={grams}
                        onChangeText={setGrams}
                    />

                </View>

                {(searchQuery === '' && grams === '' && !noResults && !loading && foods?.length === 0) && (
                     <View style={tw`mx-3`}>
                        <Text style={tw`text-lg text-gray-600 font-medium text-center mt-3`}>{t('food-names-english')}</Text>
                    </View>
                )}
               
                
                {loading ? (

                    <View style={tw`flex-1 items-center justify-center mt-3`}>
                        <ActivityIndicator size="large" color="#fa1148" />
                    </View>

                ) : noResults ? (
                    <View>
                        <Text style={tw`text-lg font-medium text-center mt-3`}>{t('no-results')}</Text>
                    </View>
                ) : (
                    <View style={tw`w-[96%] h-[82%] mx-2 mt-2`}>
                        <FlatList data={foods} renderItem={({item}) => renderSearchedFoods(item)} showsVerticalScrollIndicator={false}/>
                    </View>
                )}
                     
            </Pressable>
           
            <BottomNavigationBar 
                currentPage='Add-Food' 
                navigation={navigation} 
                foodActions={{
                    displayFoods: displayFoods,
                    clearSearchFoodSuggestionList: clearSearchList
                }}
            />

        </View>
    )
}

export default AddFoodPage