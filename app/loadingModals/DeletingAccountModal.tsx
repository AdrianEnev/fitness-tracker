import { View, Text, Modal, Pressable, Keyboard, Dimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Swing } from 'react-native-animated-spinkit'
import Ionicons from '@expo/vector-icons/Ionicons';

interface ScanFoodModalProps {
    isDeletingAccountModalVisible: boolean;
    setIsDeletingAccountModalVisible: (isVisible: boolean) => void;                 
}

const DeletingAccountModal: React.FC<ScanFoodModalProps> = ({ 
    isDeletingAccountModalVisible, setIsDeletingAccountModalVisible
}) => { 
    
    //console.log('ScanFoodModal.tsx: ', duration);
    const screenWidth = Dimensions.get('screen').width;
    const thirtyPercentScreenWidth = screenWidth * 0.45;
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isDeletingAccountModalVisible}
            onRequestClose={() => {
                setIsDeletingAccountModalVisible(!isDeletingAccountModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>

                    <View style={tw`bg-white w-[96%] h-[35%] rounded-[30px] pt-3 px-2`}>

                        <View style={tw`flex-1 justify-center items-center mt-14`}>
                            <Swing color={`#3d5875`} size={thirtyPercentScreenWidth} />
                        </View>
                            
                        <View style={tw`flex-1 justify-end items-center mb-5`}>
                            <Text style={tw`text-2xl font-bold text-[#3d5875]`}>Deleting account...</Text>
                            <Text style={tw`text-xl font-medium text-[#3d5875] mt-[-4px]`}>This cannot be cannceled!</Text>
                        </View>
                    </View>

                    
                </View>
        </Modal>
    )
}

export default DeletingAccountModal;