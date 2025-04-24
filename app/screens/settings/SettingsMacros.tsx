import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import tw from "twrnc";
import { FIREBASE_AUTH } from '@config/firebaseConfig';
import BottomNavigationBar from '@components/BottomNavigationBar';
import { useTranslation } from 'react-i18next';
import GlobalContext from '@config/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsMacrosComponent from '@app/components/settings/SettingsMacrosComponent';
import { Ionicons } from '@expo/vector-icons';
import getGoalNutrientslocally from '@app/use/settings/get/useGetGoalNutrientsLocally';

const Settings = ({navigation}: any) => {

    const {internetConnected, setSetupRan} = useContext(GlobalContext);

    const { t } = useTranslation();

    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);

    useEffect(() => {
        const fetchInitialNutrients = async () => {
            try {
                const goalNutrients = await getGoalNutrientslocally();

                if (goalNutrients) {
                    setCalories(goalNutrients.calories || 0);
                    setProtein(goalNutrients.protein || 0);
                    setCarbs(goalNutrients.carbs || 0);
                    setFat(goalNutrients.fat || 0);
                }
            } catch (error) {
                console.error('Error getting nutrients from AsyncStorage:', error);
            }
        };

        fetchInitialNutrients();
    }, []);

    const saveNutrients = async () => {

        const newNutrients = {
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat
        }
        
        // save nutrients locally (nqma nujda da proverqvam dali sa razlichni ot predi shtoto taka ili inache otnema suvsem malko vreme da se savenat)
        try {
            const newNutrientsJSON = JSON.stringify(newNutrients);
            await AsyncStorage.setItem(`goal_nutrients_${FIREBASE_AUTH.currentUser?.email}`, newNutrientsJSON);
            navigation.navigate('Settings');
        } catch (error) {
            console.log('Error saving nutrients to AsyncStorage:', error);
        }
 
        if (internetConnected) {
            const userId = FIREBASE_AUTH.currentUser?.uid;

            try {
                const response = await fetch(`http://localhost:3000/api/users/${userId}/dailyGoals`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json', // Specifies the request body is JSON
                    },
                    body: JSON.stringify({
                        newNutrients: newNutrients
                    }),
                });
                if (!response.ok) {
                    console.error("Updating daily macronutrient goals response ERROR: ", response);
                    return null;
                }
            } catch (error) {
                console.error("Updating daily macronutrient goals ERROR: ", error);
                return null;
            }
        }
    };

    const runSetup = async () => {
        setSetupRan(false);
    };

    return (
        <View style={tw`w-full h-full bg-white`}>
            <View style={tw`bg-gray-100 w-full h-[15%] flex flex-row justify-between items-end`}>

                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('daily-goals')}</Text>

                <View style={tw`m-3`}>
                    <Ionicons name="settings-outline" size={42} color="black" onPress={() => runSetup()} />
                </View>
            </View>

            <SettingsMacrosComponent
                calories={calories}
                protein={protein}
                carbs={carbs}
                fat={fat}
                setCalories={setCalories}
                setProtein={setProtein}
                setCarbs={setCarbs}
                setFat={setFat}
            />    

            <BottomNavigationBar 
                currentPage='Settings-Macronutrients' 
                navigation={navigation} 
                settingsActions={{
                    saveSettingsMacrosButton: saveNutrients
                }}
            />
        </View>
    );
};

export default Settings;
