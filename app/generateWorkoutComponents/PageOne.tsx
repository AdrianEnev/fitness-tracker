import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'
import { useContext } from 'react'
import GlobalContext from '../../GlobalContext'

const PageOne = ({experienceLevel, setExperienceLevel}: any) => {

    const {t} = useTranslation();   

    const currentLanguage = i18next.language;

    const {iphoneModel} = useContext(GlobalContext);

    return (
        <View style={tw`flex flex-col mt-[10%] h-full`}>

            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>{t(`current-fitness-level-question`)}</Text>

                {currentLanguage === 'en' ? 
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will<Text style={tw`font-bold`}>only</Text> be used to generate a custom workout</Text> : currentLanguage == "bg" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Това ще бъде използвано <Text style={tw`font-bold`}>само</Text> за създаване на тренировка</Text> ) : currentLanguage == "de" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Dies wird<Text style={tw`font-bold`}>nur</Text> verwendet, um ein individuelles Training zu erstellen</Text> ) : currentLanguage == "fr" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Cela sera<Text style={tw`font-bold`}>uniquement</Text> utilisé pour générer un entraînement personnalisé</Text> ) : currentLanguage == "ru" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Это будет<Text style={tw`font-bold`}>только</Text> использоваться для создания индивидуальной тренировки</Text> ) : currentLanguage == "it" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Questo sarà<Text style={tw`font-bold`}>solo</Text> utilizzato per generare un allenamento personalizzato</Text> ) : currentLanguage == "es" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Esto se<Text style={tw`font-bold`}>solo</Text> utilizará para generar un entrenamiento personalizado</Text>
                ) : null}

            </View>

            <View style={tw`flex-1 flex-col gap-y-3 mx-5 mt-[5%]`}>

                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[13%]" : "h-[10.9%]"} rounded-2xl ${experienceLevel === 1 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setExperienceLevel(1)}
                >
                    <Text style={tw`text-3xl font-bold ${experienceLevel === 1 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>1/4</Text>
                    <Text style={tw`text-2xl font-medium ${experienceLevel === 1 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`beginner`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[13%]" : "h-[10.9%]"} rounded-2xl ${experienceLevel === 2 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setExperienceLevel(2)}
                >
                    <Text style={tw`text-3xl font-bold ${experienceLevel === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>2/4</Text>
                    <Text style={tw`text-2xl font-medium ${experienceLevel === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`intermediate`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[13%]" : "h-[10.9%]"} rounded-2xl ${experienceLevel === 3 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setExperienceLevel(3)}
                >
                    <Text style={tw`text-3xl font-bold ${experienceLevel === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>3/4</Text>
                    <Text style={tw`text-2xl font-medium ${experienceLevel === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`advanced`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[13%]" : "h-[10.9%]"} rounded-2xl ${experienceLevel === 4 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setExperienceLevel(4)}
                >
                    <Text style={tw`text-3xl font-bold ${experienceLevel === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>4/4</Text>
                    <Text style={tw`text-2xl font-medium ${experienceLevel === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`elite`)}</Text>
                </Pressable>

            </View>
        </View>
    )
}

export default PageOne