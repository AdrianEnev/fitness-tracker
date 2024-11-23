import { View, Text, ScrollView } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';

import getCurrentDate from '../use/useGetCurrentDate';

import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import GlobalContext from '../../GlobalContext';
import HorizontalCalendar from '../components/HorizontalCalendar';
import WorkoutFoodButtons from '../components/WorkoutFoodButtons';
import Nutrients from '../components/NutrientsMain';
import BottomNavigationBar from '../components/BottomNavigationBar';
import ProfilePicture from '../components/ProfilePicture';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '../use/useGetEmail';
import { getLanguageLocally } from '../use/useGetLanguageLocally';

//bg-[#fd3e6b]
//bg-[#3d5875]

const Main = ({navigation}: any) => {

    const { t } = useTranslation();

    const { internetConnected } = useContext(GlobalContext);

    const [currentFormattedDate, setCurrentFormattedDate] = useState<any>();
    const {friendRequestsNumber} = useContext(GlobalContext);

    const [username, setUsername] = useState<string | null>(null);

    const getUsernameLocally = async () => {
        const email = await getEmail();

        const AsyncStorageUsername = await AsyncStorage.getItem(`username_${email}`);
        
        if (AsyncStorageUsername) {
            setUsername(AsyncStorageUsername);
        }
       
    }

    useFocusEffect(
        useCallback(() => {
            getUsernameLocally();
            getLanguageLocally();
            
            const currentDate = getCurrentDate(false);
            const formattedDate = {
                dateString: currentDate,
                day: parseInt(currentDate.split('-')[0]),
                month: parseInt(currentDate.split('-')[1]),
                year: parseInt(currentDate.split('-')[2]),
                timestamp: Date.now()
            }

            setCurrentFormattedDate(formattedDate);
        }, [internetConnected])
    );

    let [currentNutrients, setCurrentNutrients] = useState<any>(null);
    const [goalNutrients, setGoalNutrients] = useState<any>(null);

    useFocusEffect(
        React.useCallback(() => {
            if (!internetConnected || !currentFormattedDate) return;
    
            const getGoalNutrientslocally = async () => {
                try {
                    const localNutrients = await AsyncStorage.getItem(`goal_nutrients_${await getEmail()}`);
                    if (localNutrients) {
                        const parsedLocalNutrients = JSON.parse(localNutrients);
                        setGoalNutrients(parsedLocalNutrients);
                    }
                } catch (error) {
                    console.error('Error getting nutrients from AsyncStorage:', error);
                }
            }
            getGoalNutrientslocally();
    
            const getCurrentNutrientsLocally = async () => {
                try {
                    const email = await getEmail();
                    const storedData = await AsyncStorage.getItem(`${email}-foodDay-${currentFormattedDate.day}-${currentFormattedDate.month}-${currentFormattedDate.year}`);
                    const data = storedData ? JSON.parse(storedData) : [];
    
                    //console.log(`${email}-foodDay-${currentFormattedDate.day}-${currentFormattedDate.month}-${currentFormattedDate.year}`)
    
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
    
                    setCurrentNutrients(updatedNutrients);
                } catch (err) {
                    console.error(err);
                }
            }
            getCurrentNutrientsLocally();
    
        }, [internetConnected, currentFormattedDate])
    );

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
        <SafeAreaView style={tw`h-full`}>

            <ScrollView style={tw`h-full w-full`} contentContainerStyle={tw`pb-24`} showsVerticalScrollIndicator={false}>

                <View style={tw`flex flex-row justify-between mt-2 mx-1`}>

                    <View style={tw`flex flex-row`}>
                        
                        <View style={tw`z-20`}>
                            <ProfilePicture navigation={navigation} page='Main'/>
                        </View>

                        {/* Zdravei User */}
                        <View style={tw`flex flex-col ml-3 w-full`}>
                            <Text style={tw`text-lg text-gray-500`}>{getHelloText()} 👋</Text>
                            <Text style={tw`text-xl font-medium max-w-[85%]`}>{username ? username : t('loading')}</Text>
                        </View>
                            
                    </View>

                    <View style={tw`absolute top-0 right-2`}>
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
                <View style={tw`mx-1 h-full`}>
                    
                    <HorizontalCalendar navigation={navigation} />
                    <WorkoutFoodButtons navigation={navigation} />

                    <Nutrients 
                        currentNutrients={currentNutrients} 
                        navigation={navigation} 
                        formattedDate={currentFormattedDate} 
                        regularDate={getCurrentDate(true)} 
                        goalNutrients={goalNutrients}
                    /> 

                </View>

            </ScrollView>

            <BottomNavigationBar currentPage='Main' navigation={navigation}/>

        </SafeAreaView>
        
    )
}

export default Main