import { View, Text, TouchableOpacity } from 'react-native'
import React, { useContext, useState } from 'react'
import tw from 'twrnc'
import {Picker} from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage'
import GlobalContext from '../../GlobalContext'
import { FlatList } from 'react-native-gesture-handler';

const LanguageScreen = ({ setLocalLanguageSet }: { setLocalLanguageSet: (value: boolean) => void }) => {

    const [language, setLanguage] = useState('English')
    const languagesEN = [ 
        'English', "Български", "Français", "Deutsch", "Русский", "Italiano", "Español"
    ] 

    const finishButtonClicked = async () => {
        const languageShort = language === 'English' ? 'en' : language === 'Български' ? 'bg' : language === 'Français' ? 'fr' : language === 'Deutsch' ? 'de' : language === 'Русский' ? 'ru' : language === 'Italiano' ? 'it' : language === 'Español' ? 'es' : 'en';
        await AsyncStorage.setItem(`language`, languageShort);
        setLocalLanguageSet(true);
    }

    const {iphoneModel} = useContext(GlobalContext);
    console.log(iphoneModel)

    const iphonesWithDynamicIsland = [
        '15', '15 Plus', '16', '16 Plus', '16 Pro', '16 Pro Max', 'SE'
    ]
    
    return (
        <View style={tw`flex-1 flex-col bg-white`}>

            <View style={tw`w-full h-24 bg-[#fd1c47] absolute top-0 justify-center items-center pt-8`}>
                <Text style={tw`text-4xl text-white font-bold ${iphonesWithDynamicIsland.includes(iphoneModel) ? 'mt-3' : ''}`}>Lunge</Text>
            </View>
            
            <View style={tw`flex-1 items-center justify-center mt-[10%]`}>

                <View style={tw`mx-5 mb-5`}>
                    <Text style={tw`font-medium text-2xl text-center`}>
                        {
                            language === "English" ? "Choose your language" : 
                            language === "Български" ? "Изберете език" : 
                            language === "Français" ? "Choisissez votre langue" : 
                            language === "Deutsch" ? "Wählen Sie Ihre Sprache" : 
                            language === "Русский" ? "Выберите язык" : 
                            language === "Italiano" ? "Scegli la tua lingua" : 
                            language === "Español" ? "Elige tu idioma" : 
                            "Choose your language"
                        }
                    </Text>
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>
                        {
                            language === "English" ? "You can change this later" :
                            language === "Български" ? "Можете да промените това по-късно" :
                            language === "Français" ? "Vous pouvez changer cela plus tard" :
                            language === "Deutsch" ? "Sie können dies später ändern" :
                            language === "Русский" ? "Вы можете изменить это позже" :
                            language === "Italiano" ? "Puoi cambiare questo in seguito" :
                            language === "Español" ? "Puedes cambiar esto más tarde" :
                            "You can change this later"
                        }
                    </Text>
                </View>

                <View style={tw`w-48 h-[60%] bg-gray-200 rounded-[47px] flex items-center pt-3`}>

                    <Text style={tw`font-medium text-3xl mt-3`}>{language}</Text>
                    <View style={tw`w-full h-[2px] rounded-full bg-gray-300 mt-3`}></View>

                    <Picker
                        style={tw`h-1/2 w-full bg-gray-200 rounded-[47px] mt-[50%]`}
                        selectedValue={language}
                        onValueChange={(value: any) => { setLanguage(value) }}
                    >
                        {languagesEN.map((lang, index) => (
                            <Picker.Item key={index} label={lang} value={lang} />
                        ))}
                    </Picker>

                </View>
            </View>

            <View style={tw`mx-2 mb-3`}>
                <TouchableOpacity style={tw`w-full h-20 bg-[#fd1c47] rounded-2xl flex justify-center items-center shadow-md border border-gray-200 mb-4`}
                    onPress={() => finishButtonClicked()}>

                    <Text style={tw`text-4xl text-white font-medium`}>
                        {
                            language === "English" ? "Done" :
                            language === "Български" ? "Готово" :
                            language === "Français" ? "Terminé" :
                            language === "Deutsch" ? "Fertig" :
                            language === "Русский" ? "Готово" :
                            language === "Italiano" ? "Fatto" :
                            language === "Español" ? "Hecho" :
                            "Done"
                        }
                    </Text>

                </TouchableOpacity>
            </View>

        </View>
    )
}

export default LanguageScreen