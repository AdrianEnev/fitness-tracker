import { View, Text, FlatList, Button, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc"
import { GoalNutrients } from './SettingsMacros';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import RenderGoalNutrients from '../components/RenderGoalNutrients';
import RenderCurrentNutrients from '../components/RenderCurrentNutrients';
import { useFocusEffect } from '@react-navigation/native';

export interface Food {
    title: string;
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

    // izpolzvam GoalNutrients dori i da e za currentNutrients state-a zashtoto si pasva perfektno tuk
    let [currentNutrients, setCurrentNutrients] = useState<GoalNutrients[]>([]);

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);

    const foodDaysCollectionRef = collection(userDocRef, 'food_days');
    const foodDayDocRef = doc(foodDaysCollectionRef, `${date.day}-${date.month}-${date.year}`);
    const foodDayCollectionRef = collection(foodDayDocRef, 'foods');

    const userInfoCollectionRef = collection(userDocRef, 'user_info');

    const updateCurrentFoods = async () => {
        try {
            const data = await getDocs(foodDayCollectionRef);
    
            const filteredData: Food[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Food));
            
            setCurrentFoods(filteredData);
            
            
        } catch (err) {
            console.error(err);
        }
    }

    const updateGoalNutrients = async () => {
        try {
          const data = await getDocs(userInfoCollectionRef);
  
          const filteredData: GoalNutrients[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as GoalNutrients));
          
          setGoalNutrients(filteredData);
          
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

    // runs when the screen is opened
    useFocusEffect(
        React.useCallback(() => {
            updateGoalNutrients();
            updateCurrentFoods();
            updateCurrentNutrients();
    
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
                <FlatList data={currentFoods} renderItem={({item}) => RenderCurrentNutrients(item)} showsVerticalScrollIndicator={false}/>
            </View>

        </View>
    )
}

export default FoodDay