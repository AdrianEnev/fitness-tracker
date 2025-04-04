import { View, Text, Pressable, Image, Vibration } from 'react-native'
import React, { useContext, useState } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalContext from '../../GlobalContext';
import BottomNavigationBar from '../components/BottomNavigationBar';
import LanguageModal from '../modals/LanguageModal';
import { BlurView } from 'expo-blur';
import RetreiveInfoModal from '../modals/RetreiveInfoModal';
import RetreivingInfoAnimationModal from '../modals/RetreivingInfoAnimationModal';
import RetreiveInfoInformationModal from '../modals/RetreiveInfoInformationModal';

const Settings = ({navigation}: any) => {

    const { friendRequestsNumber, internetSpeed } = useContext(GlobalContext);

    const { t } = useTranslation();

    /*const changeLanguage = async (language: string) => {
        try {
            await i18next.changeLanguage(language);
            setSelectedLanguage(language);

            await setDoc(doc(userInfoCollectionRef, 'language'), { language: language });
        } catch (err) {
            console.error(err);
        }
    }*/

    const {internetConnected} = useContext(GlobalContext);

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
    const [isRetreiveInfoModalVisible, setIsRetreiveInfoModalVisible] = useState(false);
    const [isRetreivingInfoAnimationModalVisible, setIsRetreivingInfoAnimationModalVisible] = useState(false);
    const [isRetreiveInfoInformationModalVisible, setIsRetreiveInfoInformationModalVisible] = useState(false);

    return (
        <View style={tw`h-full`}>
            
            { (isLanguageModalVisible || isRetreiveInfoModalVisible || isRetreivingInfoAnimationModalVisible|| isRetreiveInfoInformationModalVisible) && (
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

            <RetreiveInfoModal 
                isRetreiveInfoModalVisible={isRetreiveInfoModalVisible} 
                setIsRetreiveInfoModalVisible={setIsRetreiveInfoModalVisible}
                setIsRetreivingInfoAnimationModalVisible={setIsRetreivingInfoAnimationModalVisible}
                navigation={navigation}
                internetSpeed={internetSpeed}
                setIsRetreiveInfoInformationModalVisible={setIsRetreiveInfoInformationModalVisible}
            />

            <RetreivingInfoAnimationModal 
                isRetreivingInfoAnimationModalVisible={isRetreivingInfoAnimationModalVisible} 
                setIsRetreivingInfoAnimationModalVisible={setIsRetreivingInfoAnimationModalVisible}
                text={t('retreiving-info')}
            /> 

            <RetreiveInfoInformationModal
                isRetreiveInfoInformationModalVisible={isRetreiveInfoInformationModalVisible}
                setIsRetreiveInfoInformationModalVisible={setIsRetreiveInfoInformationModalVisible}
                setIsRetreiveInfoModalVisible={setIsRetreiveInfoModalVisible}
            />

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
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


                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => (
                    //retreiveInfo()
                    setIsRetreiveInfoModalVisible(true)
                )}>
                    <View style={tw`flex flex-row justify-between`}>

                        <View style={tw`flex flex-row`}>
                            <View style={tw`w-10 h-10 bg-pink-300 rounded-full flex items-center justify-center mr-2`}>
                                <Ionicons name='reload-outline' size={28} color='#ec4899' />
                            </View>
                            
                            <View style={tw`flex justify-center`}>
                                <Text style={tw`text-lg font-medium`}>{t('retreive-info')}</Text>
                            </View>
                        </View>

                        <View style={tw`flex justify-center`}>
                            <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                        </View>

                    </View>
                </Pressable>

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