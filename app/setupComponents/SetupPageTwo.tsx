import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import { Picker } from 'react-native-wheel-pick';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';

const SetupPageTwo = ({age, setAge}: any) => {
    
    const currentLanguage = i18next.language;
    const {t} = useTranslation();

    const ages = [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
        11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
        31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
        41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
        51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
        61, 62, 63, 64, 65, 66, 67, 68, 69, 70,
        71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
        81, 82, 83, 84, 85, 86, 87, 88, 89, 90,
        91, 92, 93, 94, 95, 96, 97, 98, 99, 100
    ];

    const {iphoneModel} = useContext(GlobalContext)

    return (
        <View style={tw`flex flex-col mt-[15%] h-full`}>
            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>{t('setup-age')}</Text>
                {currentLanguage === 'en' ? 
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to calculate your daily BMR!</Text> : currentLanguage == "bg" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Това ще бъде използвано <Text style={tw`font-bold`}>само</Text> за изчисляване на твоят дневен BMR!</Text> ) : currentLanguage == "de" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Dies wird <Text style={tw`font-bold`}>nur</Text> verwendet, um Ihren täglichen BMR zu berechnen!</Text> ) : currentLanguage == "fr" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Cela sera <Text style={tw`font-bold`}>uniquement</Text> utilisé pour calculer votre BMR quotidien!</Text> ) : currentLanguage == "ru" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Это будет <Text style={tw`font-bold`}>только</Text> использоваться для расчета вашего ежедневного BMR!</Text> ) : currentLanguage == "it" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Questo sarà <Text style={tw`font-bold`}>solo</Text> utilizzato per calcolare il tuo BMR giornaliero!</Text> ) : currentLanguage == "es" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Esto se <Text style={tw`font-bold`}>solo</Text> utilizará para calcular tu BMR diario!</Text>
                ) : null}
            </View>
            
            <View style={tw`flex-1 items-center mt-[5%]`}>
                <View style={tw`w-[37%] ${!iphoneModel.includes('SE') ? "h-[60%]" : "h-[55%]"} bg-gray-200 rounded-[47px] flex items-center pt-3`}>

                    <Text style={tw`font-medium text-3xl mt-3`}>{age}</Text>
                    <View style={tw`w-full h-[2px] rounded-full bg-gray-300 mt-3`}></View>

                    <Picker
                        style={tw`h-1/2 w-full bg-gray-200 rounded-[47px] ${!iphoneModel.includes('SE') ? "mt-[50%]" : ""}`}
                        selectedValue={age}
                        pickerData={ages}
                        onValueChange={(value: any) => { setAge(value) }}
                    />

                </View>
            </View>   

        </View>
    )
}

export default SetupPageTwo