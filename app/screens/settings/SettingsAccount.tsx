import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc'
import { SafeAreaView } from 'react-native-safe-area-context'
import GlobalContext from '@config/GlobalContext'
import ProfilePicture from '@app/components/settings/ProfilePicture'
import BottomNavigationBar from '@components/BottomNavigationBar'
import { useTranslation } from 'react-i18next'
import getEmail from '@use/settings/get/useGetEmail'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from 'expo-blur'
import syncInformation from '@use/settings/useSyncInfo'
import DeletingAccountModal from '@modals/loading/DeletingAccountModal'
import SyncInfoExtraModal from '@modals/settings/SyncInfoInformationModal'
import SyncInfoModal from '@modals/settings/SyncInfoModal'
import RetreiveInfoModal from '@app/modals/settings/RetreiveInfoModal'
import LoadingModal from '@app/modals/loading/LoadingModal'
import RetreiveInfoExtraModal from '@app/modals/settings/RetreiveInfoExtraModal'
import promptLogOut from '@app/components/prompts/promptLogOut'
import promptChangeUsername from '@app/components/prompts/promptChangeUsername'
import promptDeleteAccount from '@app/components/prompts/promptDeleteAccount'
import promptChangePassword from '@app/components/prompts/promptChangePassword'
import SettingsAccountButton from '@app/components/settings/SettingsAccountButton'
import retreiveInfo from '@app/use/settings/get/useRetreiveInfo'

const SettingsAccount = ({navigation}: any) => {

    const { 
        internetConnected,
        setProfilePicture, 
        setSetupRan, 
        setIsAccountDeleted, 
        syncingInfoRunning, 
        setSyncingInfoRunning
    } = useContext(GlobalContext);

    const [isSyncInfoModalVisible, setIsSyncInfoModalVisible] = useState(false);
    const [isSyncingInfoModalVisible, setIsSyncingInfoModalVisible] = useState(false);
    const [isSyncInfoExtraModalVisible, setIsSyncInfoExtraModalVisible] = useState(false);
    const [isDeletingAccountModalVisible, setIsDeletingAccountModalVisible] = useState(false);
    const [isRetreiveInfoModalVisible, setIsRetreiveInfoModalVisible] = useState(false);
    const [isRetreiveInfoExtraModalVisible, setIsRetreiveInfoExtraModalVisible] = useState(false);
    const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
    const [isRetreiveInfoRan, setIsRetreiveInfoRan] = useState(false);

    const {t} = useTranslation();

    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const getUsernameLocally = async () => {
        const email = await getEmail();

        const AsyncStorageUsername = await AsyncStorage.getItem(`username_${email}`);
        setUsername(AsyncStorageUsername);
    }

    const getIsRetreiveInfoRan = async () => {
        const isRetreiveInfoRan = await AsyncStorage.getItem('retreiveInfo');
        setIsRetreiveInfoRan(isRetreiveInfoRan === 'true');
    }

    const refreshRetreiveInfoRan = () => {
        getIsRetreiveInfoRan();
    }

    useEffect(()=> {
        getUsernameLocally();
        
        const fetch = async () => {
            const AsyncStorageEmail = await getEmail();
            setEmail(AsyncStorageEmail);
        }

        fetch();
        getIsRetreiveInfoRan();
    }, [])

    const syncInfo = async () => {
        
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
            }, 10);
        }
    };

    const retreiveInfoFunc = async () => {
        setIsRetreiveInfoModalVisible(false);
        setIsLoadingModalVisible(true);

        // Set timeout to prevent App freeze in case loading modal closes too early
        // 100+ ms should be safe, likely a react native issue that can't be prevented otherwise
        setTimeout(async () => {
            await retreiveInfo(refreshRetreiveInfoRan, internetConnected, t);
            setIsLoadingModalVisible(false);
        }, 120);
    }

    return (
        <>
            {(
                isSyncingInfoModalVisible || 
                isDeletingAccountModalVisible || 
                isSyncInfoExtraModalVisible || 
                isSyncInfoModalVisible ||
                isRetreiveInfoModalVisible ||
                isRetreiveInfoExtraModalVisible ||
                isLoadingModalVisible
            ) && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <SafeAreaView style={tw`w-full h-full bg-white`}>

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
                    setIsRetreiveInfoExtraModalVisible={setIsRetreiveInfoExtraModalVisible}
                    retreiveInfoFunc={retreiveInfoFunc}
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

                    {/* Buttons */}
                    <SettingsAccountButton
                        title={t('change-username')}
                        iconName='text-outline'
                        backgroundColor='yellow-300'
                        iconColor='#eab308'
                        iconSize={24}
                        action={() => promptChangeUsername(t, username, setIsLoadingModalVisible, setUsername, internetConnected)}
                        t={t}
                        internetConnected={internetConnected}
                        syncingInfoRunning={syncingInfoRunning}
                    />

                    <SettingsAccountButton
                        title={t('change-password')}
                        iconName='create-outline'
                        backgroundColor='green-300'
                        iconColor='#22c55e'
                        iconSize={26}
                        action={() => promptChangePassword(email, t, internetConnected)}
                        t={t}
                        internetConnected={internetConnected}
                        syncingInfoRunning={syncingInfoRunning}
                    />

                    <SettingsAccountButton
                        title={t('log-out')}
                        iconName='log-out-outline'
                        backgroundColor='blue-300'
                        iconColor='#3b82f6'
                        iconSize={28}
                        action={() => promptLogOut(t, internetConnected)}
                        t={t}
                        internetConnected={internetConnected}
                        syncingInfoRunning={syncingInfoRunning}
                    />

                    <SettingsAccountButton
                        title={t('delete-account')}
                        iconName='close-outline'
                        backgroundColor='red-300'
                        iconColor='#ef4444'
                        iconSize={34}
                        action={async () => {
                            promptDeleteAccount(t, setProfilePicture, setSetupRan, setIsAccountDeleted, internetConnected, setIsDeletingAccountModalVisible);
                            setIsAccountDeleted(true)
                        }}
                        t={t}
                        internetConnected={internetConnected}
                        syncingInfoRunning={syncingInfoRunning}
                    />

                    <SettingsAccountButton
                        title={t('sync-info')}
                        iconName='sync-outline'
                        backgroundColor='indigo-300'
                        iconColor='#4f46e5'
                        iconSize={34}
                        action={async () => {
                            if (syncingInfoRunning) return;
                            setIsSyncInfoModalVisible(true)
                        }}
                        t={t}
                        internetConnected={internetConnected}
                        syncingInfoRunning={syncingInfoRunning}
                    />
                    
                    {isRetreiveInfoRan ? null : (
                        <SettingsAccountButton
                            title={t('retreive-info')}
                            iconName='reload-outline'
                            backgroundColor='pink-300'
                            iconColor='#ec4899'
                            iconSize={34}
                            action={async () => {
                                if (syncingInfoRunning) return;
                                setIsRetreiveInfoModalVisible(true)
                            }}
                            t={t}
                            internetConnected={internetConnected}
                            syncingInfoRunning={syncingInfoRunning}
                    />
                    )}
                </View>

                <BottomNavigationBar currentPage='Settings' navigation={navigation}/>

            </SafeAreaView>
        </>
    )
}

export default SettingsAccount