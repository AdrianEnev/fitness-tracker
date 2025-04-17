import { View, Text, FlatList } from 'react-native';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import tw from "twrnc";
import { CurrentNutrients } from '@config/interfaces';
import RenderAddedFood from '@components/food/RenderAddedFood';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Nutrients from '@components/food/NutrientsFoodDay';
import BottomNavigationBar from '@components/BottomNavigationBar';
import { Food } from '@config/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '@use/settings/get/useGetEmail';
import generateID from '@use/settings/add/useGenerateID';
import GlobalContext from '@config/GlobalContext';

const FoodDay = ({route, navigation}: any) => {

    const { date } = route.params;

    const getDate = () => {

        if (date.day < 10 && date.month < 10) {
            return `0${date.day}.0${date.month}.${date.year}`;
        } else if (date.day < 10) {
            return `0${date.day}.${date.month}.${date.year}`;
        } else if (date.month < 10) {
            return `${date.day}.0${date.month}.${date.year}`;
        }

        return `${date.day}.${date.month}.${date.year}`;
    }

    let [currentFoods, setCurrentFoods] = useState<Food[]>([]);
    let [currentNutrients, setCurrentNutrients] = useState<CurrentNutrients>({ calories: 0, protein: 0, carbs: 0, fat: 0, id: generateID() });

    const updateCurrentFoods = async () => {
        try {

            const email = await getEmail();

            const storedFoods = await AsyncStorage.getItem(`${email}-foodDay-${date.day}-${date.month}-${date.year}`);
            console.log(`${email}-foodDay-${date.day}-${date.month}-${date.year}`)
            
            let filteredData: Food[] = storedFoods ? JSON.parse(storedFoods) : [];
    
            if (filteredData.length > 1) {
                filteredData = filteredData.sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
            }
    
            setCurrentFoods(filteredData);
            //console.log(`Data retrieved for key ${email}-foodDay-${date.day}-${date.month}-${date.year}:`, filteredData);

        } catch (err) {
            console.error(err);
        }
    }

    const updateCurrentNutrients = () => {
        
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        currentFoods.forEach(food => {
            totalCalories += food.calories || 0;
            totalProtein += food.protein || 0;
            totalCarbs += food.carbs || 0;
            totalFat += food.fat || 0;
        });

        setCurrentNutrients({
            calories: totalCalories,
            protein: totalProtein,
            carbs: totalCarbs,
            fat: totalFat,
            id: generateID()
        });

        
    }

    useEffect(() => {
        const fetchData = async () => {
            await updateCurrentFoods();
        };

        fetchData();
    }, [])

    useEffect(() => {
        updateCurrentNutrients();
    }, [currentFoods]);

    useFocusEffect(
        useCallback(() => {
            updateCurrentFoods();
        }, [])
    );

    const {t} = useTranslation();

    const {internetConnected} = useContext(GlobalContext);

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>

            <View style={tw`w-full h-full flex flex-col`}>

                <Nutrients 
                    currentNutrients={currentNutrients} 
                    navigation={navigation} 
                    regularDate={getDate()} 
                    formattedDate={date} 
                />

                <View style={tw`mx-2 mt-5 w-[96%] h-[56%] bg-white rounded-lg`}>

                    <FlatList 
                        data={currentFoods}
                        renderItem={({ item }) => <RenderAddedFood item={item} navigation={navigation} date={date}/>}
                        showsVerticalScrollIndicator={false} 
                        ListEmptyComponent={
                            <Text style={tw`text-2xl font-medium text-gray-500 text-center mt-4`}>{t('no-saved-foods')}</Text>
                        }
                    />

                </View>

            </View>

            <BottomNavigationBar 
                currentPage='FoodDay' 
                navigation={navigation} 
                foodDayDate={date}
                internetConnected={internetConnected}
            />

        </SafeAreaView>
    )
}

export default FoodDay;