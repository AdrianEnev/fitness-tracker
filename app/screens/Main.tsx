import { View, Text, ScrollView } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import GlobalContext from '@config/GlobalContext';
import HorizontalCalendar from '@app/components/main/HorizontalCalendar';
import WorkoutFoodButtons from '@components/main/WorkoutFoodButtons';
import Nutrients from '@components/main/NutrientsMain';
import BottomNavigationBar from '@components/BottomNavigationBar';
import ProfilePicture from '@app/components/settings/ProfilePicture';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '@use/settings/get/useGetEmail';
import getCurrentDate from '@use/settings/get/useGetCurrentDate';
import { getLanguageLocally } from '@use/settings/get/useGetLanguageLocally';
import getGoalNutrientslocally from '@app/use/settings/get/useGetGoalNutrientsLocally';
import getCurrentNutrientsLocally from '@app/use/settings/get/useGetCurrentNutrientsLocally';

//bg-[#fd3e6b]
//bg-[#3d5875]

const Main = ({navigation}: any) => {

    const { t } = useTranslation();

    const { internetConnected, iphoneModel, friendRequestsNumber, internetSpeed } = useContext(GlobalContext);

    const [currentNutrients, setCurrentNutrients] = useState<any>(null);
    const [goalNutrients, setGoalNutrients] = useState<any>({
        protein: 0,
        carbs: 0,
        fat: 0,
        calories: 0
    });

    const [goalCalories, setGoalCalories] = useState(0)
    const [goalProtein, setGoalProtein] = useState(0)
    const [goalCarbs, setGoalCarbs] = useState(0)
    const [goalFat, setGoalFat] = useState(0)

    const [currentFormattedDate, setCurrentFormattedDate] = useState<any>();

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

    useFocusEffect(
        React.useCallback(() => {
            if (!currentFormattedDate) return;
    
            const fetch = async () => {
                let goalNutrients = await getGoalNutrientslocally();
                const currentNutrients = await getCurrentNutrientsLocally(currentFormattedDate);

                setGoalCalories(Number(goalNutrients?.calories) || 0);
                setGoalProtein(Number(goalNutrients?.protein) || 0);
                setGoalCarbs(Number(goalNutrients?.carbs) || 0);
                setGoalFat(Number(goalNutrients?.fat) || 0);

                setCurrentNutrients(currentNutrients);
            }
            
            fetch();
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
        <>
            <SafeAreaView style={tw`h-full`}>
                <ScrollView style={tw`h-full w-full`} contentContainerStyle={tw`pb-24`} showsVerticalScrollIndicator={false} scrollEnabled={iphoneModel.includes('SE') ? false : true}>
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
                            <TouchableWithoutFeedback onPress={() => navigation.navigate("Settings")} 
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
                            goalCalories={goalCalories}
                            goalProtein={goalProtein}
                            goalCarbs={goalCarbs}
                            goalFat={goalFat}
                        /> 

                    </View>

                </ScrollView>

                {!iphoneModel.includes('SE') && (
                    <BottomNavigationBar currentPage='Main' navigation={navigation}/>
                )}

            </SafeAreaView>
        </>
    )
}

export default Main