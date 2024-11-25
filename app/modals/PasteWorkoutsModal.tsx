import { View, Text, Modal, Pressable, Keyboard } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';

interface PasteWorkoutsModalProps {
    isPasteWorkoutsModalVisible: boolean;
    setIsPasteWorkoutsModalVisible: (isVisible: boolean) => void;
    pasteCutWorkouts: () => void;
    pasteCopiedWorkouts: () => void;
}

const PasteWorkoutsModal: React.FC<PasteWorkoutsModalProps> = ({ 
    isPasteWorkoutsModalVisible, setIsPasteWorkoutsModalVisible, pasteCutWorkouts, pasteCopiedWorkouts
}) => { 
    
    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isPasteWorkoutsModalVisible}
            onRequestClose={() => {
                setIsPasteWorkoutsModalVisible(!isPasteWorkoutsModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full ${iphoneModel.includes("SE") ? "h-[41.5%]" : iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "h-[33%]" : "h-[31%]"} rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium mt-1`}>{t('paste-workouts')}</Text>
                        <Text style={tw`text-lg text-center text-gray-500 font-medium mb-1`}>{t('choose-option')}</Text>

                        <View style={tw`w-full h-[50%] flex justify-center flex-row gap-x-3 mt-1`}>
                            <Pressable style={tw`w-[48%] h-[100%] rounded-[20px] bg-cyan-500 flex flex-col items-center justify-center`}
                                onPress={async () => {
                                   pasteCutWorkouts()
                                   setIsPasteWorkoutsModalVisible(false)
                                }}
                            >
                                <Ionicons name='cut-outline' size={32} color='white'/>
                                <Text style={tw`text-white font-medium ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "text-lg" : "text-base"} mt-2`}>{t('paste-cut-workouts')}</Text>
                                <Text style={tw`text-white font-medium ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "text-lg" : "text-base"} mt-[-5px]`}>{t('workouts')}</Text>
                            </Pressable>
                            
                            <Pressable style={tw`w-[48%] h-[100%] rounded-[20px] bg-yellow-400 flex-col items-center justify-center`}
                                onPress={() => {
                                    pasteCopiedWorkouts()
                                    setIsPasteWorkoutsModalVisible(false)
                                }}
                            >
                                <Ionicons name='copy-outline' size={32} color='white'/>
                                <Text style={tw`text-white font-medium ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "text-lg" : "text-base"} mt-2`}>{t('paste-copied-workouts')}</Text>
                                <Text style={tw`text-white font-medium ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "text-lg" : "text-base"} mt-[-5px]`}>{t('workouts')}</Text>
                            </Pressable>
                        </View>

                        <View style={tw`flex items-center mt-4`}>
                            <Pressable style={tw`bg-gray-200 w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsPasteWorkoutsModalVisible(false)}>
                                <Text style={tw`text-black text-lg font-medium`}>{t('back')}</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default PasteWorkoutsModal;