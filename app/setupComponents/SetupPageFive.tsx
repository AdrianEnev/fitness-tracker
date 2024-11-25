import { View, Text, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import GlobalContext from '../../GlobalContext'
import i18next from 'i18next'
import { useTranslation } from 'react-i18next'
import { ScrollView } from 'react-native-gesture-handler'

const SetupPageFive = ({activityLevel, setActivityLevel}: any) => {

    const {iphoneModel} = useContext(GlobalContext);

    const currentLanguage = i18next.language;

    const {t} = useTranslation();
   
    return (
        <View style={tw`flex flex-col ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "mt-[10%]" : iphoneModel.includes('SE') ? "mt-4" : "mt-[15%]"} h-full`}>
            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>{t('how-active-are-you')}</Text>
                {currentLanguage === 'en' ? 
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will<Text style={tw`font-bold`}> only</Text> be used to calculate your daily BMR!</Text> : currentLanguage == "bg" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Това ще бъде използвано <Text style={tw`font-bold`}>само</Text> за изчисляване на твоят дневен BMR!</Text> ) : currentLanguage == "de" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Dies wird<Text style={tw`font-bold`}> nur</Text> verwendet, um Ihren täglichen BMR zu berechnen!</Text> ) : currentLanguage == "fr" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Cela sera<Text style={tw`font-bold`}> uniquement</Text> utilisé pour calculer votre BMR quotidien!</Text> ) : currentLanguage == "ru" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Это будет<Text style={tw`font-bold`}> только</Text> использоваться для расчета вашего ежедневного BMR!</Text> ) : currentLanguage == "it" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Questo sarà<Text style={tw`font-bold`}> solo</Text> utilizzato per calcolare il tuo BMR giornaliero!</Text> ) : currentLanguage == "es" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Esto se<Text style={tw`font-bold`}> solo</Text> utilizará para calcular tu BMR diario!</Text>
                ) : null}
            </View>

            <View style={tw`flex-1 flex-col gap-y-2 mx-5 mt-[5%]`}>

                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[11.9%]" : "h-[10.9%]"} rounded-2xl ${activityLevel === 1 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(1)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 1 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>1/6</Text>
                    <Text style={tw`${iphoneModel.includes('SE') ? "text-xl" : "text-2xl"} font-medium ${activityLevel === 1 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[80%]`}
                        ellipsizeMode='tail' numberOfLines={2}
                    >
                        {t('exercise-activity-one')}
                    </Text>
                </Pressable>

                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[11.9%]" : "h-[10.9%]"} rounded-2xl ${activityLevel === 2 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(2)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>2/6</Text>
                    <Text style={tw`${iphoneModel.includes('SE') ? "text-xl" : "text-2xl"} font-medium ${activityLevel === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[80%]`}
                        ellipsizeMode='tail' numberOfLines={2}
                    >
                        {t('exercise-activity-two')}
                    </Text>
                </Pressable>

                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[11.9%]" : "h-[10.9%]"} rounded-2xl ${activityLevel === 3 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(3)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>3/6</Text>
                    <Text style={tw`${iphoneModel.includes('SE') ? "text-xl" : "text-2xl"} font-medium ${activityLevel === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[80%]`}
                        ellipsizeMode='tail' numberOfLines={2}
                    >
                        {t('exercise-activity-three')}
                    </Text>
                </Pressable>

                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[11.9%]" : "h-[10.9%]"} rounded-2xl ${activityLevel === 4 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(4)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[80%]`}>4/6</Text>
                    <Text style={tw`${iphoneModel.includes('SE') ? "text-xl" : "text-2xl"} font-medium ${activityLevel === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[80%]`}
                        ellipsizeMode='tail' numberOfLines={2}
                    >
                        {t('exercise-activity-four')}
                    </Text>
                </Pressable>

                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[11.9%]" : "h-[10.9%]"} rounded-2xl ${activityLevel === 5 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(5)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 5 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>5/6</Text>
                    <Text style={tw`${iphoneModel.includes('SE') ? "text-xl" : "text-2xl"} font-medium ${activityLevel === 5 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[80%]`}
                        ellipsizeMode='tail' numberOfLines={2}
                    >
                        {t('exercise-activity-five')}
                    </Text>
                </Pressable>

                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[11.9%]" : "h-[10.9%]"} rounded-2xl ${activityLevel === 6 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setActivityLevel(6)}
                >
                    <Text style={tw`text-3xl font-bold ${activityLevel === 6 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>6/6</Text>
                    <Text style={tw`${iphoneModel.includes('SE') ? "text-xl" : "text-2xl"} font-medium ${activityLevel === 6 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[80%]`}
                        ellipsizeMode='tail' numberOfLines={2}
                    >
                        {t('exercise-activity-six')}
                    </Text>
                </Pressable>

            </View>
        </View>
    )
}

export default SetupPageFive