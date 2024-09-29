import { View, Text, Pressable, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import ChangeNutrientModal from '../modals/ChangeNutrientModal';
import getEmail from '../use/useGetEmail';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FoodInfoNutrients = (
    {calories, protein, carbs, fat, formalDate, foodId}: 
    {calories: number, protein: string, carbs: string, fat: string, formalDate: any, foodId: any}
) => {

    const {t} = useTranslation();

    const [isChangeValueModalVisible, setIsChangeValueModalVisible] = useState(false);

    const [selectedNutrient, setSelectedNutrient] = useState('');

    const [newCalories, setNewCalories] = useState(calories);
    const [newProtein, setNewProtein] = useState(protein);
    const [newCarbs, setNewCarbs] = useState(carbs);
    const [newFat, setNewFat] = useState(fat);

    const [initialLoad, setInitialLoad] = useState(true);

    const prevCaloriesRef = useRef(calories);
    const prevProteinRef = useRef(protein);
    const prevCarbsRef = useRef(carbs);
    const prevFatRef = useRef(fat);

    const [nutrientPosition, setNutrientPosition] = useState({ top: 0, left: 0 });

    const handleSaveChanges = async (nutrient: string) => {
        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${formalDate.day}-${formalDate.month}-${formalDate.year}`;
        const storedData = await AsyncStorage.getItem(foodDayKey);
        
        if (storedData) {
            const foodItems = JSON.parse(storedData);
            const foodItem = foodItems.find((item: any) => item.id === foodId);
    
            if (foodItem) {
                switch (nutrient) {
                    case 'calories':
                        foodItem.calories = Number(newCalories);
                        break;
                    case 'protein':
                        foodItem.protein = Number(newProtein);
                        break;
                    case 'carbs':
                        foodItem.carbs = Number(newCarbs);
                        break;
                    case 'fat':
                        foodItem.fat = Number(newFat);
                        break;
                    default:
                        break;
                }
    
                await AsyncStorage.setItem(foodDayKey, JSON.stringify(foodItems));
            }
        }
    }

    useEffect(() => {
        if (initialLoad) {
            setInitialLoad(false);
            return;
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

        // Update previous values
        prevCaloriesRef.current = newCalories;
        prevProteinRef.current = newProtein;
        prevCarbsRef.current = newCarbs;
        prevFatRef.current = newFat;
    }, [newCalories, newProtein, newCarbs, newFat]);

    const handlePress = (nutrient: string, ref: any) => {
        ref.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
            setSelectedNutrient(nutrient);
            setNutrientPosition({ top: py, left: px });
            setIsChangeValueModalVisible(true);
        });
    };

    const calorieRef = useRef(null);
    const proteinRef = useRef(null);
    const carbRef = useRef(null);
    const fatRef = useRef(null);

    return (
        <>

            { isChangeValueModalVisible && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <View style={tw`flex-1`}>

                <ChangeNutrientModal
                    nutrient={selectedNutrient}
                    oldValue={selectedNutrient === 'Calories' ? newCalories : selectedNutrient === 'Protein' ? newProtein : selectedNutrient === 'Carbs' ? newCarbs : newFat}
                    setNewCalories={setNewCalories}
                    setNewProtein={setNewProtein}
                    setNewCarbs={setNewCarbs}
                    setNewFat={setNewFat}
                    isChangeNutrientModalVisible={isChangeValueModalVisible}
                    setIsChangeNutrientModalVisible={setIsChangeValueModalVisible}
                    position={nutrientPosition}
                />

                <View style={tw`w-[94.5%] h-[20%] mx-3 mt-2 flex flex-row justify-between flex-wrap gap-y-3`}>
                    <Pressable ref={calorieRef} style={tw`w-[49%] h-full bg-[#3f8aff] rounded-xl`} onPress={() => handlePress('Calories', calorieRef)}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Calories</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!newCalories ? '0' : newCalories}kcal</Text>
                        </View>

                    </Pressable>

                    <Pressable ref={proteinRef} style={tw`w-[49%] h-full bg-[#fd3e54] rounded-xl`} onPress={() => handlePress('Protein', proteinRef)}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Protein</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!newProtein ? '0' : newProtein}g</Text>
                        </View>

                    </Pressable>

                    <Pressable ref={carbRef} style={tw`w-[49%] h-full bg-[#0fbf8f] rounded-xl`} onPress={() => handlePress('Carbs', carbRef)}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Carbs</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!newCarbs ? '0' : newCarbs}g</Text>
                        </View>

                    </Pressable>
                    
                    <Pressable ref={fatRef} style={tw`w-[49%] h-full bg-[#ffca2c] rounded-xl`} onPress={() => handlePress('Fat', fatRef)}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Fat</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!newFat ? '0' : newFat}g</Text>
                        </View>

                    </Pressable>
                </View>

            </View>
        </>
    )
}

export default FoodInfoNutrients