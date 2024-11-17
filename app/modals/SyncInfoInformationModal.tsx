import { View, Text, Modal, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

interface SyncingInfoInformationModalProps {
    isSyncingInfoInformationModalVisible: boolean;
    setIsSyncingInfoInformationModalVisible: (isVisible: boolean) => void;
    setIsSyncInfoModalVisible: (isVisible: boolean) => void;
}

const SyncingInfoInformationModal: React.FC<SyncingInfoInformationModalProps> = ({ 
    isSyncingInfoInformationModalVisible, 
    setIsSyncingInfoInformationModalVisible, 
    setIsSyncInfoModalVisible
}) => {

    const {t} = useTranslation();
            
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isSyncingInfoInformationModalVisible}
            onRequestClose={() => {
                setIsSyncingInfoInformationModalVisible(!isSyncingInfoInformationModalVisible);
            }}
            >
                <View style={tw`w-[85%] h-full justify-center items-center self-center`}>
                    <Pressable style={tw`bg-gray-50 w-full h-[25%] rounded-2xl pt-3 px-2`}>
                        
                        <View style={tw`w-full flex flex-row justify-between`}>
                            
                            <Pressable onPress={() => {
                                setIsSyncingInfoInformationModalVisible(false)
                            }}>
                                <Ionicons name='return-down-back-outline' size={35} color='#3b82f6'/>
                            </Pressable>
                            
                        </View>

                        <Text style={tw`text-xl font-medium text-center mt-3`}>{t('back-up-extra-info')}</Text>
                    </Pressable>
                </View>
        </Modal>
    )
}

export default SyncingInfoInformationModal