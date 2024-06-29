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
import LanguageModal from '../components/LanguageModal';
import { BlurView } from 'expo-blur';

const Settings = ({navigation}: any) => {

    const { friendRequestsNumber } = useContext(GlobalContext);

    // opciq za smenq na ezika koqto zadava neshto v bazata danni i ot tam se izvlicha ezikut za cqlata aplikaciq
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');

    const [selectedLanguage, setSelectedLanguage] = useState('en');

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

    const button = (navigationPath: string, icon: any, iconColor: any, background: string, title: string) => {

        return (
            <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => navigation.navigate(navigationPath)}>
                <View style={tw`flex flex-row justify-between`}>

                    <View style={tw`flex flex-row`}>
                        <View style={tw`w-10 h-10 bg-${background} rounded-full flex items-center justify-center mr-2`}>
                            <Ionicons name={icon} size={28} color={iconColor} />
                        </View>
                        
                        <View style={tw`flex justify-center`}>
                            <Text style={tw`text-lg font-medium`}>{title}</Text>
                        </View>
                    </View>

                    <View style={tw`flex justify-center`}>
                        <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                    </View>

                </View>
            </Pressable>
        )

    }

    const [isLanguageModalVisible, setIsLanguageModalVisible] = useState(false);

    return (
        <View style={tw`h-full`}>
            
            { isLanguageModalVisible && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}   

            <LanguageModal 
                isLanguageModalVisible={isLanguageModalVisible} 
                setIsLanguageModalVisible={setIsLanguageModalVisible}
            />

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('settings')}</Text>
            </View>

            <View style={tw`bg-white h-full`}>

                {button('Настройки-Акаунт', 'person-outline', '#3b82f6', 'blue-300', t('account'))}
                {button('Настройки-Макронутриенти', 'flame-outline', '#d97706', 'orange-300', t('macronutrients'))}

                <View>
                    {button('Приятели', 'people-outline', '#22c55e', 'green-300', t('friends'))}
                    {friendRequestsNumber >= "1" && 
                        <View style={tw`w-6 h-6 bg-red-500 rounded-full absolute top-1 left-9 flex justify-center items-center`}>
                            <Text style={tw`text-white`}>{friendRequestsNumber}</Text>
                        </View>
                    }
                </View>


                {button('Настройки-Статистика', 'stats-chart-outline', '#eab308', 'yellow-300', t('stats'))}
                {button('Запазени-Тренировки', 'cloud-outline', '#ec4899', 'pink-300', t('saved-workouts'))}

                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => setIsLanguageModalVisible(true)}>
                    <View style={tw`flex flex-row justify-between`}>

                        <View style={tw`flex flex-row`}>
                            <View style={tw`w-10 h-10 bg-indigo-300 rounded-full flex items-center justify-center mr-2`}>
                                <Ionicons name='globe-outline' size={28} color='#8b5cf6' />
                            </View>
                            
                            <View style={tw`flex justify-center`}>
                                <Text style={tw`text-lg font-medium`}>{t('language')}</Text>
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