import { View, Text, Button, TouchableOpacity, Pressable, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import tw from 'twrnc'
import { Switch } from 'react-native';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalContext from '../../GlobalContext';
import BottomNavigationBar from '../components/BottomNavigationBar';
import ProfilePicture from '../components/ProfilePicture';

const Settings = ({navigation}: any) => {

    // opciq za smenq na ezika koqto zadava neshto v bazata danni i ot tam se izvlicha ezikut za cqlata aplikaciq
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');

    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const { friendRequestsNumber, profilePicture, setProfilePicture, username } = useContext(GlobalContext);

    const { t } = useTranslation();

    const getLanguage = async () => {
        try {
            const docSnapshot = await getDoc(doc(userInfoCollectionRef, 'language'));
            if (docSnapshot.exists()) {
                const language = docSnapshot.data().language;
                
                return language;
            } else {

                // moje bi da napravq da izchaka 2 sek da probva pak ili neshto takova che ponqkoga ne go udpateva na vreme
                console.log('Language document does not exist');
            }
        } catch (err) {
            console.error(err);
        }
    }

    const changeLanguage = async (language: string) => {
        try {
            await i18next.changeLanguage(language);
            setSelectedLanguage(language);

            await setDoc(doc(userInfoCollectionRef, 'language'), { language: language });
        } catch (err) {
            console.error(err);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                const language = await getLanguage();
                await i18next.changeLanguage(language);
                setSelectedLanguage(language);
            })();
        }, [])
    );

    return (
        <View style={tw`h-full`}>

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>Настройки</Text>
            </View>

            <View style={tw`bg-white h-full`}>

                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => navigation.navigate('Настройки-Акаунт')}>
                    <View style={tw`flex flex-row justify-between`}>

                        <View style={tw`flex flex-row`}>
                            <View style={tw`w-10 h-10 bg-blue-300 rounded-full flex items-center justify-center mr-2`}>
                                <Ionicons name='person-outline' size={28} color='#2563eb' />
                            </View>
                            
                            <View style={tw`flex justify-center`}>
                                <Text style={tw`text-lg font-medium`}>{t('account')}</Text>
                            </View>
                        </View>

                        <View style={tw`flex justify-center`}>
                            <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                        </View>

                    </View>
                </Pressable>

                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => navigation.navigate('Настройки-Макронутриенти')}>
                    <View style={tw`flex flex-row justify-between`}>

                        <View style={tw`flex flex-row`}>
                            <View style={tw`w-10 h-10 bg-orange-300 rounded-full flex items-center justify-center mr-2`}>
                                <Ionicons name='flame-outline' size={28} color='#d97706' />
                            </View>
                            
                            <View style={tw`flex justify-center`}>
                                <Text style={tw`text-lg font-medium`}>{t('macronutrients')}</Text>
                            </View>
                        </View>

                        <View style={tw`flex justify-center`}>
                            <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                        </View>

                    </View>
                </Pressable>

                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => navigation.navigate('Приятели')}>
                    <View style={tw`flex flex-row justify-between`}>

                        <View style={tw`flex flex-row`}>
                            <View style={tw`w-10 h-10 bg-green-300 rounded-full flex items-center justify-center mr-2`}>
                                <Ionicons name='people-outline' size={28} color='#22c55e' />
                            </View>
                            
                            <View style={tw`flex justify-center`}>
                                <Text style={tw`text-lg font-medium`}>Приятели</Text>
                            </View>
                        </View>

                        <View style={tw`flex justify-center`}>
                            <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                        </View>

                    </View>
                </Pressable>

                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => navigation.navigate('Настройки-Статистика')}>
                    <View style={tw`flex flex-row justify-between`}>

                        <View style={tw`flex flex-row`}>
                            <View style={tw`w-10 h-10 bg-yellow-300 rounded-full flex items-center justify-center mr-2`}>
                                <Ionicons name='stats-chart-outline' size={26} color='#eab308' />
                            </View>
                            
                            <View style={tw`flex justify-center`}>
                                <Text style={tw`text-lg font-medium`}>Статистика</Text>
                            </View>
                        </View>

                        <View style={tw`flex justify-center`}>
                            <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                        </View>

                    </View>
                </Pressable>

            </View>

            <BottomNavigationBar currentPage='Settings' navigation={navigation}/>

        </View>
    )
}

export default Settings