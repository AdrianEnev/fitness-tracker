import { View, Text, Modal, Pressable, Keyboard, TextInput } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import endWorkout from '../useWorkout/useEndWorkout';
import endWorkoutLocally from '../useWorkout/useEndWorkoutLocally';
import generateID from '../use/useGenerateID';

interface EndWorkoutModalProps {
    navigation: any;
    exercises: any;
    workoutTitle: string;
    isEndWorkoutModalVisible: boolean;
    setIsEndWorkoutModalVisible: (isVisible: boolean) => void;
    duration: any;
    internetConnected: boolean;
}

const EndWorkoutModal: React.FC<EndWorkoutModalProps> = ({ 
    isEndWorkoutModalVisible, setIsEndWorkoutModalVisible, navigation, exercises, workoutTitle, duration, internetConnected 
}) => { 
    
    //console.log('EndWorkoutModal.tsx: ', duration);
    
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
                    <Pressable style={tw`bg-white w-full h-[24%] rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium mt-1`}>End Workout</Text>
                        <Text style={tw`text-lg text-center text-gray-500 font-medium `}>Would you like to end this workout? Any changes will be saved!</Text>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-[#e83d50] w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => {

                                const id = generateID();

                                if (internetConnected) {
                                    endWorkout(exercises, workoutTitle, duration, id);
                                }

                                endWorkoutLocally(exercises, workoutTitle, duration, id);

                                navigation.navigate('Главна Страница');
                            }}>
                                <Text style={tw`text-white text-lg font-medium`}>Save and End</Text>
                            </Pressable>
                        </View>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-gray-200 w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsEndWorkoutModalVisible(false)}>
                                <Text style={tw`text-black text-lg font-medium`}>Cancel</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default EndWorkoutModal;