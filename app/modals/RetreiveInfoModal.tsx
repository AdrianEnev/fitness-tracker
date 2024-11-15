import { View, Text, Modal, Pressable, Keyboard, TextInput } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import retreiveInfo from '../use/useRetreiveInfo';

interface RetreiveInfoModalProps {
    isRetreiveInfoModalVisible: boolean;
    setIsRetreiveInfoModalVisible: (isVisible: boolean) => void;
    setIsRetreivingInfoAnimationModalVisible: (isVisible: boolean) => void;
    navigation: any;
    internetSpeed: number;
}

const RetreiveInfoModal: React.FC<RetreiveInfoModalProps> = ({ 
    isRetreiveInfoModalVisible, 
    setIsRetreiveInfoModalVisible, 
    setIsRetreivingInfoAnimationModalVisible,
    navigation,
    internetSpeed
}) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isRetreiveInfoModalVisible}
            onRequestClose={() => {
                setIsRetreiveInfoModalVisible(!isRetreiveInfoModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-gray-50 w-full h-[23%] rounded-2xl pt-3 px-2`}>
                        
                        <View style={tw`w-full flex flex-row justify-between`}>
                            
                            <Pressable onPress={() => {
                                setIsRetreiveInfoModalVisible(false)
                            }}>
                                <Ionicons name='help-outline' size={35} color='#3b82f6'/>
                                
                            </Pressable>
                            <Pressable onPress={() => setIsRetreiveInfoModalVisible(false)}>
                                <Ionicons name='close' size={35} color='red'/>
                            </Pressable>
                            
                        </View>

                        <Text style={tw`text-xl font-medium text-center`}>Retreive Info</Text>

                        <View style={tw`w-full h-full flex justify-center flex-row gap-x-3 mt-4`}>
                            <Pressable style={tw`w-[30%] h-[55%] rounded-[20px] bg-green-500 flex flex-col gap-y-2 items-center justify-center`}
                                onPress={async () => {
                                    setIsRetreiveInfoModalVisible(false);
                                    await retreiveInfo("workouts", navigation, setIsRetreivingInfoAnimationModalVisible, internetSpeed);
                                }}
                            >
                                <Ionicons name='accessibility-outline' size={32} color='white'/>
                                <Text style={tw`text-white font-medium text-lg`}>Workouts</Text>
                            </Pressable>
                    
                            <Pressable style={tw`w-[30%] h-[55%] rounded-[20px] bg-blue-500 flex-col gap-y-2 items-center justify-center`}
                                onPress={async () => {
                                    setIsRetreiveInfoModalVisible(false);
                                    await retreiveInfo("foods", navigation, setIsRetreivingInfoAnimationModalVisible, internetSpeed);
                                }}
                            >
                                <Ionicons name='egg-outline' size={32} color='white'/>
                                <Text style={tw`text-white font-medium text-lg`}>Food Log</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default RetreiveInfoModal