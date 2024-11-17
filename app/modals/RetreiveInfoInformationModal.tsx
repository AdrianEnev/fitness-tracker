import { View, Text, Modal, Pressable, Keyboard, TextInput } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import retreiveInfo from '../use/useRetreiveInfo';
import { useTranslation } from 'react-i18next';

interface RetreiveInfoInformationModalProps {
    isRetreiveInfoInformationModalVisible: boolean;
    setIsRetreiveInfoInformationModalVisible: (isVisible: boolean) => void;
    setIsRetreiveInfoModalVisible: (isVisible: boolean) => void;
}

const RetreiveInfoInformationModal: React.FC<RetreiveInfoInformationModalProps> = ({ 
    isRetreiveInfoInformationModalVisible, 
    setIsRetreiveInfoInformationModalVisible, 
    setIsRetreiveInfoModalVisible
}) => {

    const {t} = useTranslation();
            
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isRetreiveInfoInformationModalVisible}
            onRequestClose={() => {
                setIsRetreiveInfoInformationModalVisible(!isRetreiveInfoInformationModalVisible);
            }}
            >
                <View style={tw`w-[85%] h-full justify-center items-center self-center`}>
                    <Pressable style={tw`bg-gray-50 w-full h-[25%] rounded-2xl pt-3 px-2`}>
                        
                        <View style={tw`w-full flex flex-row justify-between`}>
                            
                            <Pressable onPress={() => {
                                setIsRetreiveInfoModalVisible(true)
                                setIsRetreiveInfoInformationModalVisible(false)
                            }}>
                                <Ionicons name='return-down-back-outline' size={35} color='#3b82f6'/>
                                
                            </Pressable>
                            
                        </View>

                        <Text style={tw`text-xl font-medium text-center mt-3`}>{t('retreive-info-information')}</Text>
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default RetreiveInfoInformationModal