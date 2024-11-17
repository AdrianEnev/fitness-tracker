import { View, Text, Modal, Pressable, Keyboard, Dimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Swing } from 'react-native-animated-spinkit'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

interface SyncingInfoModalProps {
    isSyncingInfoModalVisible: boolean;
    setIsSyncingInfoModalVisible: (isVisible: boolean) => void;
    setIsSyncingInfoInformationModalVisible: (isVisible: boolean) => void;                 
}

const SyncingInfoModal: React.FC<SyncingInfoModalProps> = ({ 
    isSyncingInfoModalVisible, setIsSyncingInfoModalVisible, setIsSyncingInfoInformationModalVisible
}) => { 
    
    const screenWidth = Dimensions.get('screen').width;
    const thirtyPercentScreenWidth = screenWidth * 0.45;

    const {t} = useTranslation();
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isSyncingInfoModalVisible}
            onRequestClose={() => {
                setIsSyncingInfoModalVisible(!isSyncingInfoModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>

                    <View style={tw`bg-white w-[100%] h-[38%] rounded-[30px] pt-3 px-2`}>

                        <View style={tw`flex-1 justify-center items-center mt-6`}>
                            <Swing color={`#3d5875`} size={thirtyPercentScreenWidth} />
                        </View>
                            
                        <View style={tw`flex-1 justify-end items-center mb-3`}>
                            <Text style={tw`text-2xl font-bold text-[#3d5875]`}>{t('syncing-info')}</Text>
                            <Text style={tw`text-xl font-medium text-[#3d5875] mt-2`}>{t('few-seconds-alert')}</Text>
                        </View>
                    </View>

                    
                </View>
        </Modal>
    )
}

export default SyncingInfoModal;