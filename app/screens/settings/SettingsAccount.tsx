import { View, Text, Pressable, Alert, Switch, Vibration, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FIREBASE_AUTH } from '@config/firebaseConfig'
import tw from 'twrnc'
import { getAuth } from 'firebase/auth'
import changePassword from '@use/settings/change/useChangePassword'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalContext from '@config/GlobalContext'
import ProfilePicture from '@app/components/settings/ProfilePicture'
import BottomNavigationBar from '@components/BottomNavigationBar'
import { useTranslation } from 'react-i18next'
import getEmail from '@use/settings/get/useGetEmail'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from 'expo-blur'
import syncInformation from '@use/settings/useSyncInfo'
import DeletingAccountModal from '@modals/loading/DeletingAccountModal'
import ChangingUsernameModal from '@modals/loading/ChangingUsernameModal'
import SyncInfoExtraModal from '@modals/settings/SyncInfoInformationModal'
import SyncInfoModal from '@modals/settings/SyncInfoModal'
import reauthenticateAndDelete from '@use/settings/remove/useDeleteAccount'
import changeUsername from '@app/use/settings/change/useChangeUsername'
import RetreiveInfoModal from '@app/modals/settings/RetreiveInfoModal'
import LoadingModal from '@app/modals/loading/LoadingModal'
import RetreiveInfoExtraModal from '@app/modals/settings/RetreiveInfoExtraModal'

