import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput } from 'react-native';
import tw from "twrnc";
import { collection, doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import i18next from '../../services/i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { useTranslation } from 'react-i18next';

const Settings = ({navigation}: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const nutrientsDocRef = doc(userInfoCollectionRef, 'nutrients');

    let [nutrients, setNutrients] = useState({});
    let [tempNutrients, setTempNutrients] = useState({});

    const updateNutrients = async () => {
        const docSnap = await getDoc(nutrientsDocRef);
        if (docSnap.exists()) {
            setNutrients(docSnap.data());
            setTempNutrients(docSnap.data()); // Initialize tempNutrients with the current nutrients
        } else {
            console.log("No such document!");
        }
    };

    const setNutrient = (value: any, nutrientType: any) => {
        setTempNutrients(prevState => ({
            ...prevState,
            [nutrientType]: value
        }));
    };

    const saveNutrients = async () => {
        try {
            await setDoc(nutrientsDocRef, tempNutrients, { merge: true });
            setNutrients(tempNutrients); 
            navigation.goBack();
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        onSnapshot(userInfoCollectionRef, () => {
            updateNutrients();
        });
    }, []);

    const nutrientBox = (value: any, title: string) => (
        <View style={tw`w-[48%]`}>
            <Text style={tw`text-xl font-medium text-black ml-[6px] mb-1`}>{i18next.t(title)}</Text>
            <TextInput 
                style={tw`w-full h-12 rounded-2xl bg-[#fd1c47] pb-[6px] pl-3 text-white font-medium text-xl`} 
                keyboardType='number-pad' 
                defaultValue={value}
                maxLength={4} 
                onChangeText={(text) => setNutrient(text, title)} 
            />
        </View>
    );

    const renderNutrients = ({ item }: any) => (
        <View style={tw`flex flex-row flex-wrap w-full gap-x-3 gap-y-3 mt-3`}>
            {nutrientBox(item.calories, 'calories')}
            {nutrientBox(item.protein, 'protein')}
            {nutrientBox(item.carbs, 'carbs')}
            {nutrientBox(item.fat, 'fat')}
        </View>
    );

    const {t} = useTranslation();

    return (
        <SafeAreaView style={tw`w-full h-full bg-white`}>
            <Text style={tw`text-2xl font-medium text-center mt-1 mb-4`}>{t('set-daily-goals')}</Text>

            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw`flex-1`}>
                    <View style={tw`w-full bg-white`}>
                        <View style={tw`mx-3`}>
                            <FlatList data={[tempNutrients]} renderItem={renderNutrients} />
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            <BottomNavigationBar currentPage='Settings-Macronutrients' navigation={navigation} saveSettingsMacrosButton={saveNutrients}/>
        </SafeAreaView>
    );
};

export default Settings;