import { View, Text, Modal, Pressable, Keyboard, TextInput } from 'react-native'
import React from 'react'
import tw from 'twrnc'

interface NoteModalProps {
    isNoteModalVisible: boolean;
    setIsNoteModalVisible: (isVisible: boolean) => void;
    userInputs: any; // Consider defining a more specific type
    currentIndex: number;
    updateNote: (exerciseIndex: number, note: string) => void;
  }

const NoteModal: React.FC<NoteModalProps> = ({ isNoteModalVisible, setIsNoteModalVisible, userInputs, currentIndex, updateNote }) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isNoteModalVisible}
            onRequestClose={() => {
                setIsNoteModalVisible(!isNoteModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full h-[28%] rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium`}>Добави Бележка</Text>

                        <TextInput 
                            style={tw`w-full h-[65%]`}
                            placeholder='Бележка'
                            placeholderTextColor={'#a0aec0'}
                            maxLength={200}
                            multiline={true}
                            value={userInputs[currentIndex].note}
                            onChangeText={(text) => updateNote(currentIndex, text)}
                        />
                        
                        <View style={tw`flex items-center mt-2`}>
                            <Pressable style={tw`bg-green-500 w-1/2 h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsNoteModalVisible(false)}>
                                <Text style={tw`text-white text-lg font-medium`}>Готово</Text>
                            </Pressable>
                        </View>
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default NoteModal