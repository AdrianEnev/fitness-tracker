import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import ChangeNutrientModal from '@modals/food/ChangeNutrientModal';
import getEmail from '@use/settings/get/useGetEmail';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeValue } from '@use/settings/useNormalizeValue';
import Slider from '@react-native-community/slider';

const FoodInfoNutrients = (
    { calories, grams, protein, carbs, fat, formalDate, food }: 
    { calories: number, grams: any, protein: string, carbs: string, fat: string, formalDate: any, food: any }
) => {
    const { t } = useTranslation();
    
    const [isChangeValueModalVisible, setIsChangeValueModalVisible] = useState(false);
    const [selectedNutrient, setSelectedNutrient] = useState('');
    
    const [newName, setNewName] = useState(food.title);
    const [newCalories, setNewCalories] = useState(calories);
    const [newGrams, setNewGrams] = useState(grams);
    const [newProtein, setNewProtein] = useState(Number(protein));
    const [newCarbs, setNewCarbs] = useState(Number(carbs));
    const [newFat, setNewFat] = useState(Number(fat));
    
    const [initialLoad, setInitialLoad] = useState(true);

    const prevNameRef = useRef(newName);
    const prevCaloriesRef = useRef(calories);
    const prevProteinRef = useRef(Number(protein));
    const prevCarbsRef = useRef(Number(carbs));
    const prevFatRef = useRef(Number(fat));

    const [nutrientPosition, setNutrientPosition] = useState({ top: 0, left: 0 });

    // Ref to manage the timeout (prevents the grams from updating too often)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleSaveChanges = async (nutrient: string) => {

        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${formalDate.day}-${formalDate.month}-${formalDate.year}`;
        const storedData = await AsyncStorage.getItem(foodDayKey);
        
        if (storedData) {
            const foodItems = JSON.parse(storedData);
            const foodItem = foodItems.find((item: any) => item.id === food.id);

            // normalizeValue -> removes any non-numeric characters from the string or prevents numbers from starting with 0
    
            if (foodItem) {
                switch (nutrient) {
                    case 'calories':
                        const normalizedCalories = normalizeValue(newCalories);
                        const ceiledCalories = Math.ceil(Number(normalizedCalories));
                        setNewCalories(ceiledCalories);
                        foodItem.calories = ceiledCalories;
                        break;
                    case 'protein':
                        const normalizedProtein = normalizeValue(newProtein);
                        const ceiledProtein = Math.ceil(Number(normalizedProtein));
                        setNewProtein(ceiledProtein);
                        foodItem.protein = ceiledProtein;
                        break;
                    case 'carbs':
                        const normalizedCarbs = normalizeValue(newCarbs);
                        const ceiledCarbs = Math.ceil(Number(normalizedCarbs));
                        setNewCarbs(ceiledCarbs);
                        foodItem.carbs = ceiledCarbs;
                        break;
                    case 'fat':
                        const normalizedFat = normalizeValue(newFat);
                        const ceiledFat = Math.ceil(Number(normalizedFat));
                        setNewFat(ceiledFat);
                        foodItem.fat = ceiledFat;
                        break;
                    case 'name':
                        foodItem.title = newName;
                        break;
                    default:
                        break;
                }
    
                await AsyncStorage.setItem(foodDayKey, JSON.stringify(foodItems));
            }
        }
    };

    const updateGrams = async () => {
        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${formalDate.day}-${formalDate.month}-${formalDate.year}`;
        const storedData = await AsyncStorage.getItem(foodDayKey);

        if (storedData) {
            const foodItems = JSON.parse(storedData);
            const foodItem = foodItems.find((item: any) => item.id === food.id);

            if (foodItem) {
                foodItem.grams = newGrams;
            }

            await AsyncStorage.setItem(foodDayKey, JSON.stringify(foodItems));
        }
    };

    useEffect(() => {

        // Clear the previous timeout if it exists
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Set a new timeout
        timeoutRef.current = setTimeout(() => {
            updateGrams();
        }, 50);

        // Cleanup function to clear the timeout when the component unmounts or before setting a new timeout
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [newGrams]);

    useEffect(() => {

        if (initialLoad) {
            setInitialLoad(false);
            return;
        }

        if (prevNameRef.current !== newName) {
            handleSaveChanges('name');
        }
        if (prevCaloriesRef.current !== newCalories) {
            handleSaveChanges('calories');
        }
        if (prevProteinRef.current !== newProtein) {
            handleSaveChanges('protein');
        }
        if (prevCarbsRef.current !== newCarbs) {
            handleSaveChanges('carbs');
        }
        if (prevFatRef.current !== newFat) {
            handleSaveChanges('fat');
        }

        prevNameRef.current = newName;
        prevCaloriesRef.current = newCalories;
        prevProteinRef.current = newProtein;
        prevCarbsRef.current = newCarbs;
        prevFatRef.current = newFat;
    }, [newCalories, newProtein, newCarbs, newFat, newName]);

    const handlePress = (nutrient: string, ref: any) => {
        ref.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
            setSelectedNutrient(nutrient);
            setNutrientPosition({ top: py, left: px });
            setIsChangeValueModalVisible(true);
        });
    };

    const nameRef = useRef(null);
    const calorieRef = useRef(null);
    const proteinRef = useRef(null);
    const carbRef = useRef(null);
    const fatRef = useRef(null);

    return (
        <>
            {isChangeValueModalVisible && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}
    
            <View style={tw`flex-1`}>
                <ChangeNutrientModal
                    nutrient={selectedNutrient}
                    oldValue={
                        selectedNutrient === 'Calories' ? newCalories :
                        selectedNutrient === 'Protein' ? newProtein :
                        selectedNutrient === 'Carbs' ? newCarbs :
                        selectedNutrient === 'Fat' ? newFat :
                        newName
                    }
                    setNewName={setNewName}
                    setNewCalories={setNewCalories}
                    setNewProtein={setNewProtein}
                    setNewCarbs={setNewCarbs}
                    setNewFat={setNewFat}
                    isChangeNutrientModalVisible={isChangeValueModalVisible}
                    setIsChangeNutrientModalVisible={setIsChangeValueModalVisible}
                    position={nutrientPosition}
                />

                <View style={tw`w-[94.5%] h-[20%] mx-3 mt-2 flex flex-row justify-between flex-wrap gap-y-3`}>
                    <Pressable ref={nameRef} style={tw`w-[100%] h-[70%] bg-[#9263fa] rounded-xl`} onPress={() => {
                        handlePress('Food Name', nameRef);
                    }}>
                        <Text style={tw`text-2xl text-white font-medium text-center my-1`}>{t('food-name')}</Text>
                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{newName}</Text>
                        </View>
                    </Pressable>

                    <Pressable ref={calorieRef} style={tw`w-[49%] h-full bg-[#3f8aff] rounded-xl`} onPress={() => handlePress('Calories', calorieRef)}>
                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>{t('calories')}</Text>
                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!newCalories ? '0' : newCalories}kcal</Text>
                        </View>
                    </Pressable>

                    <Pressable ref={proteinRef} style={tw`w-[49%] h-full bg-[#fd3e54] rounded-xl`} onPress={() => handlePress('Protein', proteinRef)}>
                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>{t('protein')}</Text>
                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!newProtein ? '0' : newProtein}{t('grams-short')}</Text>
                        </View>
                    </Pressable>

                    <Pressable ref={carbRef} style={tw`w-[49%] h-full bg-[#0fbf8f] rounded-xl`} onPress={() => handlePress('Carbs', carbRef)}>
                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>{t('carbs')}</Text>
                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!newCarbs ? '0' : newCarbs}{t('grams-short')}</Text>
                        </View>
                    </Pressable>
                    
                    <Pressable ref={fatRef} style={tw`w-[49%] h-full bg-[#ffca2c] rounded-xl`} onPress={() => handlePress('Fat', fatRef)}>
                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>{t('fat')}</Text>
                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!newFat ? '0' : newFat}{t('grams-short')}</Text>
                        </View>
                    </Pressable>

                    <View style={tw`w-full h-12 flex flex-col`}>
                        <View style={tw`flex flex-row justify-between`}>
                            <Text style={tw`text-xl font-medium text-gray-500`}>{t('grams')}</Text>
                            <Text style={tw`text-xl font-medium text-gray-500 mr-1`}>{newGrams}</Text>
                        </View>
                        
                        <Slider
                            style={tw`w-full h-12 mt-[-4px]`}
                            value={grams}
                            onValueChange={(value) => setNewGrams(Math.round(value))}
                            minimumValue={0}
                            maximumValue={1000}
                            minimumTrackTintColor="#6b7280"
                            maximumTrackTintColor="#6b7280"
                        />
                    </View>
                </View>
            </View>
        </>
    );
}

export default FoodInfoNutrients;
