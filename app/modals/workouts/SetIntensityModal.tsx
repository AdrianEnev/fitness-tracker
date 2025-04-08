import { View, Text, Modal, Pressable } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import GlobalContext from '@config/GlobalContext';

interface SetIntensityModalProps {
    isSetIntensityModalVisible: boolean;
    setIsSetIntensityModalVisible: (isVisible: boolean) => void;
    setNumber: number;
    intensityBoxSelected: number;
    setIntensityBoxSelected: (value: number) => void;
    setSetIntensity: (setNumber: number) => void;
    
}

const SetIntensityModal: React.FC<SetIntensityModalProps> = ({ isSetIntensityModalVisible, setIsSetIntensityModalVisible, setNumber, intensityBoxSelected, setIntensityBoxSelected, setSetIntensity}) => {
    
    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isSetIntensityModalVisible}
            onRequestClose={() => {
                setIsSetIntensityModalVisible(!isSetIntensityModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-gray-50 w-full h-[26%] rounded-2xl pt-3 px-2`}>
                        
                        <View style={tw`w-full flex flex-row justify-between`}>
                            <Pressable onPress={() => setIsSetIntensityModalVisible(false)}>
                                <Ionicons name='close' size={35} color='red'/>
                            </Pressable>
                            <Pressable onPress={() => {

                                if (intensityBoxSelected == 0) {
                                    return
                                }

                                setSetIntensity(intensityBoxSelected)
                                setIsSetIntensityModalVisible(false)
                            }}>
                                <Ionicons name='checkmark' size={35} color='#22c55e'/>
                            </Pressable>
                        </View>

                        <Text style={tw`text-xl font-medium text-center mt-2`}>{t('select-intensity-of-set')} {setNumber}</Text>

                        <View style={tw`w-full h-full flex justify-center flex-row gap-x-3 mt-4`}>
                            <Pressable style={tw`w-[30%] h-[45%] rounded-[20px] bg-green-500 flex flex-col gap-y-2 items-center justify-center ${intensityBoxSelected === 1 ? 'border-2 border-white shadow-lg' : ''}`}
                                onPress={() => setIntensityBoxSelected(1)}
                            >
                                <Ionicons name='accessibility-outline' size={32} color='white'/>
                                <Text style={tw`text-white font-medium ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "text-lg" : "text-base"} text-center`}>{t('warm-up')}</Text>
                            </Pressable>
                            <Pressable style={tw`w-[30%] h-[45%] rounded-[20px] bg-yellow-400 flex-col gap-y-2 items-center justify-center ${intensityBoxSelected === 2 ? 'border-2 border-white shadow-lg' : ''}`}
                                onPress={() => setIntensityBoxSelected(2)}
                            >
                                <Ionicons name='bicycle-outline' size={32} color='white'/>
                                <Text style={tw`text-white font-medium ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "text-lg" : "text-base"} text-center`}>{t('regular-set')}</Text>
                            </Pressable>
                            <Pressable style={tw`w-[30%] h-[45%] rounded-[20px] bg-red-500 flex-col gap-y-2 items-center justify-center ${intensityBoxSelected === 3 ? 'border-2 border-white shadow-lg' : ''}`}
                                onPress={() => setIntensityBoxSelected(3)}
                            >
                                <Ionicons name='flame-outline' size={32} color='white'/>
                                <Text style={tw`text-white font-medium ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "text-lg" : "text-base"} text-center`}>{t('failure-set')}</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default SetIntensityModal