const SettingsAccount = ({navigation}: any) => {

    const { 
        internetConnected,
        setProfilePicture, 
        setSetupRan, 
        setIsAccountDeleted, 
        syncingInfoRunning, 
        setSyncingInfoRunning,
        internetSpeed
    } = useContext(GlobalContext);

    const [changingUsernameRunning, setChangingUsernameRunning] = useState(false);
    const [isSyncInfoModalVisible, setIsSyncInfoModalVisible] = useState(false);
    const [isSyncingInfoModalVisible, setIsSyncingInfoModalVisible] = useState(false);
    const [isSyncInfoExtraModalVisible, setIsSyncInfoExtraModalVisible] = useState(false);
    const [isDeletingAccountModalVisible, setIsDeletingAccountModalVisible] = useState(false);
    const [isRetreiveInfoModalVisible, setIsRetreiveInfoModalVisible] = useState(false);
    const [isRetreivingInfoAnimationModalVisible, setIsRetreivingInfoAnimationModalVisible] = useState(false);
    const [isRetreiveInfoExtraModalVisible, setIsRetreiveInfoExtraModalVisible] = useState(false);
    const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);

    const logOut = () => {

        // add confirmation alert before logging out
        Alert.alert(
            t('account-logout'),
            t('account-logout-prompt'),
            [
                {
                    text: t(('cancel')),
                    style: 'cancel',
                },
                {
                    text: t('next'),
                    style: 'destructive',
                    onPress: () => {
                        FIREBASE_AUTH.signOut();
                    },
                },
            ],
        );

    }

    const changeUsernamePrompt = async () => {

        Alert.prompt(
            t('change-username'),
            t('change-username-prompt'),
            [
                {
                    text: t('cancel'),
                    style: 'destructive',
                },
                {
                    text: t('change-short'),
                    style: 'default',
                    onPress: async (newUsername: string | undefined) => {

                        if (!internetConnected) {
                            alert(t('unstable-connection'))
                            return
                        };
                        if (!username){
                            alert(t('error'))
                            return
                        };

                        const trimmedUsername = newUsername?.trim();
                        await changeUsername(username, String(trimmedUsername), setChangingUsernameRunning, t, setUsername); 
                    },
                },
            ],
            'plain-text',
        );
    }

    const button = (title: any, icon: any, background: string, iconColor: any, iconSize: number, action: any) => {
        return (
            <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={action}>
                <View style={tw`flex flex-row justify-between`}>

                    <View style={tw`flex flex-row`}>
                        <View style={tw`w-10 h-10 bg-${background} rounded-full flex items-center justify-center mr-2`}>
                            <Ionicons name={icon} size={iconSize} color={iconColor} />
                        </View>
                        
                        <View style={tw`flex justify-center`}>
                            <Text style={tw`text-lg font-medium`}>{title}</Text>
                            {(
                                title === t('change-username') && !internetConnected || 
                                title === t('change-password') && !internetConnected || 
                                title === t('delete-account') && !internetConnected || 
                                title === t(`log-out`) && !internetConnected
                            ) && (
                                <Text style={tw`text-gray-500 mb-[8px]`}>{t('stable-internet-required')}</Text>
                            )}
                        </View>
                    </View>
                    
                    {(title != t(`sync-info`) || !syncingInfoRunning) && (
                        <View style={tw`flex justify-center`}>
                            <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                        </View>
                    )}

                    {(title == t(`sync-info`) && syncingInfoRunning) && (
                        <View style={tw`flex justify-center`}>
                            <ActivityIndicator size="small" color="#6b7280"/>
                        </View>
                    )}
                    

                </View>
            </Pressable>
        )
    }

    const {t} = useTranslation();

    //{switchButton('2FA', 'lock-closed-outline', 'green-300', '#22c55e', 24)}

    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null)

    const getUsernameLocally = async () => {
        const email = await getEmail();

        const AsyncStorageUsername = await AsyncStorage.getItem(`username_${email}`);
        setUsername(AsyncStorageUsername);
    }

    useEffect(()=> {
        getUsernameLocally();
        
        const fetch = async () => {
            const AsyncStorageEmail = await getEmail();
            setEmail(AsyncStorageEmail)
        }

        fetch();

    }, [])

    const syncInfo = async () => {
        if (syncingInfoRunning) return;
    
        setSyncingInfoRunning(true);
        setIsSyncingInfoModalVisible(true);
    
        try {
            await syncInformation();
        } catch (error) {
            console.error("Sync information failed", error);
        } finally {
            setIsSyncingInfoModalVisible(false);
            setTimeout(() => {
                setIsSyncInfoModalVisible(false);
                setSyncingInfoRunning(false);
            }, 10); // 100 milliseconds delay
        }
    };

    const deleteAccountPrompt = async () => {
        // Prompt the user to enter their password for account deletion
        Alert.prompt(
            'Изтриване на акаунт',
            'Въведи паролата за този акаунт, за да го изтриеш',
            [
                {
                    text: t('cancel'),
                    style: 'cancel',
                },
                {
                    text: t('delete'),
                    style: 'destructive',
                    onPress: async (password: string | undefined) => {

                        const isVerified = true;
                        setIsDeletingAccountModalVisible(true)
                        await reauthenticateAndDelete(setProfilePicture, setSetupRan, setIsAccountDeleted, isVerified, password);                    
                        setIsAccountDeleted(true)
                    },
                },
            ],
            'secure-text'
        );
    }

    return (
        <>

            {(
                isSyncingInfoModalVisible || 
                isDeletingAccountModalVisible || 
                changingUsernameRunning || 
                isSyncInfoExtraModalVisible || 
                isSyncInfoModalVisible ||
                isRetreiveInfoModalVisible ||
                isRetreivingInfoAnimationModalVisible ||
                isRetreiveInfoExtraModalVisible
            ) && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <SafeAreaView style={tw`w-full h-full bg-white`}>

                <ChangingUsernameModal
                    isChangingUsernameModalVisible={changingUsernameRunning}
                    setIsChangingUsernameModalVisible={setChangingUsernameRunning}
                />

                <DeletingAccountModal
                    isDeletingAccountModalVisible={isDeletingAccountModalVisible}
                    setIsDeletingAccountModalVisible={setIsDeletingAccountModalVisible}
                />

                <SyncInfoModal
                    isSyncInfoModalVisible={isSyncInfoModalVisible}
                    setIsSyncInfoModalVisible={setIsSyncInfoModalVisible}
                    setIsSyncInfoExtraModalVisible={setIsSyncInfoExtraModalVisible}
                    syncInfo={syncInfo}
                />

                <SyncInfoExtraModal
                    isSyncInfoExtraModalVisible={isSyncInfoExtraModalVisible}
                    setIsSyncInfoExtraModalVisible={setIsSyncInfoExtraModalVisible}
                />

                <RetreiveInfoModal
                    isRetreiveInfoModalVisible={isRetreiveInfoModalVisible}
                    setIsRetreiveInfoModalVisible={setIsRetreiveInfoModalVisible}
                    setIsLoadingModalVisible={setIsLoadingModalVisible}
                    internetSpeed={internetSpeed}
                    setIsRetreiveInfoExtraModalVisible={setIsRetreiveInfoExtraModalVisible}
                />

                <RetreiveInfoExtraModal
                    isRetreiveInfoExtraModalVisible={isRetreiveInfoExtraModalVisible}
                    setIsRetreiveInfoExtraModalVisible={setIsRetreiveInfoExtraModalVisible}
                    setIsRetreiveInfoModalVisible={setIsRetreiveInfoModalVisible}
                />

                <LoadingModal
                    isLoadingModalVisible={isLoadingModalVisible}
                    setIsLoadingModalVisible={setIsLoadingModalVisible}
                />

                <View style={tw`h-full pt-2`}>

                    {/* Profile Picture + Username + Email */}
                    <View style={tw`w-full flex flex-row mb-3`}>

                        <ProfilePicture page='SettingsAccount'/>

                        <View style={tw`flex flex-col justify-center ml-2`}>

                            <Text style={tw`text-xl font-medium`}>{username}</Text>
                            <Text style={tw`text-base text-gray-500`}>{email}</Text>

                        </View>

                    </View>

                    {/* Seperator */}
                    <View style={tw`h-[2px] w-[94%] bg-gray-300 rounded-full mx-2`}></View>

                    {/* Icons */}
                    {button(t('change-username'), 'text-outline', 'yellow-300', '#eab308', 24, () => {
                        if (internetConnected) {
                            changeUsernamePrompt()
                        }else{
                            Vibration.vibrate()
                        }
                    })}



                    {button(t('change-password'), 'create-outline', 'green-300', '#22c55e', 26, () => {
                        
                        if (internetConnected) {
                            const auth = getAuth();
                            const user = auth.currentUser;
                            changePassword(email, user, auth, t)
                        }else{
                            Vibration.vibrate()
                        }
                        
                    })}
                    {button(t('log-out'), 'log-out-outline', 'blue-300', '#3b82f6', 28, () => {
                        if (internetConnected) {
                            logOut()
                        }else{
                            Vibration.vibrate()
                        }
                    })}
                    {button(t('delete-account'), 'close-outline', 'red-300', '#ef4444', 34, async () => {

                        if (internetConnected && internetSpeed > 32) {
                            deleteAccountPrompt();
                        }else{
                            alert(t('unstable-connection'))
                            Vibration.vibrate()
                        }
                        
                    })}
                    {button(t('sync-info'), 'sync-outline', 'indigo-300', '#4f46e5', 34, async () => {

                        setIsSyncInfoModalVisible(true)
                        
                    })}
                    
                    {button(t('retreive-info'), 'reload-outline', 'pink-300', '#ec4899', 34, async () => {

                        setIsRetreiveInfoModalVisible(true)
                        
                    })}

                </View>

                <BottomNavigationBar currentPage='Settings' navigation={navigation}/>

            </SafeAreaView>
        </>
    )
}

export default SettingsAccount