import { View, Text, Modal, Pressable, Keyboard, TextInput } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc'
import i18next, { t } from 'i18next';
import { useTranslation } from 'react-i18next';
import { collection, doc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Dropdown } from 'react-native-element-dropdown';
import GlobalContext from '../../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '../use/useGetEmail';

interface LanguageModalProps {
    isLanguageModalVisible: boolean;
    setIsLanguageModalVisible: (isVisible: boolean) => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ isLanguageModalVisible, setIsLanguageModalVisible }) => { 

    const {t} = useTranslation();
    const currentLanguage = i18next.language;

    const {internetConnected} = useContext(GlobalContext);

    const saveChanges = async () => {

        // change the value of userLanguageDocRef to the selected language
        if (selectedLanguage) {
            setIsLanguageModalVisible(false);

            if (internetConnected) {

                const usersCollectionRef = collection(FIRESTORE_DB, 'users');
                const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
                const userInfoCollectionRef = collection(userDocRef, 'user_info');
                const userLanguageDocRef = doc(userInfoCollectionRef, 'language');

                setDoc(userLanguageDocRef, { language: selectedLanguage });
            }

            AsyncStorage.setItem(`language`, selectedLanguage);
            i18next.changeLanguage(selectedLanguage);
        }else{
            setIsLanguageModalVisible(false);
        }
        
    }

    const dropDownDataEN = [
        {label: 'English', value: 'en'},
        {label: 'Bulgarian', value: 'bg'},
        {label: 'French', value: 'fr'},
        {label: 'German', value: 'de'},
        {label: 'Russian', value: 'ru'},
        {label: 'Italian', value: 'it'},
        {label: 'Spanish', value: 'sp'}
    ]
    const dropDownDataBG = [
        {label: 'Английски', value: 'en'},
        {label: 'Български', value: 'bg'},
        {label: 'Френски', value: 'fr'},
        {label: 'Немски', value: 'de'},
        {label: 'Руски', value: 'ru'},
        {label: 'Италиански', value: 'it'},
        {label: 'Испански', value: 'sp'}
    ]
    const dropDownDataFR = [
        {label: 'Anglais', value: 'en'},
        {label: 'Bulgare', value: 'bg'},
        {label: 'Français', value: 'fr'},
        {label: 'Allemand', value: 'de'},
        {label: 'Russe', value: 'ru'},
        {label: 'Italien', value: 'it'},
        {label: 'Espagnol', value: 'sp'}
    ]
    const dropDownDataDE = [
        {label: 'Englisch', value: 'en'},
        {label: 'Bulgarisch', value: 'bg'},
        {label: 'Französisch', value: 'fr'},
        {label: 'Deutsch', value: 'de'},
        {label: 'Russisch', value: 'ru'},
        {label: 'Italienisch', value: 'it'},
        {label: 'Spanisch', value: 'sp'}
    ]
    const dropdownDataRU = [
        {label: 'Английский', value: 'en'},
        {label: 'Болгарский', value: 'bg'},
        {label: 'Французский', value: 'fr'},
        {label: 'Немецкий', value: 'de'},
        {label: 'Русский', value: 'ru'},
        {label: 'Итальянский', value: 'it'},
    ]

    const dropDownDataIT = [
        {label: 'Inglese', value: 'en'},
        {label: 'Bulgaro', value: 'bg'},
        {label: 'Francese', value: 'fr'},
        {label: 'Tedesco', value: 'de'},
        {label: 'Russo', value: 'ru'},
        {label: 'Italiano', value: 'it'},
        {label: 'Spagnolo', value: 'sp'}
    ]

    const dropDownDataSP = [
        {label: 'Inglés', value: 'en'},
        {label: 'Búlgaro', value: 'bg'},
        {label: 'Francés', value: 'fr'},
        {label: 'Alemán', value: 'de'},
        {label: 'Ruso', value: 'ru'},
        {label: 'Italiano', value: 'it'},
        {label: 'Español', value: 'sp'}
    ]

    let selectedLanguage = '';

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isLanguageModalVisible}
            onRequestClose={() => {
                setIsLanguageModalVisible(!isLanguageModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full h-[25%] rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium mt-1`}>{t('set-language')}</Text>
  
                        <Dropdown 
                            style={tw`h-12 border border-gray-200 px-2 my-2 rounded-lg`}
                            labelField="label"
                            valueField="value"
                            placeholder={
                                currentLanguage === "en" ? "Select a language" : 
                                currentLanguage === "bg" ? "Избери език" :
                                currentLanguage === "fr" ? "Choisir la langue" :
                                currentLanguage === "de" ? "Sprache auswählen" : 
                                currentLanguage === "ru" ? "Выберите язык" : 
                                currentLanguage === "it" ? "Seleziona una lingua" : 
                                currentLanguage === "sp" ? "Selecciona un idioma" : 
                                "Select a language"
                            }
                            data={
                                currentLanguage === "en" ? dropDownDataEN : 
                                currentLanguage === "bg" ? dropDownDataBG : 
                                currentLanguage === "fr" ? dropDownDataFR :
                                currentLanguage === "de" ? dropDownDataDE : 
                                currentLanguage === "ru" ? dropdownDataRU : 
                                currentLanguage === "it" ? dropDownDataIT :
                                currentLanguage === "sp" ? dropDownDataSP :
                                dropDownDataEN
                            }
                            onChange={(item) => selectedLanguage = item.value}
                        />
                        

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-green-500 w-full h-10 rounded-xl flex items-center justify-center`} onPress={saveChanges}>
                                <Text style={tw`text-white text-lg font-medium`}>{t('save')}</Text>
                            </Pressable>
                        </View>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-red-500 w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsLanguageModalVisible(false)}>
                                <Text style={tw`text-white text-lg font-medium`}>{t('cancel')}</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default LanguageModal;