import { View, Text, TextInput, Pressable } from 'react-native'
import React from 'react'
import tw from "twrnc";
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native-gesture-handler';

const ActiveWorkoutExercises = ({item, updateInputValue, inputValue, currentDay, skipExercise}: any) => {

    const { t } = useTranslation();

    const currentDayTitle = currentDay?.title;

    return (
       
        <View style={tw`w-full h-auto bg-white pt-3`}>

            <View style={tw`flex flex-row justify-between mx-4`}>
                <Text style={tw`text-lg font-medium`}>{currentDayTitle}</Text>
                <Text style={tw`text-lg font-medium`} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
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
                                    placeholder={item.reps === "0" ? t('reps') : item.reps.toString()}
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
                                    style={tw`bg-[#F2F2F2] rounded-2xl p-2 w-20 h-10 mb-5 mr-4`}
                                    keyboardType='number-pad'
                                    maxLength={2}
                                    value={inputValue && inputValue[`${item.id}-${index + 1}-rpe`]}
                                    onChangeText={(text) => {
                                        updateInputValue(`${item.id}-${index + 1}-rpe`, text)
                                    }}
                                    placeholder='RPE'
                                />
                            </View>
                        </View>
                    </View>
                ))}
            </View>
            
            <View style={tw`mx-3`}>
                <TouchableOpacity style={tw`w-full h-12 bg-green-500 rounded-xl flex justify-center items-center`}>
                    <Text style={tw`text-lg text-white`}>+ Добави серия</Text>
                </TouchableOpacity>
            </View>

            <View style={tw`mx-3 mt-2`}>
                <TouchableOpacity style={tw`w-full h-12 bg-red-500 rounded-xl flex justify-center items-center`} onPress={skipExercise}>
                    <Text style={tw`text-lg text-white`}>Пропусни упражнение</Text>
                </TouchableOpacity>
            </View>
            

        </View>
          
      )
}

export default ActiveWorkoutExercises