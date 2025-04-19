import { View, Text, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';

interface SettingsAccountButtonProps {
    title: string,
    iconName: any,
    backgroundColor: string,
    iconColor: any,
    iconSize: number,
    action: () => void,
    t: any,
    internetConnected: boolean,
    syncingInfoRunning: boolean
}

const SettingsAccountButton: React.FC<SettingsAccountButtonProps> = ({
    title, 
    iconName, 
    backgroundColor, 
    iconColor, 
    iconSize, 
    action,
    t,
    internetConnected,
    syncingInfoRunning
}) => {
    return (
        <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={action}>
            <View style={tw`flex flex-row justify-between`}>
                <View style={tw`flex flex-row`}>
                    <View style={tw`w-10 h-10 bg-${backgroundColor} rounded-full flex items-center justify-center mr-2`}>
                        <Ionicons name={iconName} size={iconSize} color={iconColor} />
                    </View>
                    <View style={tw`flex justify-center`}>
                        <Text style={tw`text-lg font-medium`}>{title}</Text>
                        {(
                (title === t('change-username') && !internetConnected) || 
                (title === t('change-password') && !internetConnected) || 
                (title === t('delete-account') && !internetConnected) || 
                (title === t('log-out') && !internetConnected)
            ) && (
                <Text style={tw`text-gray-500 mb-[8px]`}>{t('stable-internet-required')}</Text>
            )}
                    </View>
                </View>
                {(title !== t('sync-info') || !syncingInfoRunning) && (
                    <View style={tw`flex justify-center`}>
                        <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                    </View>
                )}

                {(title === t('sync-info') && syncingInfoRunning) && (
                    <View style={tw`flex justify-center`}>
                        <ActivityIndicator size="small" color="#6b7280"/>
                    </View>
                )}
            </View>
        </Pressable>
    );
}

export default SettingsAccountButton;