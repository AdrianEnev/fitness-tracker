import { View, Text, TextInput } from 'react-native'
import React from 'react'
import tw from "twrnc";
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';

const ActiveWorkoutExercises = ({item, updateInputValue, inputValue}: any) => {

    const { t } = useTranslation();

    return (
       
        <View style={tw`w-full h-auto bg-white pt-3`}>
            
            <Text style={tw`text-lg font-medium text-center mx-4`} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>

            <View style={tw`mx-3 mt-4`}>

                <Text style={tw`font-medium text-lg absolute ml-1`}>{t('set')}</Text>

                <View style={tw`flex flex-row justify-end gap-x-1 mt-1`}>

                    <Text style={tw`text-sm mr-2`}>{t('reps')}</Text>
                    <Text style={tw`text-sm mr-2`}>{t('weight')}</Text>
                    <Text style={tw`text-sm mr-8`}>RPE</Text>

                </View>

            </View>

            <View style={tw`mt-3 ml-5`}>

                {Array.from({ length: item.sets }, (_, index) => (
                    <View key={index.toString()}>

                        <Text style={tw`text-base ml-5 absolute font-medium`}>{index + 1}</Text>

                        <View style={tw`flex flex-row gap-x-1 justify-end`} key={`set-${item.id}-${index}`}>
                            
                            <TextInput
                                style={tw`border border-gray-300 rounded-2xl p-2 w-20 h-10 mb-5 ml-3`}
                                keyboardType='number-pad'
                                maxLength={4}
                                value={inputValue && inputValue[`${item.id}-${index + 1}-reps`]}
                                onChangeText={(text) => {
                                    updateInputValue(`${item.id}-${index + 1}-reps`, text);
                                }}
                                placeholder={item.reps === "0" ? '' : item.reps.toString()}
                            />

                            <TextInput
                                style={tw`border border-gray-300 rounded-2xl p-2 w-20 h-10 mb-5`}
                                keyboardType='number-pad'
                                maxLength={4}
                                value={inputValue && inputValue[`${item.id}-${index + 1}-weight`]}
                                onChangeText={(text) => {
                                    updateInputValue(`${item.id}-${index + 1}-weight`, text)
                                }}
                            />

                            <TextInput
                                style={tw`border border-gray-300 rounded-2xl p-2 w-20 h-10 mb-5 mr-4`}
                                keyboardType='number-pad'
                                maxLength={2}
                                value={inputValue && inputValue[`${item.id}-${index + 1}-rpe`]}
                                onChangeText={(text) => {
                                    updateInputValue(`${item.id}-${index + 1}-rpe`, text)
                                }}
                            />
                        </View>

                    </View>
                ))}
            </View>

            

            

        </View>
          
      )
}

export default ActiveWorkoutExercises