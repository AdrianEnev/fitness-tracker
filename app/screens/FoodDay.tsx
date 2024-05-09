import { View, Text, FlatList, Pressable } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc"
import { GoalNutrients } from './SettingsMacros';
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import RenderGoalNutrients from '../components/RenderGoalNutrients';
import RenderAddedFood from '../components/RenderAddedFood';
import { useFocusEffect } from '@react-navigation/native';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';

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

    const { date } = route.params;

    let [goalNutrients, setGoalNutrients] = useState<GoalNutrients[]>([]);
    let [currentFoods, setCurrentFoods] = useState<Food[]>([]);

    //let [filteredCurrentFoods, setFilteredCurrentFoods] = useState<Food[]>([])

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

    const calculateNutrientsOnDeletion = (item: Food) => {

        // ot testvane razbrah che {"calories": 1778, "carbs": 456, "fat": 6, "protein": 22} se vodi object a ne array ili obratnoto
        // moga da suzdam vtori state za currentNutrients koito se zadava pri updateCurrentNutrients samo che raboti specialno za funkciqta tuk

        let object = currentNutrients;
        let array = Object.entries(object)
        console.log(array)
        console.log(currentNutrients)

    }

    //handleDeleteFood is currently not being used for testing purposes
    const handleDeleteFood = async (item: any) => {

        const updatedNutrients = calculateNutrientsOnDeletion(item)
        console.log(updatedNutrients);
        

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
    
    return (
        <View style={tw`bg-white h-full`}>

            <View style={tw`bg-white w-full h-12`}></View> 

            <View style={tw`flex flex-row justify-between mt-2`}>

                <Text style={tw`font-bold text-xl ml-3 mt-3`}>
                    {date.day > 9 ? date.day : `0${date.day}`} - {date.month > 9 ? date.month : `0${date.month}`} - {date.year}
                </Text>

                <View style={tw`flex flex-row justify-end`}>
                    <Pressable style={tw`bg-blue-500 w-12 h-12 rounded-full items-center justify-center self-center mr-3`} onPress={() => navigation.navigate("Храна-Добави", { date: date })}>
                        <Ionicons name="add-outline" size={36} color="white"/>
                    </Pressable>

                    <Pressable style={tw`bg-blue-500 w-12 h-12 rounded-full items-center justify-center self-center mr-3`} onPress={() => navigation.navigate("Храна-Потърси", { date: date })}>
                        <Ionicons name="search-outline" size={28} color="white"/>
                    </Pressable>
                </View>
                

            </View>

            <View style={tw`mb-2`}>
                <FlatList data={goalNutrients} renderItem={({item}) => <RenderGoalNutrients item={item} currentNutrients={currentNutrients} />}  scrollEnabled={false}/>
            </View>

            <View style={tw`mx-3 flex-1 mb-5`}>

                <FlatList 
                    data={currentFoods}
                    renderItem={({ item }) => <RenderAddedFood item={item} onDelete={() => calculateNutrientsOnDeletion(item)} />} 
                    showsVerticalScrollIndicator={false} 
                />

            </View>

        </View>
    )
}

export default FoodDay