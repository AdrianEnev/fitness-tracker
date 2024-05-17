import { View, Text, Modal, TouchableOpacity, Pressable, TextInput } from 'react-native'
import React, { useEffect } from 'react'
import { BlurView } from 'expo-blur';
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';

type ActiveWorkoutModalsProps = {
    descriptionModalVisible: boolean;
    setDescriptionModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    noteModalVisible: boolean;
    setNoteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    notes: any;
    updateNote: any;
    item: any; // replace 'any' with the appropriate type
    t: any; // replace 'any' with the appropriate type
    exerciseNumber: number;
};

const ActiveWorkoutModals: React.FC<ActiveWorkoutModalsProps> = ({
    descriptionModalVisible,
    setDescriptionModalVisible,
    noteModalVisible,
    setNoteModalVisible,
    notes,
    updateNote,
    item,
    t,
    exerciseNumber
}) => {

    let exerciseNoteObject = notes.find((note: any) => note.index === exerciseNumber);
    let exerciseNote = exerciseNoteObject ? exerciseNoteObject.note : '';

    return (
        <View>
        
            {/**Description modal */}
            <Modal
                    animationType="fade"
                    transparent={true}
                    visible={descriptionModalVisible}
                    onRequestClose={() => {
                        setDescriptionModalVisible(!descriptionModalVisible);
                }}>
                    <BlurView style={tw`flex-1`}>
                        <View style={tw`flex-1 justify-center items-center mx-2`}>
                            <View style={tw`w-full bg-white rounded-2xl shadow-lg p-3 px-4`}>

                                <View style={tw`flex flex-row justify-between mb-3`}>

                                    <Text style={tw`text-xl font-medium`}>{t('exercise-description')}</Text>

                                    <Pressable style={tw`w-8 h-8 flex items-center justify-center`} onPress={() => setDescriptionModalVisible(!descriptionModalVisible)}>
                                        <Ionicons name='close-outline' size={24} color='red'/>
                                    </Pressable>
                                </View>

                                <View style={tw`flex items-start`}>
                                    <Text style={tw`mb-4 text-center`}>{item.description}</Text>
                                </View>
                            
                            </View>
                        </View>
                    </BlurView>
                </Modal>

                {/**Details modal */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={noteModalVisible}
                    onRequestClose={() => {
                        setNoteModalVisible(!noteModalVisible);
                }}>
                    <BlurView style={tw`flex-1`}>
                        <View style={tw`flex-1 justify-center items-center mx-2`}>
                            <View style={tw`w-full bg-white rounded-2xl shadow-lg p-3 px-3`}>

                                <View style={tw`flex flex-row justify-between mb-3`}>

                                    <Text style={tw`text-xl font-medium`}>{t('exercise-note')}</Text>

                                    <Pressable style={tw`w-8 h-8 flex items-center justify-center`} onPress={() => setNoteModalVisible(!setNoteModalVisible)}>
                                        <Ionicons name='close-outline' size={24} color='red'/>
                                    </Pressable>
                                </View>

                                <View style={tw`border-b-2 border-gray-200`} />

                                <TextInput style={tw`w-full h-66 bg-white shadow-md px-3 py-2 text-base mt-3`}
                                    multiline={true}
                                    maxLength={300}
                                    onChangeText={(value) => updateNote(exerciseNumber, value)}
                                    defaultValue={exerciseNote}
                                    textAlignVertical='top'
                                />

                            </View>
                        </View>
                    </BlurView>
                </Modal>

        </View>
    )
}

export default ActiveWorkoutModals