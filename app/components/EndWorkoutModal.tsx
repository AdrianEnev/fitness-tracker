import { View, Text, Modal, Pressable, Keyboard, TextInput } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import endWorkout from '../use/useEndWorkout';

interface EndWorkoutModalProps {
    navigation: any;
    exercises: any;
    workoutTitle: string;
    isEndWorkoutModalVisible: boolean;
    setIsEndWorkoutModalVisible: (isVisible: boolean) => void;
    duration: any;
}

const EndWorkoutModal: React.FC<EndWorkoutModalProps> = ({ isEndWorkoutModalVisible, setIsEndWorkoutModalVisible, navigation, exercises, workoutTitle, duration }) => { 
    
    console.log('EndWorkoutModal.tsx: ', duration);
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isEndWorkoutModalVisible}
            onRequestClose={() => {
                setIsEndWorkoutModalVisible(!isEndWorkoutModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full h-[26%] rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium mt-1`}>Приключване на Тренировка</Text>
                        <Text style={tw`text-lg text-center text-gray-500 font-medium my-2`}>Сигурен ли си, че искаш да приключиш тази тренировка?</Text>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-[#e83d50] w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => endWorkout(navigation, exercises, workoutTitle, duration)}>
                                <Text style={tw`text-white text-lg font-medium`}>Приключване и Запазване</Text>
                            </Pressable>
                        </View>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-gray-200 w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsEndWorkoutModalVisible(false)}>
                                <Text style={tw`text-black text-lg font-medium`}>Назад</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default EndWorkoutModal;