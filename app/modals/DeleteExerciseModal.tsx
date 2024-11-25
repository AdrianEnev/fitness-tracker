import { View, Text, Modal, Pressable, Keyboard } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';

interface DeleteExerciseModalProps {
    isDeleteExerciseModalVisible: boolean;
    setIsDeleteExerciseModalVisible: (isVisible: boolean) => void;
    deleteExercise: (exerciseId: string) => void;
    currentExerciseId: any
}

const DeleteExerciseModal: React.FC<DeleteExerciseModalProps> = ({ 
    isDeleteExerciseModalVisible, 
    setIsDeleteExerciseModalVisible, 
    deleteExercise,
    currentExerciseId
}) => { 
    
    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isDeleteExerciseModalVisible}
            onRequestClose={() => {
                setIsDeleteExerciseModalVisible(!isDeleteExerciseModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full ${iphoneModel.includes('SE') ? "h-[37%]" : "h-[26%]"} rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium mt-1`}>{t('delete-exercise-alert')}</Text>
                        <Text style={tw`text-lg text-center text-gray-500 font-medium my-2`}>{t('perm-delete-on-save')}</Text>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-[#e83d50] w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => {
                                
                                deleteExercise(currentExerciseId);
                                setIsDeleteExerciseModalVisible(false)
                            }}>
                                <Text style={tw`text-white text-lg font-medium`}>{t('delete')}</Text>
                            </Pressable>
                        </View>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-gray-200 w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsDeleteExerciseModalVisible(false)}>
                                <Text style={tw`text-black text-lg font-medium`}>{t('back')}</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default DeleteExerciseModal;