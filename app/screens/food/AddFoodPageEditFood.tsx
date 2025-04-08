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
import { FIREBASE_AUTH } from '@config/firebaseConfig';
import generateID from '@use/settings/add/useGenerateID';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';

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

    const formatDate = (date: any) => {
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const addItem = async (item: any) => { 

        if (itemAdded) {
            return  
        }

        setItemAdded(true);

        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${date.day}-${date.month}-${date.year}`;
        const storedData = await AsyncStorage.getItem(foodDayKey);
        const data = storedData ? JSON.parse(storedData) : [];

        const formattedDate = formatDate(date);

        const documentInfo = {
            id: generateID(),
            title: item.title,
            date: new Date().toISOString(),
            calories: Number(newCalories),
            protein: Number(newProtein),
            carbs: Number(newCarbs),
            fat: Number(newCarbs),
            grams: Number(newGrams)
        };

        data.push(documentInfo);
        await AsyncStorage.setItem(foodDayKey, JSON.stringify(data));

        // Not sure if this was added twice on purpose. Will leave as it is until tested
        navigation.goBack();
        navigation.goBack();

        if (internetConnected) {

            const userId = FIREBASE_AUTH.currentUser?.uid;
            
            try {
                const response = await fetch(`http://localhost:3000/api/foodDays/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Specifies the request body is JSON
                    },
                    body: JSON.stringify({
                        itemInfo: documentInfo,
                        formattedDate: formattedDate
                    }),
                });
                if (!response.ok) {
                    console.error("addFoodDay: error:", response.statusText);
                    return null;
                }
            } catch (error) {
                console.error("addFoodDay: error:", error);
                return null;
            }

        }

        updateCurrentNutrients();
    }

    const updateCurrentNutrients = async () => {
        try {
            const email = await getEmail();
            const storedData = await AsyncStorage.getItem(`${email}-foodDay-${date.day}-${date.month}-${date.year}`);
            const data = storedData ? JSON.parse(storedData) : [];

            const formattedDate = formatDate(date);

            if (data.length === 0) {
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

            if (internetConnected) {
                const userId = FIREBASE_AUTH.currentUser?.uid;
            
                try {
                    const response = await fetch(`http://localhost:3000/api/foodDays/${userId}/${formattedDate}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json', // Specifies the request body is JSON
                        },
                        body: JSON.stringify({
                            updatedNutrients: updatedNutrients
                        }),
                    });
                    if (!response.ok) {
                        console.error("addFoodDay: error:", response.statusText);
                        return null;
                    }
                } catch (error) {
                    console.error("addFoodDay: error:", error);
                    return null;
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const addFoodFunc = () => {
        addItem(food)
    }

    return (

        <View style={tw`h-full w-full bg-white`}>
            

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
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
            
            <BottomNavigationBar currentPage='AddFoodPageEditFood' navigation={navigation} addFoodPageAddButton={addFoodFunc}/>
        </View>
        
    )
}

export default AddFoodPageEditFood