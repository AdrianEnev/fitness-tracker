import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Picker } from 'react-native-wheel-pick'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const PageThree = ({numberOfDays, setNumberOfDays}: any) => {

    const days = [
        1,2,3,4,5,6,7
    ]

    const {t} = useTranslation()

    const currentLanguage = i18next.language;

    return (
        <View style={tw`flex flex-col mt-[10%] h-full`}>

            <View style={tw`mx-5`}>
                
                <Text style={tw`font-medium text-2xl text-center`}>{t(`how-many-days-a-week-do-you-plan-to-work-out`)}</Text>

                {currentLanguage === 'en' ? 
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will<Text style={tw`font-bold`}>only</Text> be used to generate a custom workout</Text> : currentLanguage == "bg" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Това ще бъде използвано <Text style={tw`font-bold`}>само</Text> за създаване на тренировка</Text> ) : currentLanguage == "de" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Dies wird<Text style={tw`font-bold`}>nur</Text> verwendet, um ein individuelles Training zu erstellen</Text> ) : currentLanguage == "fr" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Cela sera<Text style={tw`font-bold`}>uniquement</Text> utilisé pour générer un entraînement personnalisé</Text> ) : currentLanguage == "ru" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Это будет<Text style={tw`font-bold`}>только</Text> использоваться для создания индивидуальной тренировки</Text>
                ) : null}
                
            </View>

            <View style={tw`flex-1 items-center mt-[5%]`}>
                <View style={tw`w-[37%] h-[60%] bg-gray-200 rounded-[47px] flex items-center pt-3`}>

                    <Text style={tw`font-medium text-3xl mt-3`}>{numberOfDays}</Text>
                    <View style={tw`w-full h-[2px] rounded-full bg-gray-300 mt-3`}></View>

                    <Picker
                        style={tw`h-1/2 w-full bg-gray-200 rounded-[47px] mt-[50%]`}
                        selectedValue={days}
                        pickerData={days}
                        onValueChange={(value: any) => { setNumberOfDays(value) }}
                    />

                </View>
            </View>
        </View>
    )
}

export default PageThree