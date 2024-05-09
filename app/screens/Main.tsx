import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc";
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GoalNutrients } from './SettingsMacros';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { FlatList } from 'react-native-gesture-handler';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import RenderGoalNutrients from '../components/RenderGoalNutrients';
import { useFocusEffect } from '@react-navigation/native';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const Main = ({navigation}: any) => {

    const [steps, setSteps] = useState(0);

    const { t } = useTranslation();

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const foodDaysCollectionRef = collection(userDocRef, 'food_days');

    const getLanguage = async () => {
        try {
            const docSnapshot = await getDoc(doc(userInfoCollectionRef, 'language'));
            if (docSnapshot.exists()) {
                const language = docSnapshot.data().language;
                await i18next.changeLanguage(language);
               
            } else {

                // moje bi da napravq da izchaka 2 sek da probva pak ili neshto takova che ponqkoga ne go udpateva na vreme
                console.log('Language document does not exist');
            }
        } catch (err) {
            console.error(err);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            updateCurrentNutrients();

            (async () => {
                await getLanguage();

            })();

            

            return () => {
                // Optional: You can do something when the screen is unfocused
                // This function runs when the screen goes out of focus
            };
        }, [])
    );

    const getCurrentDate = (padStart: boolean): string => {

        if (padStart) {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}-${month}-${year}`;
        }else{
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1);
            const day = String(date.getDate());
            return `${day}-${month}-${year}`;
        }

    };

    // izpolzvam GoalNutrients dori i da e za currentNutrients state-a zashtoto si pasva perfektno tuk
    let [currentNutrients, setCurrentNutrients] = useState<GoalNutrients[]>([]);
    let [goalNutrients, setGoalNutrients] = useState<GoalNutrients[]>([]);

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

    useEffect(() => {
        onSnapshot(userInfoCollectionRef, (_snapshot) => {
            updateGoalNutrients();
        });
    }, [])

    const updateCurrentNutrients = async () => {
        try {
            const data = await getDocs(foodDaysCollectionRef);
            const ids = data.docs.map((doc) => doc.id);
            
            const matchingDoc = data.docs.find((doc) => doc.id === getCurrentDate(false));
            if (matchingDoc) {
                
                setCurrentNutrients(matchingDoc.data() as GoalNutrients[]);

            }

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <View>
            <View style={tw`w-full h-10 bg-[#FAFAFA]`}></View>

            <ScrollView style={tw`h-full w-full bg-[#FAFAFA]`}>

                <View style={tw`flex flex-row justify-between`}>

                    <Ionicons name='person-circle-outline' size={64} color='#3b82f6' style={tw`m-2 mb-3`}/>

                    <Ionicons name='settings-outline' size={48} color='#000000' style={tw`m-2 mb-3`}
                    onPress={() => navigation.navigate("Настройки-Страница")}/>

                </View>

                <Text style={tw`font-medium text-lg ml-4`}>{t('today')} (
                    <Text style={tw`text-blue-500`}>{getCurrentDate(true)}</Text>)
                </Text>

                <FlatList 
                    data={goalNutrients} 
                    renderItem={({item}) => <RenderGoalNutrients item={item} currentNutrients={currentNutrients} />}  
                    scrollEnabled={false}
                />

                <View style={tw`flex flex-row justify-between mx-2 mt-1`}>

                    <Pressable style={tw`w-[49%] h-32 bg-white shadow-md rounded-lg`} onPress={() => navigation.navigate("Тренировки")}>
                        <View style={tw`flex flex-row justify-between`}>
                            <Text style={tw`font-medium text-base ml-2 mt-1`}>{t('workouts')}</Text>
                            <MaterialCommunityIcons name='human-handsup' size={26} color='#2AAA8A' style={tw`m-2`}/>
                        </View>
                        
                    </Pressable>

                    <Pressable style={tw`w-[49%] h-32 bg-white shadow-md rounded-lg`} onPress={() => navigation.navigate("Хранене")}>
                        <View style={tw`flex flex-row justify-between`}>
                            <Text style={tw`font-medium text-base ml-2 mt-1`}>{t('food-log')}</Text>
                            <MaterialCommunityIcons name='food-apple' size={26} color='#ff474c' style={tw`m-2`}/>
                        </View>
                        
                    </Pressable>

                </View>
                
            </ScrollView>
            
        </View>
        
    )
}

export default Main