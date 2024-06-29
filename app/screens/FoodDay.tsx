import { View, Text, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import { GoalNutrients } from '../../interfaces'
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import RenderAddedFood from '../components/RenderAddedFood';
import { useFocusEffect } from '@react-navigation/native';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import Nutrients from '../components/Nutrients';
import BottomNavigationBar from '../components/BottomNavigationBar';
import getCurrentDate from '../use/useGetCurrentDate';

export interface Food {
    title: string;
    date?: any;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    grams?: number;
    id: any;
}

const FoodDay = ({route, navigation}: any) => {

    //{"dateString": "2024-06-19", "day": 19, "month": 6, "timestamp": 1718791193903, "year": 2024} -> example of what should be passed
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

    let [goalNutrients, setGoalNutrients] = useState<GoalNutrients[]>([]);
    let [currentFoods, setCurrentFoods] = useState<Food[]>([]);

    // izpolzvam GoalNutrients dori i da e za currentNutrients state-a zashtoto si pasva perfektno tuk 
    // object
    let [currentNutrients, setCurrentNutrients] = useState<GoalNutrients[]>([]);

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);

    const foodDaysCollectionRef = collection(userDocRef, 'food_days');
    const foodDayDocRef = doc(foodDaysCollectionRef, `${date.day}-${date.month}-${date.year}`);
    const foodDayCollectionRef = collection(foodDayDocRef, 'foods');

    const userInfoCollectionRef = collection(userDocRef, 'user_info');

    // vzima vsichki hrani ot foodDayCollectionRef i gi podrejda spored data
    const updateCurrentFoods = async () => {
        try {
            const data = await getDocs(foodDayCollectionRef);

            let filteredData: Food[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Food));

            // ako ima pone 2 hrani togava sortira, inache nqma kakvo da se sortira zashtoto e samo 1
            if (filteredData.length > 1) {
                filteredData = filteredData.sort((a, b) => b.date - a.date);
            }

            setCurrentFoods(filteredData);
            
        } catch (err) {
            console.error(err);
        }
    }

    // passed to the first flatlist so goals can be rendered
    const updateGoalNutrients = async () => {
        try {
            const docRef = doc(userInfoCollectionRef, "nutrients");
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {

                const data = docSnap.data() as GoalNutrients;
                setGoalNutrients([{ ...data, id: docSnap.id }]);

            } else {
                console.log("No such document!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    
    const updateCurrentNutrients = async () => {
        try {
            const data = await getDocs(foodDaysCollectionRef);
            const ids = data.docs.map((doc) => doc.id);
            
            const matchingDoc = data.docs.find((doc) => doc.id === `${date.day}-${date.month}-${date.year}`);
            if (matchingDoc) {
                setCurrentNutrients(matchingDoc.data() as GoalNutrients[]);
            }

        } catch (err) {
            console.error(err);
        }
    }

    const handleDeleteFood = async (item: any) => {
        
        try {
            // Iztriva natisnatata hrana
            const foodDocRef = doc(foodDayCollectionRef, item.id);
            await deleteDoc(foodDocRef);
    
            // aktualizira lista s hrani sled iztrivane na 1 ot tqh
            await updateCurrentFoods();

            // aktualizira dannite za makronutrienti
            const data = await getDocs(foodDaysCollectionRef);
            const matchingDoc = data.docs.find((doc) => doc.id === `${date.day}-${date.month}-${date.year}`);
            if (matchingDoc) {
                
                try {
                    const data = await getDocs(foodDayCollectionRef);
        
                    if (data.empty) {
                        const updatedNutrients = {
                            calories: 0,
                            protein: 0,
                            carbs: 0,
                            fat: 0
                        };
            
                        await updateDoc(foodDayDocRef, updatedNutrients);
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
                    updateCurrentNutrients();
                } catch (err) {
                    console.error(err);
                }
            }
            
        } catch (err) {
            console.error(err);
        }
    }

    // runs when the screen is opened
    useFocusEffect(
        React.useCallback(() => {

            const fetchData = async () => {
                await updateCurrentFoods();
                await updateGoalNutrients();
                await updateCurrentNutrients();
            };
    
            fetchData();
            
            return () => {
                // Optional: You can do something when the screen is unfocused
                // This function runs when the screen goes out of focus
            };
        }, [])
    );

    const {t} = useTranslation();
    
    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>

            <View style={tw`w-[99.2%]`}>

                <Nutrients 
                    currentNutrients={currentNutrients} 
                    navigation={navigation} 
                    regularDate={getDate()} 
                    formattedDate={date} 
                    currentPage='FoodDay'
                />

            </View>

            <View style={tw`mx-2 mt-[-570px] w-[96%] h-[56%] bg-white rounded-lg`}>

                <FlatList 
                    data={currentFoods}
                    renderItem={({ item }) => <RenderAddedFood item={item} onDelete={() => handleDeleteFood(item)} />} 
                    showsVerticalScrollIndicator={false} 
                    ListEmptyComponent={
                        <Text style={tw`text-xl font-medium text-center mt-2`}>{t('no-saved-foods')}</Text>
                    }
                />

            </View>

            <BottomNavigationBar 
                currentPage='FoodDay' 
                navigation={navigation} 
                foodDayDate={date}
            />

        </SafeAreaView>
    )
}

export default FoodDay