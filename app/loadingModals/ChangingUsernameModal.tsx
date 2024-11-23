import { View, Text, Modal, Dimensions } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Swing } from 'react-native-animated-spinkit'
import { useTranslation } from 'react-i18next';

interface ChangingUsernameModalProps {
    isChangingUsernameModalVisible: boolean;
    setIsChangingUsernameModalVisible: (isVisible: boolean) => void;                 
}

const ChangingUsernameModal: React.FC<ChangingUsernameModalProps> = ({ 
    isChangingUsernameModalVisible, setIsChangingUsernameModalVisible
}) => { 
    
    const screenWidth = Dimensions.get('screen').width;
    const thirtyPercentScreenWidth = screenWidth * 0.45;

    const {t} = useTranslation();
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isChangingUsernameModalVisible}
            onRequestClose={() => {
                setIsChangingUsernameModalVisible(!isChangingUsernameModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>

                    <View style={tw`bg-white w-[96%] h-[35%] rounded-[30px] pt-3 px-2`}>

                        <View style={tw`flex-1 justify-center items-center mt-14`}>
                            <Swing color={`#3d5875`} size={thirtyPercentScreenWidth} />
                        </View>
                            
                        <View style={tw`flex-1 justify-end items-center mb-5`}>
                            <Text style={tw`text-2xl font-bold text-[#3d5875]`}>{t('changing-username-alert')}</Text>
                            <Text style={tw`text-xl font-medium text-[#3d5875] mt-[-4px]`}>{t('few-seconds-alert')}</Text>
                        </View>
                    </View>

                    
                </View>
        </Modal>
    )
}

export default ChangingUsernameModal;