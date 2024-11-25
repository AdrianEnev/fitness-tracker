import { View, Text, Modal, Pressable, Keyboard } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import endWorkout from '../useWorkout/useEndWorkout';
import endWorkoutLocally from '../useWorkout/useEndWorkoutLocally';
import generateID from '../use/useGenerateID';
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';

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
    
    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);
    
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
                    <Pressable style={tw`bg-white w-full ${iphoneModel.includes('SE') ? "h-[35%]" : "h-[24%]"} rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium mt-1`}>{t('end-workout')}</Text>
                        <Text style={tw`text-lg text-center text-gray-500 font-medium `}>{t('end-workout-alert')}</Text>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-[#e83d50] w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => {

                                const id = generateID();

                                endWorkoutLocally(exercises, workoutTitle, duration, id);

                                navigation.navigate('Главна Страница');

                                if (internetConnected) {
                                    endWorkout(exercises, workoutTitle, duration, id);
                                }
                            }}>
                                <Text style={tw`text-white text-lg font-medium`}>{t('save-and-end')}</Text>
                            </Pressable>
                        </View>

                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-gray-200 w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsEndWorkoutModalVisible(false)}>
                                <Text style={tw`text-black text-lg font-medium`}>{t('cancel')}</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default EndWorkoutModal;