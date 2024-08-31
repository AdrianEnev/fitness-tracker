import { View, Text, Pressable, ScrollView, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tw from "twrnc";
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GoalNutrients } from '../../interfaces';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import getLanguage from '../use/useGetLanguage';

import getCurrentDate from '../use/useGetCurrentDate';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import GlobalContext from '../../GlobalContext';
import HorizontalCalendar from '../components/HorizontalCalendar';
import WorkoutFoodButtons from '../components/WorkoutFoodButtons';
import Nutrients from '../components/NutrientsMain';
import BottomNavigationBar from '../components/BottomNavigationBar';
import ProfilePicture from '../components/ProfilePicture';
import syncWorkouts from '../use/syncWorkouts';
import syncSavedWorkouts from '../use/syncSavedWorkouts';
import syncNutrients from '../use/useSyncNutrients';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '../use/useGetEmail';
import { getLanguageLocally } from '../use/useGetLanguageLocally';


//bg-[#fd3e6b]
//bg-[#3d5875]

const Main = ({navigation}: any) => {

    //const [steps, setSteps] = useState(0);

    const { t } = useTranslation();

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const foodDaysCollectionRef = collection(userDocRef, 'food_days');

    const { internetConnected } = useContext(GlobalContext);

    const [currentFormattedDate, setCurrentFormattedDate] = useState<any>();
    const {friendRequestsNumber} = useContext(GlobalContext);

    const [username, setUsername] = useState<string | null>(null);
    
    const getUsername = async () => {
        const email = await getEmail()

        const AsyncStorageUsername = await AsyncStorage.getItem(`username_${email}`);
        setUsername(AsyncStorageUsername);
    }

    useFocusEffect(
        React.useCallback(() => {

            getUsername();
            getLanguageLocally();
            
            const currentDate = getCurrentDate(false);
            const formattedDate = {
                dateString: currentDate,
                day: parseInt(currentDate.split('-')[0]),
                month: parseInt(currentDate.split('-')[1]),
                year: parseInt(currentDate.split('-')[2]),
                timestamp: Date.now()
            }

            setCurrentFormattedDate(formattedDate)

            if (internetConnected) {
                updateCurrentNutrients();
                syncWorkouts();
                syncSavedWorkouts();
                syncNutrients();
            }

            
             // console log all asyncstorage items
            /*AsyncStorage.getAllKeys().then(keys => {
                console.log(keys)
                return AsyncStorage.multiGet(keys)
            }).then(keyValue => {
                    console.log(keyValue)
            })*/

            // clear all asyncstorage items
            /*AsyncStorage.clear().then(() => {
                console.log('cleared')
            })*/

            
        }, [])
    );

    // izpolzvam GoalNutrients dori i da e za currentNutrients state-a zashtoto si pasva perfektno tuk
    let [currentNutrients, setCurrentNutrients] = useState<GoalNutrients[]>([]);

    const updateCurrentNutrients = async () => {
        try {
            const data = await getDocs(foodDaysCollectionRef);
            const ids = data.docs.map((doc) => doc.id);
            
            const matchingDoc = data.docs.find((doc) => doc.id === getCurrentDate(false));
            if (matchingDoc) {
                setCurrentNutrients(matchingDoc.data() as GoalNutrients[]);
                console.log(matchingDoc.data() as GoalNutrients[])
            }

        } catch (err) {
            console.error(err);
        }
    }

    const getHelloText = (): string => {
        const date = new Date();
        const hours = date.getHours();

        if (hours >= 0 && hours < 12) {
            return t('good-morning');
        } else if (hours >= 12 && hours < 18) {
            return t('good-afternoon');
        } else {
            return t('good-evening');
        }
    }

    return (
        <SafeAreaView style={tw``}>

            <ScrollView style={tw`h-full w-full`}>

                <View style={tw`flex flex-row justify-between mt-2 mx-1`}>

                    <View style={tw`flex flex-row`}>
                        
                        <View style={tw`z-20`}>
                            <ProfilePicture navigation={navigation} page='Main'/>
                        </View>

                        {/* Zdravei User */}
                        <View style={tw`flex flex-col ml-3`}>
                            <Text style={tw`text-lg text-gray-500`}>{getHelloText()} 👋</Text>
                            <Text style={tw`text-xl font-medium`}>{username}</Text>
                        </View>
                            
                    </View>

                    <View>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate("Настройки-Страница")} 
                                style={tw`bg-white w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-200 ml-2`}>
                            <View>
                                <Ionicons name='settings-outline' 
                                    size={40}
                                    color='#000000'
                                />
                                {friendRequestsNumber >= "1" && 
                                    <View style={tw`w-6 h-6 bg-red-500 rounded-full absolute top-[-18px] left-[-8px] flex justify-center items-center`}>
                                        <Text style={tw`text-white`}>{friendRequestsNumber}</Text>
                                    </View>
                                }
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                </View>

                {/* Celi */}
                <View style={tw`mx-1`}>
                    
                    <HorizontalCalendar navigation={navigation} />
                    <WorkoutFoodButtons navigation={navigation} />

                    <Nutrients 
                        currentNutrients={currentNutrients} 
                        navigation={navigation} 
                        formattedDate={currentFormattedDate} 
                        regularDate={getCurrentDate(true)} 
                    />
                    
                </View>

            </ScrollView>

            <BottomNavigationBar currentPage='Main' navigation={navigation}/>

        </SafeAreaView>
        
    )
}

export default Main