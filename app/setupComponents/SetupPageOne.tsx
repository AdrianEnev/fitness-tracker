import { View, Text, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import GlobalContext from '../../GlobalContext';

const SetupPageOne = ({setGenderButton, gender}: any) => {

    const {t} = useTranslation();
    
    const currentLanguage = i18next.language;

    const {iphoneModel} = useContext(GlobalContext)

    return (
        <View style={tw`flex flex-col mt-[15%] h-full`}>
            <View style={tw`mx-5`}>

                <Text style={tw`font-medium text-2xl text-center`}>{t('setup-gender')}</Text>

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

            <View style={tw`flex-1 flex-col gap-y-5 mx-5 mt-[10%]`}>

                {/* Male */}
                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[14%]" : "h-[12%]"} rounded-2xl ${gender === 'male' ? 'bg-cyan-400' : 'bg-gray-200'} flex flex-row gap-x-2 items-center pl-3`}
                    onPress={() => setGenderButton('male')}
                >

                    <Ionicons name='male-outline' size={50} color={gender === 'male' ? 'white' : '#6b7280'}/>
                    <Text style={tw`text-2xl font-medium ${gender === 'male' ? 'text-white' : 'text-gray-500'} mt-1`}>{t('male')}</Text>

                </Pressable>

                {/* Female */}
                <Pressable style={tw`w-full ${iphoneModel.includes('SE') ? "h-[14%]" : "h-[12%]"} rounded-2xl ${gender === 'female' ? 'bg-pink-400' : 'bg-gray-200'} flex flex-row gap-x-2 items-center pl-3`}
                    onPress={() => setGenderButton('female')}
                >

                    <Ionicons name='female-outline' size={50} color={gender === 'female' ? 'white' : '#6b7280'}/>
                    <Text style={tw`text-2xl font-medium ${gender === 'female' ? 'text-white' : 'text-gray-500'} mt-1`}>{t('female')}</Text>

                </Pressable>

                {/*
                 Option 
                 <Pressable style={tw`w-full h-[12%] rounded-2xl ${includeInBio === false ? 'bg-[#fd3e4b]' : 'bg-green-400'} flex flex-row gap-x-2 items-center pl-3`}
                    onPress={() => {
                        setIncludeInBio(!includeInBio)
                        setShowOnlyText(!showOnlyText)
                    }}
                >

                    <Ionicons name={includeInBio === false ? 'close' : 'checkmark'} size={55} color='white'/>
                    <Text style={tw`text-2xl font-medium text-white mt-1`}>Include in profile</Text>

                </Pressable>
                 
                */}
        

            </View>
        </View>
    )
}

export default SetupPageOne