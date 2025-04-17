import { View, Text, Pressable, Vibration } from 'react-native'
import React, { useContext, useState } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalContext from '@config/GlobalContext';
import BottomNavigationBar from '@components/BottomNavigationBar';
import LanguageModal from '@modals/language/LanguageModal';
import { BlurView } from 'expo-blur';
import SwitchButton from '@app/components/settings/SwitchButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Settings = ({navigation}: any) => {
    
    const { 
        faceIdEnabled, 
        setFaceIdEnabled, 
        receiveFriendRequests, 
        setReceiveFriendRequests, 
        friendRequestsNumber, 
        internetConnected 
    } = useContext(GlobalContext);

    const {t} = useTranslation();

    const [isFaceIdEnabled, setIsFaceIdEnabled] = useState(faceIdEnabled);
    const toggleFaceIdSwitch = async () => {

        setIsFaceIdEnabled(previousState => !previousState)
        setFaceIdEnabled(!isFaceIdEnabled);

        AsyncStorage.setItem(`faceIdEnabled`, String(!isFaceIdEnabled))
        
    };

    const [isReceiveFriendRequestsEnabled, setIsReceiveFriendRequestsEnabled] = useState(receiveFriendRequests);
    const toggleReceiveFriendRequestsSwitch = async () => {

        setIsReceiveFriendRequestsEnabled(previousState => !previousState)
        setReceiveFriendRequests(!isReceiveFriendRequestsEnabled);
        
        AsyncStorage.setItem(`receiveFriendRequests`, String(!isReceiveFriendRequestsEnabled))

    };

    const button = (navigationPath: string, icon: any, iconColor: any, background: string, title: string) => {

        return (
            <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => {

                if (title === t('account') && !internetConnected) {
                    Vibration.vibrate();
                    return;
                }
                if (title === t('friends') && !internetConnected) {
                    Vibration.vibrate();
                    return;
                }

                navigation.navigate(navigationPath)
            }}>
                <View style={tw`flex flex-row justify-between`}>

                    <View style={tw`flex flex-row`}>
                        <View style={tw`w-10 h-10 bg-${background} rounded-full flex items-center justify-center mr-2`}>
                            <Ionicons name={icon} size={28} color={iconColor} />
                        </View>
                        
                        <View style={tw`flex justify-center`}>
                            <Text style={tw`text-lg font-medium`}>{title}</Text>
                            {(
                                title === t('friends') && !internetConnected || 
                                title === t('account') && !internetConnected
                            ) && (
                                <Text style={tw`text-gray-500 mb-[8px]`}>{t('stable-internet-required')}</Text>
                            )}
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
            
            { (isLanguageModalVisible) && (
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

            <View style={tw`bg-gray-100 w-full h-[15%] flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('settings')}</Text>
            </View>

            <View style={tw`bg-white h-full`}>

                {button('Настройки-Акаунт', 'person-outline', '#3b82f6', 'blue-300', t('account'))}

                <View style={tw`flex flex-row`}>
                    {button('Настройки-Статистика', 'stats-chart-outline', '#eab308', 'yellow-300', t('stats'))}
                </View>

                 <View>
                    {button('Приятели', 'people-outline', '#22c55e', 'green-300', t('friends'))}
                    {friendRequestsNumber >= "1" && 
                        <View style={tw`w-6 h-6 bg-red-500 rounded-full absolute top-1 left-9 flex justify-center items-center`}>
                            <Text style={tw`text-white`}>{friendRequestsNumber}</Text>
                        </View>
                    }
                </View>
                
                {button('Настройки-Макронутриенти', 'flame-outline', '#d97706', 'orange-300', t('macronutrients'))}
                {button('Запазени-Тренировки', 'cloud-outline', '#ef4444', 'red-300', t('saved-workouts'))}

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

                {SwitchButton(t('face-id'), 'eye-outline', 'orange-300', '#d97706', 30, isFaceIdEnabled, isReceiveFriendRequestsEnabled, toggleFaceIdSwitch, toggleReceiveFriendRequestsSwitch, t)}
                {SwitchButton(t('receive-friend-requests'), 'notifications-outline', 'purple-300', '#8b5cf6', 24, isFaceIdEnabled, isReceiveFriendRequestsEnabled, toggleFaceIdSwitch, toggleReceiveFriendRequestsSwitch, t)}
                                    
            </View>

            <BottomNavigationBar currentPage='Settings' navigation={navigation}/>

        </View>
    )
}

export default Settings