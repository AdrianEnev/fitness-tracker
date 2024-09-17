import { View, Text, Modal, Pressable, Keyboard, TextInput, ActivityIndicator, Dimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Plane, Chase, Bounce, Wave, Pulse, Flow, Swing, Circle, CircleFade, Grid, Fold, Wander } from 'react-native-animated-spinkit'

interface ScanFoodModalProps {
    isScanFoodModalVisible: boolean;
    setIsScanFoodModalVisible: (isVisible: boolean) => void;
    photo: any;
}

const ScanFoodModal: React.FC<ScanFoodModalProps> = ({ 
    isScanFoodModalVisible, setIsScanFoodModalVisible, photo
}) => { 
    
    //console.log('ScanFoodModal.tsx: ', duration);
    const screenWidth = Dimensions.get('screen').width;
    const thirtyPercentScreenWidth = screenWidth * 0.45;

    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isScanFoodModalVisible}
            onRequestClose={() => {
                setIsScanFoodModalVisible(!isScanFoodModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-[80%] h-[30%] rounded-[30px] pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <View style={tw`flex-1 justify-center items-center mt-12`}>
                            <Swing color={`#3d5875`} size={thirtyPercentScreenWidth} />
                        </View>
                            
                        <View style={tw`flex-1 justify-end items-center mb-3`}>
                            <Text style={tw`text-2xl font-bold text-[#3d5875]`}>{photo ? 'Analyzing Image...' : 'Capturing Image...'}</Text>
                        </View>
                    </Pressable>
                </View>
        </Modal>
    )
}

export default ScanFoodModal;