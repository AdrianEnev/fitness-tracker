import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback, Keyboard, TextInput, SafeAreaView } from 'react-native';
import tw from "twrnc";
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import i18next from '../../services/i18next';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '../use/useGetEmail';

interface Nutrient {
    key: string;
    value: number;
}

const Settings = ({navigation}: any) => {

    const [tempNutrients, setTempNutrients] = useState<Record<string, number>>({});

    /*const updateNutrients = async () => {
        try {
            const docSnap = await getDoc(nutrientsDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data() as Record<string, number>;
                setNutrients(data);
                setTempNutrients(data);
            } else {
                console.log("No such document!");
            }
        } catch (err) {
            console.error(err);
        }
    };*/

    const updateNutrientsLocally = async () => {
        try {
            const localNutrients = await AsyncStorage.getItem(`goal_nutrients_${await getEmail()}`);
            if (localNutrients) {
                const parsedLocalNutrients = JSON.parse(localNutrients);
                setTempNutrients(parsedLocalNutrients);
            }
        } catch (error) {
            console.error('Error getting nutrients from AsyncStorage:', error);
        }
    }

    const setNutrient = (value: string, nutrientType: string) => {
        setTempNutrients(prevState => ({
            ...prevState,
            [nutrientType]: value === '' ? 0 : parseFloat(value) || 0
        }));
    };

    const saveNutrients = async () => {
        
        // save nutrients locally (nqma nujda da proverqvam dali sa razlichni ot predi shtoto taka ili inache otnema suvsem malko vreme da se savenat)
        try {
            const jsonNutrients = JSON.stringify(tempNutrients);
            await AsyncStorage.setItem(`goal_nutrients_${FIREBASE_AUTH.currentUser?.email}`, jsonNutrients);
            navigation.navigate('Настройки-Страница');
            console.log('saved successfuly (locally)')
        } catch (error) {
            console.log('Error saving nutrients to AsyncStorage:', error);
        }

    };

    useEffect(() => {
        updateNutrientsLocally();
    }, []);

    const nutrientBox = (value: string, title: string) => (
        <View style={tw`w-full p-2`}>
            <Text style={tw`text-xl font-medium text-black ml-2 mb-1`}>{i18next.t(title)}</Text>
            <TextInput 
                style={tw`w-full h-12 rounded-2xl bg-[#fd1c47] pb-2 pl-3 text-white font-medium text-xl`} 
                keyboardType='number-pad' 
                value={value === '0' ? '' : value}
                maxLength={4} 
                onChangeText={(text) => setNutrient(text, title)} 
            />
        </View>
    );

    const fixedOrderNutrients = ['calories', 'protein', 'carbs', 'fat'];
    const nutrientsArray: Nutrient[] = fixedOrderNutrients.map(key => ({
        key,
        value: tempNutrients[key] || 0
    }));

    const renderItem = ({ item }: { item: Nutrient }) => (
        nutrientBox(item.value.toString(), item.key)
    );

    const { t } = useTranslation();

    return (
        <SafeAreaView style={tw`w-full h-full bg-white`}>
            <Text style={tw`text-2xl font-medium text-center mt-1 mb-4`}>{t('set-daily-goals')}</Text>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw`flex-1`}>
                    <View style={tw`w-full bg-white`}>
                        <FlatList
                            data={nutrientsArray}
                            renderItem={renderItem}
                            keyExtractor={item => item.key}
                            numColumns={2} // This will layout items in a grid with 2 columns
                            columnWrapperStyle={tw`justify-between w-1/2`} // Adjusts spacing between columns
                            contentContainerStyle={tw`p-3`} // Adds padding around the list
                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <BottomNavigationBar currentPage='Settings-Macronutrients' navigation={navigation} saveSettingsMacrosButton={saveNutrients}/>
        </SafeAreaView>
    );
};

export default Settings;
