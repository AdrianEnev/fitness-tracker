import { View, Text, Modal, Pressable } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import GlobalContext from '@config/GlobalContext';

interface SyncingInfoInformationModalProps {
    isSyncInfoExtraModalVisible: boolean;
    setIsSyncInfoExtraModalVisible: (isVisible: boolean) => void;
}

const SyncingInfoInformationModal: React.FC<SyncingInfoInformationModalProps> = ({ 
    isSyncInfoExtraModalVisible, 
    setIsSyncInfoExtraModalVisible
}) => {

    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext)
            
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isSyncInfoExtraModalVisible}
            onRequestClose={() => {
                setIsSyncInfoExtraModalVisible(!isSyncInfoExtraModalVisible);
            }}
            >
                <View style={tw`w-[85%] h-full justify-center items-center self-center`}>
                    <Pressable style={tw`bg-gray-50 w-full ${iphoneModel.includes('SE') ? "h-[32%]" : "h-[25%]"} rounded-2xl pt-3 px-2`}>
                        
                        <View style={tw`w-full flex flex-row justify-between`}>
                            
                            <Pressable onPress={() => {
                                setIsSyncInfoExtraModalVisible(false)
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