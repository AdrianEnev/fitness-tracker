import { View, Text, Modal, Pressable, Keyboard, TextInput } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import addWorkout from '../use/useAddWorkout';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface CreateWorkoutModalProps {
    exercises: any;
    navigation: any;
    workoutTitle: any;
    setWorkoutTitle: any;
    saveButtonDisabled: any;
    setSaveButtonDisabled: any;
    isCreateWorkoutModalVisible: boolean;
    setIsCreateWorkoutModalVisible: (isVisible: boolean) => void;
}

const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({ 
    isCreateWorkoutModalVisible, setIsCreateWorkoutModalVisible, exercises, navigation, workoutTitle, setWorkoutTitle,
    setSaveButtonDisabled, saveButtonDisabled
}) => { 
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isCreateWorkoutModalVisible}
            onRequestClose={() => {
                setIsCreateWorkoutModalVisible(!isCreateWorkoutModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full h-[29%] rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium mt-1`}>Запазване на тренировка</Text>
                        <Text style={tw`text-lg text-center text-gray-500 font-medium my-2`}>Моля въведи име за тази тренировка!</Text>


                        <TextInput
                            style={tw`w-full h-12 rounded-xl bg-[#4C9AFF] my-1 text-white font-medium pl-3`}
                            maxLength={30}
                            placeholder='Крака'
                            placeholderTextColor='#e5e7eb'
                            onChangeText={(text) => setWorkoutTitle(text)}
                        />

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable disabled={saveButtonDisabled}
                                style={({ pressed }) => [
                                    tw`bg-green-500 w-full h-10 rounded-xl flex items-center justify-center mb-1`,
                                    pressed ? tw`opacity-75` : {}, // This line changes the style based on the pressed state
                                ]}
                                onPress={() => {
                                    
                                    setSaveButtonDisabled(true)

                                    if (workoutTitle === '') {
                                        setSaveButtonDisabled(false);
                                        return
                                    }

                                    addWorkout(exercises, navigation, workoutTitle)
                                }}
                            >
                                <Text style={tw`text-white text-lg font-medium`}>Запазване</Text>
                            </Pressable>
                        </View>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-[#E0E0E0] w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsCreateWorkoutModalVisible(false)}>
                                <Text style={tw`text-black text-lg font-medium`}>Назад</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default CreateWorkoutModal;