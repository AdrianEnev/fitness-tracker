import { View, Text, Pressable, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { Picker } from 'react-native-wheel-pick'
import Ionicons from '@expo/vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'

const LanguageScreen = ({ setLocalLanguageSet }: { setLocalLanguageSet: (value: boolean) => void }) => {

    const [language, setLanguage] = useState('English')
    const languagesEN = [ 
        'English', "Bulgarian", "French", "German", "Russian"
    ] 

    const finishButtonClicked = async () => {
        const languageShort = language === 'English' ? 'en' : language === 'Bulgarian' ? 'bg' : language === 'French' ? 'fr' : language === 'German' ? 'de' : 'ru';
        await AsyncStorage.setItem(`language`, languageShort);
        setLocalLanguageSet(true);
    }
    
    return (
        <View style={tw`flex-1 flex-col`}>

            <View style={tw`w-full h-24 bg-[#fd1c47] absolute top-0 justify-center items-center pt-8`}>
                <Text style={tw`text-4xl text-white font-bold`}>Lunge</Text>
            </View>
            
            <View style={tw`flex-1 items-center justify-center mt-[10%]`}>

                <View style={tw`mx-5 mb-5`}>
                    <Text style={tw`font-medium text-2xl text-center`}>What is your preferred language?</Text>
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This can be changed later</Text>
                </View>

                <View style={tw`w-[40%] h-[60%] bg-gray-200 rounded-[47px] flex items-center pt-3`}>

                    <Text style={tw`font-medium text-3xl mt-3`}>{language}</Text>
                    <View style={tw`w-full h-[2px] rounded-full bg-gray-300 mt-3`}></View>

                    <Picker
                        style={tw`h-1/2 w-full bg-gray-200 rounded-[47px] mt-[50%]`}
                        selectedValue={language}
                        pickerData={languagesEN}
                        onValueChange={(value: any) => { setLanguage(value) }}
                    />

                </View>
            </View>

            <View style={tw`mx-2 mb-3`}>
                <TouchableOpacity style={tw`w-full h-20 bg-[#fd1c47] rounded-2xl flex justify-center items-center shadow-md border border-gray-200 mb-4`}
                    onPress={() => finishButtonClicked()}>

                    <Text style={tw`text-4xl text-white font-medium`}>Done</Text>

                </TouchableOpacity>
            </View>

        </View>
    )
}

export default LanguageScreen