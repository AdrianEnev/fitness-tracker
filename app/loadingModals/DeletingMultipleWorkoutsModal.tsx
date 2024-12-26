import { View, Text, Modal, Dimensions, TouchableOpacity } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import { Swing } from 'react-native-animated-spinkit'
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';

interface DeletingMultipleWorkoutsModalProps {
    isDeletingMultipleWorkoutsModalVisible: boolean;
    setIsDeletingMultipleWorkoutsModalVisible: (isVisible: boolean) => void;   
}

const DeletingMultipleWorkoutsModal: React.FC<DeletingMultipleWorkoutsModalProps> = ({ 
    isDeletingMultipleWorkoutsModalVisible, setIsDeletingMultipleWorkoutsModalVisible
}) => { 
    
    const screenWidth = Dimensions.get('screen').width;
    const thirtyPercentScreenWidth = screenWidth * 0.45;

    const {t} = useTranslation();
    
    const {iphoneModel} = useContext(GlobalContext)

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isDeletingMultipleWorkoutsModalVisible}
            onRequestClose={() => {
                setIsDeletingMultipleWorkoutsModalVisible(!isDeletingMultipleWorkoutsModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>

                    <View style={tw`bg-white w-[96%] h-[37%] rounded-[30px] pt-3 px-2`}>

                        <View style={tw`flex-1 justify-center items-center mt-6`}>
                            <Swing color={`#3d5875`} size={thirtyPercentScreenWidth} />
                        </View>
                            
                        <View style={tw`flex-1 justify-end items-center mb-4`}>
                            <Text style={tw`text-2xl font-bold text-[#3d5875]`}>{t('deleting-multiple-workouts')}</Text>
                            <Text style={tw`text-xl font-medium text-[#3d5875] mt-[-4px] ${iphoneModel.includes('Pro') ? "" : "hidden"}`}>{t('few-seconds-alert')}</Text>
                        </View>
                    </View>

                    
                </View>
        </Modal>
    )
}

export default DeletingMultipleWorkoutsModal;