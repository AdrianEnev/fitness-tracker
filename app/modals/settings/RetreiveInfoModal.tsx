import { View, Text, Modal, Pressable } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import retreiveInfo from '@use/settings/get/useRetreiveInfo';
import { useTranslation } from 'react-i18next';
import GlobalContext from '@config/GlobalContext';

interface RetreiveInfoModalProps {
    isRetreiveInfoModalVisible: boolean;
    setIsRetreiveInfoModalVisible: (isVisible: boolean) => void;
    setIsRetreiveInfoExtraModalVisible: (isVisible: boolean) => void;
    retreiveInfoFunc: () => void;
}

const RetreiveInfoModal: React.FC<RetreiveInfoModalProps> = ({
    isRetreiveInfoModalVisible, 
    setIsRetreiveInfoModalVisible, 
    setIsRetreiveInfoExtraModalVisible,
    retreiveInfoFunc
}) => {

    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext)
            
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isRetreiveInfoModalVisible}
            onRequestClose={() => {
                setIsRetreiveInfoModalVisible(!isRetreiveInfoModalVisible);
            }}
            >
                <View style={tw`w-[85%] h-full justify-center items-center self-center`}>
                    <Pressable style={tw`bg-gray-50 w-full ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? 'h-[25%]' : iphoneModel.includes('SE') ? 'h-[35%]' : 'h-[27%]'} rounded-2xl pt-3 px-2`}>
                        
                        <View style={tw`w-full flex flex-row justify-between`}>
                            <Pressable onPress={() => {
                                setIsRetreiveInfoModalVisible(false)
                                setIsRetreiveInfoExtraModalVisible(true)
                            }}>
                                <Ionicons name='help-outline' size={35} color='#3b82f6'/>
                                
                            </Pressable>
                            <Pressable onPress={() => setIsRetreiveInfoModalVisible(false)}>
                                <Ionicons name='close' size={35} color='red'/>
                            </Pressable>
                        </View>

                        <Text style={tw`text-xl font-medium text-center mt-4`}>{t('retreive-info-modal')}</Text>

                        <View style={tw`w-full h-full flex justify-center flex-row gap-x-3 mt-4`}>
                            <Pressable style={tw`bg-green-500 w-full h-16 rounded-xl flex items-center justify-center`}
                                onPress={() => {
                                    retreiveInfoFunc();
                                }}
                            >
                                <Text style={tw`text-white font-medium text-xl text-center mx-2`}>{t('retreive-info')}</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                </View>
        </Modal>
    )
}

export default RetreiveInfoModal