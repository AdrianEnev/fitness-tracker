import { View, Text, Modal, Pressable, Keyboard, TextInput } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import addWorkout from '../useWorkout/useAddWorkout';
import { TouchableOpacity } from 'react-native-gesture-handler';
import addWorkoutLocally from '../useWorkout/useAddWorkoutLocally';
import generateID from '../use/useGenerateID';

interface CreateWorkoutModalProps {
    exercises: any;
    navigation: any;
    workoutTitle: any;
    setWorkoutTitle: any;
    saveButtonDisabled: any;
    setSaveButtonDisabled: any;
    isCreateWorkoutModalVisible: boolean;
    setIsCreateWorkoutModalVisible: (isVisible: boolean) => void;
    internetConnected: boolean;
    folder: any;
}

const CreateWorkoutModal: React.FC<CreateWorkoutModalProps> = ({ 
    isCreateWorkoutModalVisible, setIsCreateWorkoutModalVisible, exercises, navigation, workoutTitle, setWorkoutTitle,
    setSaveButtonDisabled, saveButtonDisabled, internetConnected, folder
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
                    <Pressable style={tw`bg-gray-50 w-full h-[29%] rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-xl text-center font-medium mt-1`}>Add Workout</Text>
                        <Text style={tw`text-lg text-center text-gray-500 font-medium mb-2`}>Please enter a name for this workout!</Text>


                        <TextInput
                            style={tw`w-full h-12 rounded-xl bg-white shadow-md my-1 text-black font-medium pl-3`}
                            maxLength={30}
                            placeholder='Име на тренировка'
                            placeholderTextColor='#6b7280'
                            onChangeText={(text) => setWorkoutTitle(text)}
                        />

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable disabled={saveButtonDisabled}
                                style={({ pressed }) => [
                                    tw`bg-green-500 w-full h-10 rounded-xl flex items-center justify-center mb-1`,
                                    pressed ? tw`opacity-75` : {}, // This line changes the style based on the pressed state
                                ]}
                                onPress={async () => {
                                    
                                    setSaveButtonDisabled(true)

                                    if (workoutTitle === '') {
                                        setSaveButtonDisabled(false);
                                        return
                                    }

                                    const id = generateID();

                                    await addWorkoutLocally(exercises, workoutTitle, id, folder);
                                    
                                    if (internetConnected) {
                                        addWorkout(exercises, workoutTitle, id, folder);
                                    }
                                    
                                    navigation.navigate('Тренировки');
                                }}
                            >
                                <Text style={tw`text-white text-lg font-medium`}>Save</Text>
                            </Pressable>
                        </View>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-[#e83d50] w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsCreateWorkoutModalVisible(false)}>
                                <Text style={tw`text-white text-lg font-medium`}>Cancel</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default CreateWorkoutModal;