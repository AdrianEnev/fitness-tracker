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
import SettingsButton from "@components/settings/SettingsButton"

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

            <View style={tw`bg-gray-100 w-full h-[16%] flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('settings')}</Text>
            </View>

            <View style={tw`bg-white h-full`}>

                <SettingsButton
                    title={t('account')} 
                    iconName='person-outline' 
                    iconColor='#3b82f6' 
                    backgroundColor='blue-300' 
                    navigationPath='Settings-Account' 
                    t={t}
                    internetConnected={internetConnected}
                    navigation={navigation}
                />

                <View style={tw`flex flex-row`}>
                    <SettingsButton 
                        title={t('stats')} 
                        iconName='stats-chart-outline' 
                        iconColor='#eab308' 
                        backgroundColor='yellow-300' 
                        navigationPath='Settings-Statistics' 
                        t={t}
                        internetConnected={internetConnected}
                        navigation={navigation}
                    />
                </View>

                 <View>
                    <SettingsButton 
                        title={t('friends')} 
                        iconName='people-outline' 
                        iconColor='#22c55e' 
                        backgroundColor='green-300' 
                        navigationPath='Friends'
                        t={t}
                        internetConnected={internetConnected}
                        navigation={navigation}
                    />
                    
                    {friendRequestsNumber >= "1" && 
                        <View style={tw`w-6 h-6 bg-red-500 rounded-full absolute top-1 left-9 flex justify-center items-center`}>
                            <Text style={tw`text-white`}>{friendRequestsNumber}</Text>
                        </View>
                    }
                </View>
                
                <SettingsButton 
                    title={t('macronutrients')} 
                    iconName='flame-outline' 
                    iconColor='#d97706' 
                    backgroundColor='orange-300' 
                    navigationPath='Settings-Macros' 
                    t={t}
                    internetConnected={internetConnected}
                    navigation={navigation}
                />
                
                <SettingsButton 
                    title={t('saved-workouts')} 
                    iconName='cloud-outline' 
                    iconColor='#ef4444' 
                    backgroundColor='red-300' 
                    navigationPath='Saved-Workouts' 
                    t={t}
                    internetConnected={internetConnected}
                    navigation={navigation}
                />
                
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

                <SwitchButton 
                    title={t('face-id')} 
                    iconName='eye-outline' 
                    backgroundColor='orange-300' 
                    iconColor='#d97706' 
                    iconSize={30} 
                    isFaceIdEnabled={isFaceIdEnabled} 
                    isReceiveFriendRequestsEnabled={isReceiveFriendRequestsEnabled} 
                    toggleFaceIdSwitch={toggleFaceIdSwitch} 
                    toggleReceiveFriendRequestsSwitch={toggleReceiveFriendRequestsSwitch} 
                    t={t}
                />
                <SwitchButton 
                    title={t('receive-friend-requests')} 
                    iconName='notifications-outline' 
                    backgroundColor='purple-300' 
                    iconColor='#8b5cf6' 
                    iconSize={24} 
                    isFaceIdEnabled={isFaceIdEnabled} 
                    isReceiveFriendRequestsEnabled={isReceiveFriendRequestsEnabled} 
                    toggleFaceIdSwitch={toggleFaceIdSwitch} 
                    toggleReceiveFriendRequestsSwitch={toggleReceiveFriendRequestsSwitch} 
                    t={t}
                />
            </View>

            <BottomNavigationBar currentPage='Settings' navigation={navigation}/>

        </View>
    )
}

export default Settings