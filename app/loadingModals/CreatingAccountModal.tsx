import { View, Text, Modal, Dimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Swing } from 'react-native-animated-spinkit'
import { useTranslation } from 'react-i18next';

interface CreatingAccountModalProps {
    isCreatingAccountModalVisible: boolean;
    setIsCreatingAccountModalVisible: (isVisible: boolean) => void;
}

const CreatingAccountModal: React.FC<CreatingAccountModalProps> = ({ 
    isCreatingAccountModalVisible, setIsCreatingAccountModalVisible
}) => { 
    
    const screenWidth = Dimensions.get('screen').width;
    const thirtyPercentScreenWidth = screenWidth * 0.45;

    const {t} = useTranslation();
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isCreatingAccountModalVisible}
            onRequestClose={() => {
                setIsCreatingAccountModalVisible(!isCreatingAccountModalVisible);
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

export default CreatingAccountModal;