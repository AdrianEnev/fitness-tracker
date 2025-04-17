import { View, Text, Modal, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { useContext } from 'react';
import GlobalContext from '@config/GlobalContext';

interface SyncInfoModalProps {
    isSyncInfoModalVisible: boolean;
    setIsSyncInfoModalVisible: (isVisible: boolean) => void;
    setIsSyncInfoExtraModalVisible: (isVisible: boolean) => void;
    syncInfo: () => void;
}

const SyncInfoModal: React.FC<SyncInfoModalProps> = ({ 
    isSyncInfoModalVisible, 
    setIsSyncInfoModalVisible, 
    setIsSyncInfoExtraModalVisible,
    syncInfo
}) => {

    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext)
            
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isSyncInfoModalVisible}
            onRequestClose={() => {
                setIsSyncInfoModalVisible(!isSyncInfoModalVisible);
            }}
            >
                <View style={tw`w-[85%] h-full justify-center items-center self-center`}>
                    <Pressable style={tw`bg-gray-50 w-full ${iphoneModel.includes('SE') ? "h-[32%]" : "h-[25%]"} rounded-2xl pt-3 px-2`}>
                        
                        <View style={tw`w-full flex flex-row justify-between`}>
                            
                            <Pressable onPress={() => {
                                setIsSyncInfoExtraModalVisible(true)
                            }}>
                                <Ionicons name='help' size={35} color='#3b82f6'/>
                            </Pressable>
                            
                            <Pressable onPress={() => {
                                setIsSyncInfoModalVisible(false)
                            }}>
                                <Ionicons name='close' size={42} color='#ef4444'/>
                            </Pressable>
                            
                        </View>

                        <Text style={tw`text-xl font-medium text-center mt-4`}>{t('back-up-info-modal')}</Text>

                        <View style={tw`flex items-center mt-4`}>
                            <Pressable style={tw`bg-green-500 w-full h-16 rounded-xl flex items-center justify-center`}
                                onPress={() => {
                                    syncInfo();
                                }}
                            >
                                <Text style={tw`text-white text-2xl font-medium`}>{t('back-up')}</Text>
                            </Pressable>
                        </View> 

                    </Pressable>
                </View>
        </Modal>
    )
}

export default SyncInfoModal