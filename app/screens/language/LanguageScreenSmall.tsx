import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import tw from 'twrnc'
import { Picker } from 'react-native-wheel-pick'
import AsyncStorage from '@react-native-async-storage/async-storage'
import GlobalContext from '@config/GlobalContext'

const LanguageScreenSmall = ({ setLocalLanguageSet }: { setLocalLanguageSet: (value: boolean) => void }) => {

    const [language, setLanguage] = useState('Български')
    const languagesEN = [ 
        "Български", 'English', "Français", "Deutsch", "Русский", "Italiano", "Español"
    ] 

    const finishButtonClicked = async () => {
        const languageShort = language === 'English' ? 'en' : language === 'Български' ? 'bg' : language === 'Français' ? 'fr' : language === 'Deutsch' ? 'de' : language === 'Русский' ? 'ru' : language === 'Italiano' ? 'it' : language === 'Español' ? 'es' : 'en';
        await AsyncStorage.setItem(`language`, languageShort);
        setLocalLanguageSet(true);
    }

    const {iphoneModel} = useContext(GlobalContext);
    //console.log(iphoneModel)
    //console.log('small screen')

    const iphonesWithDynamicIsland = [
        '15', '15 Plus', '16', '16 Plus', '16 Pro', '16 Pro Max'
    ]
    
    return (
        <View style={tw`flex-1 flex-col bg-white`}>

            <View style={tw`w-full h-24 bg-[#fd1c47] absolute top-0 justify-center items-center pt-8`}>
                <Text style={tw`text-4xl text-white font-bold ${iphonesWithDynamicIsland.includes(iphoneModel) ? 'mt-3' : ''}`}>Lunge</Text>
            </View>
            
            <View style={tw`flex-1 items-center justify-center mt-[10%]`}>

                <View style={tw`mx-5 mb-5`}>
                    <Text style={tw`font-medium text-2xl text-center`}>Какъв език предпочиташ?</Text>
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Това може да бъде променено по-късно!</Text>
                </View>

                <View style={tw`w-48 h-64 bg-gray-200 rounded-[47px] flex items-center pt-3`}>

                    <Text style={tw`font-medium text-3xl mt-2 mb-3`}>{language}</Text>
                    <View style={tw`w-full h-[2px] rounded-full bg-gray-300`}></View>

                    <Picker
                        style={tw`h-full w-full bg-gray-200 rounded-[47px]`}
                        selectedValue={language}
                        pickerData={languagesEN}
                        onValueChange={(value: any) => { setLanguage(value) }}
                    />

                </View>
            </View>

            <View style={tw`mx-2 mb-3`}>
                <TouchableOpacity style={tw`w-full h-20 bg-[#fd1c47] rounded-2xl flex justify-center items-center shadow-md border border-gray-200 mb-4`}
                    onPress={() => finishButtonClicked()}>

                    <Text style={tw`text-4xl text-white font-medium`}>Готово</Text>

                </TouchableOpacity>
            </View>
        </View>
    )
}

export default LanguageScreenSmall