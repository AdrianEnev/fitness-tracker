import { View, Text, Modal, Pressable, Keyboard, Dimensions } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import { Swing } from 'react-native-animated-spinkit'
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';

interface GeneratingWorkoutAnimationModalProps {
    isGeneratingWorkoutAnimationModalVisible: boolean;
    setIsGeneratingWorkoutAnimationModalVisible: (isVisible: boolean) => void;
    generatingWorkoutInFolder: any;
}

const GeneratingWorkoutAnimationModal: React.FC<GeneratingWorkoutAnimationModalProps> = ({ 
    isGeneratingWorkoutAnimationModalVisible, 
    setIsGeneratingWorkoutAnimationModalVisible,
    generatingWorkoutInFolder
}) => { 
    
    const screenWidth = Dimensions.get('screen').width;
    const thirtyPercentScreenWidth = screenWidth * 0.45;

    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isGeneratingWorkoutAnimationModalVisible}
            onRequestClose={() => {
                setIsGeneratingWorkoutAnimationModalVisible(!isGeneratingWorkoutAnimationModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-[96%] ${iphoneModel.includes('SE') ? "h-[48%]" : "h-[42%]"} rounded-[30px] pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <View style={tw`flex-1 justify-center items-center mt-9`}>
                            <Swing color={`#3d5875`} size={thirtyPercentScreenWidth} />
                        </View>
                            
                        <View style={tw`flex-1 justify-end items-center mb-5`}>
                            <Text style={tw`text-2xl font-bold text-[#3d5875] ${iphoneModel.includes('SE') ? "hidden" : ""}`}>{t('generating-workout')}</Text>
                            <Text style={tw`text-2xl font-bold text-[#3d5875] ${iphoneModel.includes('SE') ? "hidden" : ""}`}>{generatingWorkoutInFolder ? `${t('in')} '` + generatingWorkoutInFolder.title + "'" : "..."}</Text>
                            <Text style={tw`text-xl font-medium text-[#3d5875] mt-1`}>{t('generating-workout')}</Text>
                        </View>

                        <Pressable style={tw`w-[98%] h-12 bg-gray-200 shadow-md rounded-xl flex items-center justify-center ${iphoneModel.includes('SE') ? "mb-3" : "mb-5"} mt-[-5px] self-center`}
                            onPress={() => {
                                setIsGeneratingWorkoutAnimationModalVisible(false)
                            }}
                        >
                            <Text style={tw`text-2xl font-medium`}>{t('hide')}</Text>
                        </Pressable>
                    </Pressable>

                    
                </View>
        </Modal>
    )
}

export default GeneratingWorkoutAnimationModal;