import { View, Text, Modal, Pressable, Keyboard, Dimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Swing } from 'react-native-animated-spinkit'

interface ScanFoodModalProps {
    isGeneratingWorkoutAnimationModalVisible: boolean;
    setIsGeneratingWorkoutAnimationModalVisible: (isVisible: boolean) => void;
    generatingWorkoutInFolder: any;
}

const GeneratingWorkoutAnimationModal: React.FC<ScanFoodModalProps> = ({ 
    isGeneratingWorkoutAnimationModalVisible, 
    setIsGeneratingWorkoutAnimationModalVisible,
    generatingWorkoutInFolder
}) => { 
    
    //console.log('ScanFoodModal.tsx: ', duration);
    const screenWidth = Dimensions.get('screen').width;
    const thirtyPercentScreenWidth = screenWidth * 0.45;
    
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
                    <Pressable style={tw`bg-white w-[96%] h-[42%] rounded-[30px] pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <View style={tw`flex-1 justify-center items-center mt-9`}>
                            <Swing color={`#3d5875`} size={thirtyPercentScreenWidth} />
                        </View>
                            
                        <View style={tw`flex-1 justify-end items-center mb-5`}>
                            <Text style={tw`text-2xl font-bold text-[#3d5875]`}>Generating Workout </Text>
                            <Text style={tw`text-2xl font-bold text-[#3d5875]`}>{generatingWorkoutInFolder ? "in '" + generatingWorkoutInFolder.title + "'" : "..."}</Text>
                            <Text style={tw`text-xl font-medium text-[#3d5875] mt-1`}>This may take a while!</Text>
                        </View>

                        <Pressable style={tw`w-[98%] h-12 bg-gray-200 shadow-md rounded-xl flex items-center justify-center mb-5 mt-[-5px] self-center`}
                            onPress={() => {
                                setIsGeneratingWorkoutAnimationModalVisible(false)
                            }}
                        >
                            <Text style={tw`text-2xl font-medium`}>Hide</Text>
                        </Pressable>
                    </Pressable>

                    
                </View>
        </Modal>
    )
}

export default GeneratingWorkoutAnimationModal;