import { View, Text, Modal, Pressable, TextInput } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import GlobalContext from '../../GlobalContext';

interface SavedWorkoutNotes {
    isSavedWorkoutNotesVisible: boolean;
    setIsSavedWorkoutNotesVisible: (isVisible: boolean) => void;
    exercises: any; 
    currentIndex: number;
  }

const SavedWorkoutNotes: React.FC<SavedWorkoutNotes> = ({ isSavedWorkoutNotesVisible, setIsSavedWorkoutNotesVisible, exercises, currentIndex }) => {

    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isSavedWorkoutNotesVisible}
            onRequestClose={() => {
                setIsSavedWorkoutNotesVisible(!isSavedWorkoutNotesVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full ${iphoneModel.includes('SE') ? "h-[37%]" : "h-[30%]"} rounded-2xl px-2`}>

                        <View style={tw`flex flex-row justify-between`}>
                            <Text style={tw`text-lg font-medium my-1 max-w-[85%] ml-1 mt-2`} numberOfLines={1} ellipsizeMode='tail'>{exercises[currentIndex].title}</Text>
                            <Ionicons name='close' size={32} color='#ef4444' style={tw`mt-[6px]`} onPress={() => setIsSavedWorkoutNotesVisible(!isSavedWorkoutNotesVisible)} />
                        </View>

                        <View style={tw`w-full h-[82%] bg-white border border-gray-200 shadow-md rounded-xl px-3 py-2 mt-1`}>
                            <Text style={tw`font-medium text-lg`}>
                                {exercises[currentIndex].note}
                            </Text>
                        </View>
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default SavedWorkoutNotes