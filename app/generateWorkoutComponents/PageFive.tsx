import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const PageFive = ({ specificBodyparts, setSpecificBodyparts }: any) => {

    const toggleBodyPart = (bodyPart: string) => {
        if (specificBodyparts.includes(bodyPart)) {
            setSpecificBodyparts(specificBodyparts.filter((part: string) => part !== bodyPart));
        } else {
            setSpecificBodyparts([...specificBodyparts, bodyPart]);
        }
    };

    const {t} = useTranslation()

    const currentLanguage = i18next.language;

    return (
        <View style={tw`flex flex-col mt-[10%] h-full`}>

            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>{t(`do-you-want-to-focus-on-any-specific-body-parts`)}</Text>

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

            <View style={tw`flex-1 flex-col gap-y-2 mx-5 mt-[5%]`}>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes('Chest') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart('Chest')}
                >
                    <Ionicons name={specificBodyparts.includes('Chest') ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes('Chest') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes('Chest') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`chest-muscles`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes('Back') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart('Back')}
                >
                    <Ionicons name={specificBodyparts.includes('Back') ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes('Back') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes('Back') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`back-muscles`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes('Legs') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart('Legs')}
                >
                    <Ionicons name={specificBodyparts.includes('Legs') ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes('Legs') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes('Legs') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`legs`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes('Arms') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart('Arms')}
                >
                    <Ionicons name={specificBodyparts.includes('Arms') ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes('Arms') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes('Arms') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`arms`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${specificBodyparts.includes('Shoulders') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleBodyPart('Shoulders')}
                >
                    <Ionicons name={specificBodyparts.includes('Shoulders') ? 'ellipse' : 'ellipse-outline'} size={42} color={specificBodyparts.includes('Shoulders') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${specificBodyparts.includes('Shoulders') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`shoulders`)}</Text>
                </Pressable>

            </View>
        </View>
    )
}

export default PageFive