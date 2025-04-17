import { View, Text, Modal, Pressable, Keyboard } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import GlobalContext from '@config/GlobalContext';

interface DeleteSavedWorkoutModalProps {
    isDeleteSavedWorkoutModalVisible: boolean;
    setIsDeleteSavedWorkoutModalVisible: (isVisible: boolean) => void;
    deleteSavedWorkout: () => void;
}

const DeleteSavedWorkoutModal: React.FC<DeleteSavedWorkoutModalProps> = ({ 
    isDeleteSavedWorkoutModalVisible, setIsDeleteSavedWorkoutModalVisible, deleteSavedWorkout
}) => { 

    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isDeleteSavedWorkoutModalVisible}
            onRequestClose={() => {
                setIsDeleteSavedWorkoutModalVisible(!isDeleteSavedWorkoutModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full ${iphoneModel.includes('SE') ? "h-[31%]" : "h-[24%]"} rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium mt-1`}>{t('workout-deletion')}</Text>
                        <Text style={tw`text-lg text-center text-gray-500 font-medium `}>{t('delete-workout-alert')}</Text>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-[#e83d50] w-full h-10 rounded-xl flex items-center justify-center`} 
                            onPress={() => {
                                deleteSavedWorkout();
                                setIsDeleteSavedWorkoutModalVisible(false);
                            }}>
                                <Text style={tw`text-white text-lg font-medium`}>{t('delete')}</Text>
                            </Pressable>
                        </View>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-gray-200 w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsDeleteSavedWorkoutModalVisible(false)}>
                                <Text style={tw`text-black text-lg font-medium`}>{t('cancel')}</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default DeleteSavedWorkoutModal;