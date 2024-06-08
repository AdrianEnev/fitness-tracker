import { View, Text, Button, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { Switch } from 'react-native';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomTabBar from '../components/CustomTabBar';
import exportSavedWorkouts from '../use/useExportSavedWorkouts';
import getFriendRequests from '../use/useGetFriendRequestsRecieved';

const Settings = ({navigation, route}: any) => {

    const {friendRequestsNumber} = route.params;

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
    
            return () => {
                // Optional: You can do something when the screen is unfocused
                // This function runs when the screen goes out of focus
            };
        }, [])
    );
    
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <SafeAreaView style={tw`h-full`}>

            <View style={tw``}>

                <Text style={tw`text-2xl font-medium mb-4 text-center`}>Настройки</Text>

                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => navigation.navigate('Настройки-Акаунт', {friendRequestsNumber: friendRequestsNumber})}>
                    <View>
                        <Text style={tw`text-lg font-medium`}>{t('account')}</Text>
                        {friendRequestsNumber >= "1" && 
                            <View style={tw`w-6 h-6 bg-red-500 rounded-full absolute top-[-12px] left-17 flex justify-center items-center`}>
                                <Text style={tw`text-white`}>{friendRequestsNumber}</Text>
                            </View>
                        }
                    </View>
                </Pressable>

                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => navigation.navigate('Настройки-Макронутриенти')}>
                    <Text style={tw`text-lg font-medium`}>{t('macronutrients')}</Text>
                </Pressable>

                <View style={tw`flex flex-row justify-center mt-10`}>

                    <TouchableOpacity 
                        style={selectedLanguage === 'en' ? tw`px-3 py-2 bg-blue-500 w-14` : tw`px-3 py-2 bg-gray-300 w-14`} 
                        onPress={() => changeLanguage('en')}
                    >
                        <Text style={tw`text-white text-lg`}>EN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={selectedLanguage === 'bg' ? tw`px-3 py-2 bg-blue-500 w-14` : tw`px-3 py-2 bg-gray-300 w-14`} 
                        onPress={() => changeLanguage('bg')}
                    >   
                        <Text style={tw`text-white text-lg`}>BG</Text>
                    </TouchableOpacity>

                </View>

                <View style={tw`flex flex-row justify-between mx-32 mt-5`}>

                    <Text>FACEID todo!</Text>

                    <Switch
                        trackColor={{true: '#ffffff'}}
                        ios_backgroundColor="#3e3e3e"
                        thumbColor={isEnabled ? '#50C878' : '#FF5733'}
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />

                </View>

                <Button title='export saved workouts' onPress={exportSavedWorkouts}/>

            </View>

            <CustomTabBar 
                navigation={navigation} 
                currentPage="Настройки-Страница"
            />

        </SafeAreaView>
    )
}

export default Settings