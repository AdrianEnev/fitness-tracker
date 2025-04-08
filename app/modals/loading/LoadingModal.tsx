import { View, Modal, Dimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Swing } from 'react-native-animated-spinkit'

interface LoadingModalProps {
    isLoadingModalVisible: boolean;
    setIsLoadingModalVisible: (isVisible: boolean) => void;
}

const LoadingModal: React.FC<LoadingModalProps> = ({ 
    isLoadingModalVisible, setIsLoadingModalVisible
}) => { 
    
    const screenWidth = Dimensions.get('screen').width;
    const thirtyPercentScreenWidth = screenWidth * 0.45;
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isLoadingModalVisible}
            onRequestClose={() => {
                setIsLoadingModalVisible(!isLoadingModalVisible);
            }}
        >
            <View style={tw`flex-1 justify-center items-center mx-3`}>

                <View style={tw`w-[100%] h-1/2 rounded-[30px] px-2`}>

                    <View style={tw`flex-1 justify-center items-center mt-6`}>
                        <Swing color={`white`} size={thirtyPercentScreenWidth} />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default LoadingModal;