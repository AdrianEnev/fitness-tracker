import { View, Text, Modal, Pressable, Keyboard, TextInput } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'

interface ExerciseOptionsModalProps {
    navigation: any;
    isExerciseOptionsModalVisible: boolean;
    setIsExerciseOptionsModalVisible: (isVisible: boolean) => void;
    addRestDay: () => void;
    pageIndex: any;
    deleteCurrentExercise: () => void;
}

const ExerciseOptionsModal: React.FC<ExerciseOptionsModalProps> = ({ 
    isExerciseOptionsModalVisible, setIsExerciseOptionsModalVisible, navigation, addRestDay, pageIndex, deleteCurrentExercise
}) => { 
    
    //console.log('EndWorkoutModal.tsx: ', duration);
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isExerciseOptionsModalVisible}
            onRequestClose={() => {
                setIsExerciseOptionsModalVisible(!isExerciseOptionsModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full h-[33%] rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium mt-1`}>Тренировка - Настройки</Text>
                        <Text style={tw`text-lg text-center text-gray-500 font-medium mb-1`}>Моля избери опция!</Text>

                        <View style={tw`w-full h-[50%] flex justify-center flex-row gap-x-3 mt-1`}>
                            <Pressable style={tw`w-[45%] h-[100%] rounded-[20px] bg-cyan-500 flex flex-col items-center justify-center`}
                                onPress={async () => {
                                    addRestDay();
                                    navigation.navigate('Тренировки');
                                }}
                            >
                                <Ionicons name='cloud-outline' size={32} color='white'/>
                                <Text style={tw`text-white font-medium text-lg`}>Маркирай</Text>
                                <Text style={tw`text-white font-medium text-lg mt-[-5px]`}>почивка</Text>
                            </Pressable>
                            
                            <Pressable style={tw`w-[45%] h-[100%] rounded-[20px] bg-red-500 flex-col items-center justify-center ${pageIndex === 1 ? 'hidden' : ''}`}
                                onPress={() => {
                                    deleteCurrentExercise();
                                    setIsExerciseOptionsModalVisible(false);
                                }}
                            >
                                <Ionicons name='trash-outline' size={32} color='white'/>
                                <Text style={tw`text-white font-medium text-lg`}>Изтрий</Text>
                                <Text style={tw`text-white font-medium text-lg mt-[-5px]`}>упражнение</Text>
                            </Pressable>
                        </View>

                        <View style={tw`flex items-center mt-4`}>
                            <Pressable style={tw`bg-gray-200 w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsExerciseOptionsModalVisible(false)}>
                                <Text style={tw`text-black text-lg font-medium`}>Назад</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default ExerciseOptionsModal;