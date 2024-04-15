import { View, Text, Image, ScrollView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc";
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GoalNutrients } from './SettingsMacros';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import RenderGoalNutrients from '../components/RenderGoalNutrients';

const Main = ({navigation}: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');

    const getCurrentDate = (): string => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}-${month}-${year}`;
    };

    let [nutrients, setNutrients] = useState<GoalNutrients[]>([]);

    const updateNutrients = async () => {
        try {
          const data = await getDocs(userInfoCollectionRef);
  
          const filteredData: GoalNutrients[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as GoalNutrients));
          
          setNutrients(filteredData);
          
        } catch (err) {
          console.error(err);
        }
    };

    useEffect(() => {
        onSnapshot(userInfoCollectionRef, (_snapshot) => {
            updateNutrients();
        });
    }, [])

    return (
        <View>
            <View style={tw`w-full h-10 bg-white`}></View>

            <View style={tw`h-full w-full bg-white`}>

                <View style={tw`flex flex-row justify-between`}>

                    <Ionicons name='person-circle-outline' size={64} color='#3b82f6' style={tw`m-2 mb-3`}/>

                    <Ionicons name='settings-outline' size={48} color='#000000' style={tw`m-2 mb-3`}
                    onPress={() => navigation.navigate("Настройки-Страница")}/>

                </View>

                <Text style={tw`font-medium text-lg ml-4`}>Днес (
                    <Text style={tw`text-blue-500`}>{getCurrentDate()}</Text>)
                </Text>

                <View style={tw`mb-2`}>
                    <FlatList data={nutrients} renderItem={(item) => RenderGoalNutrients(item)} scrollEnabled={false}/>
                </View>

                <View style={tw`flex flex-row justify-between mx-2`}>

                    <Pressable style={tw`w-[49%] h-32 bg-white shadow-md rounded-lg`} onPress={() => navigation.navigate("Тренировки")}>
                        <View style={tw`flex flex-row justify-between`}>
                            <Text style={tw`font-medium text-base ml-2 mt-1`}>Тренировки</Text>
                            <MaterialCommunityIcons name='human-handsup' size={26} color='#2AAA8A' style={tw`m-2`}/>
                        </View>
                        
                    </Pressable>

                    <Pressable style={tw`w-[49%] h-32 bg-white shadow-md rounded-lg`} onPress={() => navigation.navigate("Хранене")}>
                        <View style={tw`flex flex-row justify-between`}>
                            <Text style={tw`font-medium text-base ml-2 mt-1`}>Хранене</Text>
                            <MaterialCommunityIcons name='food-apple' size={26} color='#ff474c' style={tw`m-2`}/>
                        </View>
                        
                    </Pressable>

                </View>
                
            </View>
            
        </View>
        
    )
}

export default Main