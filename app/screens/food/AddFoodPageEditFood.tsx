import { View, Text, Pressable } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import GlobalContext from '@config/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalizeValue } from '@use/settings/useNormalizeValue';
import getEmail from '@use/settings/get/useGetEmail';
import tw from 'twrnc'
import ChangeNutrientModal from '@modals/food/ChangeNutrientModal';
import { BlurView } from 'expo-blur';
import BottomNavigationBar from '@components/BottomNavigationBar';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import addFood from '@app/use/food/addFood';

const AddFoodPageEditFood = ({route, navigation}: any) => {

    const {food, date} = route.params;

    const {t} = useTranslation();

    const [newTitle, setNewTitle] = useState(food.title)
    const [newGrams, setNewGrams] = useState(food.grams)
    const [newCalories, setNewCalories] = useState(food.calories.toFixed(0))
    const [newProtein, setNewProtein] = useState(food.protein.toFixed(0))
    const [newCarbs, setNewCarbs] = useState(food.carbs.toFixed(0))
    const [newFat, setNewFat] = useState(food.fat.toFixed(0))

    const {internetConnected} = useContext(GlobalContext);

    const prevTitleRef = useRef(newTitle);
    const prevCaloriesRef = useRef(newCalories);
    const prevProteinRef = useRef(Number(newProtein));
    const prevCarbsRef = useRef(Number(newCarbs));
    const prevFatRef = useRef(Number(newFat));

    const titleRef = useRef(null)
    const calorieRef = useRef(null);
    const proteinRef = useRef(null);
    const carbRef = useRef(null);
    const fatRef = useRef(null);

    const [nutrientPosition, setNutrientPosition] = useState({ top: 0, left: 0 });

    const [selectedNutrient, setSelectedNutrient] = useState('')
    const [isChangeValueModalVisible, setIsChangeValueModalVisible] = useState(false)

    // Used to prevent multiple foods from being added at the same time
    const [itemAdded, setItemAdded] = useState(false);

    // Calculate the position of the modal to show up by getting the clicked nutrient box position
    const handlePress = (nutrient: string, ref: any) => {
        ref.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
            setSelectedNutrient(nutrient);
            setNutrientPosition({ top: py, left: px });
            setIsChangeValueModalVisible(true);
        });
    };

    const handleSaveChanges = async (nutrient: string) => {

        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${date.day}-${date.month}-${date.year}`;
        const storedData = await AsyncStorage.getItem(foodDayKey);
        
        if (storedData) {
            const foodItems = JSON.parse(storedData);
            const foodItem = foodItems.find((item: any) => item.id === food.id);
    
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
                    case 'title':
                        foodItem.title = newTitle;
                        break;
                    default:
                        break;
                }
    
                await AsyncStorage.setItem(foodDayKey, JSON.stringify(foodItems));
            }
        }
    };

    const [initialLoad, setInitialLoad] = useState(true)

    useEffect(() => {
        if (initialLoad) {
            setInitialLoad(false);
            return;
        }

        if (prevTitleRef.current !== newTitle) {
            handleSaveChanges('title');
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

        prevTitleRef.current = newTitle;
        prevCaloriesRef.current = newCalories;
        prevProteinRef.current = newProtein;
        prevCarbsRef.current = newCarbs;
        prevFatRef.current = newFat;
    }, [newCalories, newProtein, newCarbs, newFat, newTitle]);

    const addItem = async () => { 

        if (itemAdded) {
            return  
        }

        setItemAdded(true);

        // Create foodInfo object to pass for readability
        const foodInfo = {
            foodName: newTitle.trim(),
            calories: newCalories,
            protein: newProtein,
            carbs: newCarbs,
            fat: newFat,
            grams: newGrams
        }

        // Passed to addFood so it knows if the food is being added from the customFoodPage or searchFoodPage
        // Only used to determine where to navigate
        const isCustomFood = false
        
        // Add food to asyncstorage and firebase
        await addFood(date, foodInfo, internetConnected, navigation, isCustomFood);
    }

    return (

        <View style={tw`h-full w-full bg-white`}>
            
            <View style={tw`bg-gray-100 w-full h-[15%] flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('macronutrients')}</Text>
            </View>

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
                            newTitle
                        }
                        setNewName={setNewTitle}
                        setNewCalories={setNewCalories}
                        setNewProtein={setNewProtein}
                        setNewCarbs={setNewCarbs}
                        setNewFat={setNewFat}
                        isChangeNutrientModalVisible={isChangeValueModalVisible}
                        setIsChangeNutrientModalVisible={setIsChangeValueModalVisible}
                        position={nutrientPosition}
                    />

                    <View style={tw`w-[94.5%] h-[20%] mx-3 mt-2 flex flex-row justify-between flex-wrap gap-y-3`}>

                        <Pressable ref={titleRef} style={tw`w-[100%] h-[70%] bg-[#9263fa] rounded-xl`} onPress={() => {
                            handlePress('Food Name', titleRef)
                        }}>

                            <Text style={tw`text-2xl text-white font-medium text-center my-1`}>{t('food-name')}</Text>

                            <View style={tw`flex-1 items-center justify-center mb-4`}>
                                <Text style={tw`text-4xl text-white font-medium text-center`}>{newTitle}</Text>
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
                            <Text style={tw`text-xl font-medium text-gray-500`}>{t('grams-2')}</Text>
                            <Text style={tw`text-xl font-medium text-gray-500 mr-1`}>{newGrams}</Text>
                        </View>

                        <Slider
                            style={tw`w-full h-12 mt-[-4px]`}
                            value={newGrams}
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
            
            <BottomNavigationBar currentPage='AddFoodPageEditFood' navigation={navigation} addFoodPageAddButton={addItem}/>
        </View>
        
    )
}

export default AddFoodPageEditFood