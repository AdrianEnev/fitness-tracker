import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import tw from "twrnc";
import { collection, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@config/firebaseConfig';
import i18next from '@config/services/i18next';
import BottomNavigationBar from '@components/BottomNavigationBar';
import { useTranslation } from 'react-i18next';
import GlobalContext from '@config/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '@use/settings/get/useGetEmail';
import SettingsMacrosComponent from '@app/components/settings/SettingsMacrosComponent';

interface Nutrient {
    key: string;
    value: number;
}

const Settings = ({navigation}: any) => {

    

    const {internetConnected} = useContext(GlobalContext);

    const { t } = useTranslation();

    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);

    useEffect(() => {
        const fetchInitialNutrients = async () => {
            try {
                const localNutrients = await AsyncStorage.getItem(`goal_nutrients_${await getEmail()}`);
                if (localNutrients) {
                    const parsedLocalNutrients = JSON.parse(localNutrients);

                    setCalories(parsedLocalNutrients.calories || 0);
                    setProtein(parsedLocalNutrients.protein || 0);
                    setCarbs(parsedLocalNutrients.carbs || 0);
                    setFat(parsedLocalNutrients.fat || 0);
                }
            } catch (error) {
                console.error('Error getting nutrients from AsyncStorage:', error);
            }
        };

        fetchInitialNutrients();
    }, []);

    const saveNutrients = async () => {

        const tempNutrients = {
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat
        }
        
        // save nutrients locally (nqma nujda da proverqvam dali sa razlichni ot predi shtoto taka ili inache otnema suvsem malko vreme da se savenat)
        try {
            const jsonNutrients = JSON.stringify(tempNutrients);
            await AsyncStorage.setItem(`goal_nutrients_${FIREBASE_AUTH.currentUser?.email}`, jsonNutrients);
            navigation.navigate('Настройки-Страница');
            console.log('saved successfuly (locally)')
        } catch (error) {
            console.log('Error saving nutrients to AsyncStorage:', error);
        }

        if (internetConnected) {
            // save nutrients to firestore
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            const userInfoCollectionRef = collection(userDocRef, 'user_info');
            const nutrientsDocRef = doc(userInfoCollectionRef, 'nutrients');

            try {
                await setDoc(nutrientsDocRef, tempNutrients);
                console.log('saved successfuly (firestore)')
            } catch (error) {
                console.error('Error saving nutrients to Firestore:', error);
            }
        }

    };

    return (
        <View style={tw`w-full h-full bg-white`}>
            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('daily-goals')}</Text>
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

            <BottomNavigationBar currentPage='Settings-Macronutrients' navigation={navigation} saveSettingsMacrosButton={saveNutrients}/>
        </View>
    );
};

export default Settings;
