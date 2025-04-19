import { View, Text, Pressable, Vibration } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';

interface SettingsButtonProps {
    title: string;
    navigationPath: string;
    iconName: any;
    iconColor: string;
    backgroundColor: string;
    t: any;
    internetConnected: boolean;
    navigation: any;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({
    title,
    navigationPath,
    iconName,
    iconColor,
    backgroundColor,
    t,
    internetConnected,
    navigation
}) => {
    return (
        <Pressable
            style={tw`w-full h-14 bg-white p-3 mb-1`}
            onPress={() => {
                if (title === t('account') && !internetConnected) {
                    Vibration.vibrate();
                    return;
                }
                if (title === t('friends') && !internetConnected) {
                    Vibration.vibrate();
                    return;
                }
                navigation?.navigate(navigationPath);
            }}
        >
            <View style={tw`flex flex-row justify-between`}>
                <View style={tw`flex flex-row`}>
                    <View style={tw`w-10 h-10 bg-${backgroundColor} rounded-full flex items-center justify-center mr-2`}>
                        <Ionicons name={iconName} size={28} color={iconColor} />
                    </View>
                    <View style={tw`flex justify-center`}>
                        <Text style={tw`text-lg font-medium`}>{title}</Text>
                        {(
                            (title === t('friends') && !internetConnected) ||
                            (title === t('account') && !internetConnected)
                        ) && (
                            <Text style={tw`text-gray-500 mb-[8px]`}>
                                {t('stable-internet-required')}
                            </Text>
                        )}
                    </View>
                </View>
                <View style={tw`flex justify-center`}>
                    <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                </View>
            </View>
        </Pressable>
    );
};

export default SettingsButton;