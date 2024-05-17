import { View, Text, TextInput, Pressable, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ActiveWorkoutModals from './ActiveWorkoutModals';

const ActiveWorkoutExercises = (
    {
        item, 
        updateInputValue, 
        inputValue, 
        currentDay, 
        skipExercise, 
        addSet,
        deleteSet,
        previousExercise,
        exerciseNumber,
        nextExercise,
        exercises,
        notes,
        updateNote

    }: any) => {

    // izpolzva se za pokazvane na letqshtata kutiq
    const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
    const [noteModalVisible, setNoteModalVisible] = useState(false);
    
    const { t } = useTranslation();

    const currentDayTitle = currentDay?.title;

    return (
       
        <View style={tw`w-full h-auto bg-white pt-3 pb-15`}>

            <ActiveWorkoutModals 
                descriptionModalVisible={descriptionModalVisible}
                setDescriptionModalVisible={setDescriptionModalVisible}
                noteModalVisible={noteModalVisible}
                setNoteModalVisible={setNoteModalVisible}
                notes={notes}
                updateNote={updateNote}
                item={item}
                t={t}
                exerciseNumber={exerciseNumber}
            />

            <View style={tw`flex flex-col mx-3 gap-y-1`}>
        
                <Text style={tw`text-2xl font-medium`}>{currentDayTitle}</Text>

                <View style={tw`flex flex-row justify-between`}>

                    <View style={tw`w-[86%]`}>
                        <Text style={tw`text-lg`} numberOfLines={1}>{item.title}</Text>
                    </View>
                    

                    <View style={tw`flex flex-row gap-x-2`}>

                        {item.description !== '' ? (
                            <View style={tw`flex items-center justify-center bg-blue-200 w-10 h-8 rounded-lg`}>
                                <Ionicons name='ellipsis-horizontal' size={28} color='#3B82F6' onPress={() => setDescriptionModalVisible(true)}/>
                            </View>
                        ): null}
                    
                        <View style={tw`flex items-center justify-center bg-blue-200 w-10 h-8 rounded-lg`}>
                            <Ionicons name='add-outline' size={30} color='#3B82F6' onPress={() => setNoteModalVisible(true)}/>
                        </View>
                    </View>
                </View>
            
            </View>

            <View style={tw`mt-3 ml-5`}>

                {Array.from({ length: item.sets }, (_, index) => (
                    <View key={index.toString()}>

                        <View style={tw`flex flex-row gap-x-2`}>
                            <View style={tw`w-10 h-10 bg-[#F2F2F2] rounded-xl flex items-center justify-center`}>
                                <Text style={tw`text-base ml-5 absolute font-medium`}>{index + 1}</Text>
                            </View>

                            <View style={tw`flex flex-row gap-x-2`} key={`set-${item.id}-${index}`}>
                                
                                <TextInput
                                    style={tw`bg-[#F2F2F2] rounded-2xl p-2 w-20 h-10 mb-5`}
                                    keyboardType='number-pad'
                                    maxLength={4}
                                    value={inputValue && inputValue[`${item.id}-${index + 1}-reps`]}
                                    onChangeText={(text) => {
                                        updateInputValue(`${item.id}-${index + 1}-reps`, text);
                                    }}
                                    placeholder={item.reps === "0" ? t('reps') : item.reps.toString() + " " + t('reps-short')}
                                />

                                <TextInput
                                    style={tw`bg-[#F2F2F2] rounded-2xl p-2 w-20 h-10 mb-5`}
                                    keyboardType='number-pad'
                                    maxLength={4}
                                    value={inputValue && inputValue[`${item.id}-${index + 1}-weight`]}
                                    onChangeText={(text) => {
                                        updateInputValue(`${item.id}-${index + 1}-weight`, text)
                                    }}
                                    placeholder='KG'
                                />

                                <TextInput
                                    style={tw`bg-[#F2F2F2] rounded-2xl p-2 w-20 h-10 mb-5 `}
                                    keyboardType='number-pad'
                                    maxLength={2}
                                    value={inputValue && inputValue[`${item.id}-${index + 1}-rpe`]}
                                    onChangeText={(text) => {
                                        updateInputValue(`${item.id}-${index + 1}-rpe`, text)
                                    }}
                                    placeholder='RPE'
                                />

                                {/** <Ionicons name='close-circle-outline' size={48} color='red'/>  */}

                                <TouchableOpacity style={tw`bg-red-500 rounded-2xl w-20 h-10 flex items-center justify-center`} onPress={deleteSet}>
                                    <Text style={tw`text-white`}>{t('delete')}</Text>
                                </TouchableOpacity>
            
                            </View>
                        </View>
                    </View>
                ))}
            </View>
            
            <View style={tw`mx-3`}>
                <TouchableOpacity style={tw`w-full h-12 bg-green-500 rounded-xl flex justify-center items-center`} onPress={addSet}>
                    <Text style={tw`text-lg text-white`}>+ {t('add-set')}</Text>
                </TouchableOpacity>
            </View>

            <View style={tw`mx-3 mt-2`}>
                <TouchableOpacity style={tw`w-full h-12 bg-red-500 rounded-xl flex justify-center items-center`} onPress={skipExercise}>
                    <Text style={tw`text-lg text-white`}>{t('skip-exercise')}</Text>
                </TouchableOpacity>
            </View>

            {/* Ako ima samo 1 uprajnenie ne se pokazva nishto*/}
            {/* ako e izbrano purvoto uprajennie se pokazva samo strelka napred zashtoto nqma drugo predi nego*/}
            {/* ako e izbrano poslednoto uprajennie se pokazva samo strelka nazad zashtoto nqma drugo sled nego*/}
            {/* v drugite sluchai se pokazvat i dvete strelki za nazad i za napred*/}
            {exerciseNumber == 1 && exercises.length > 1 ? (
                <View style={tw`flex flex-row justify-between mx-3`}>
                    <Pressable onPress={previousExercise}>
                        <Ionicons name='arrow-back-circle-outline' size={77} color='#3B82F6' style={tw`hidden`}/>
                    </Pressable>

                    <Pressable  onPress={nextExercise}>
                        <Ionicons name='arrow-forward-circle-outline' size={77} color='#3B82F6'/>
                    </Pressable>
                </View>
            ) : exerciseNumber > 1 && exerciseNumber < exercises.length ? (
                <View style={tw`flex flex-row justify-between mx-3`}>
                    
                    <Pressable onPress={previousExercise}>
                        <Ionicons name='arrow-back-circle-outline' size={77} color='#3B82F6'/>
                    </Pressable>

                    <Pressable  onPress={nextExercise}>
                        <Ionicons name='arrow-forward-circle-outline' size={77} color='#3B82F6'/>
                    </Pressable>

                </View>
            ) : exerciseNumber == exercises.length && exercises.length != 1? (
                <View style={tw`flex flex-row justify-between mx-3`}>
                    
                    <Pressable onPress={previousExercise}>
                        <Ionicons name='arrow-back-circle-outline' size={77} color='#3B82F6'/>
                    </Pressable>

                    <Pressable  onPress={nextExercise}>
                        <Ionicons name='arrow-forward-circle-outline' size={77} color='#3B82F6' style={tw`hidden`}/>
                    </Pressable>

                </View>
            ) : null}

        </View>
          
      )
}

export default ActiveWorkoutExercises