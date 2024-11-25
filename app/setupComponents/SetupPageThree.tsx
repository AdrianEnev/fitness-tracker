import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import tw from 'twrnc'
import HorizontalPicker from '@vseslav/react-native-horizontal-picker';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';

const SetupPageThree = ({weight, weightType, setWeight, setWeightType, setHeightType, setHeight, height}: any) => {

    const currentLanguage = i18next.language;

    const {t} = useTranslation();

    const cmToFeetInches = (cm: any) => {
        const totalInches = cm * 0.393701;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return { feet, inches };
    };

    const feetInchesToCm = (feet: any, inches: any) => {
        return Math.round((feet * 12 + inches) * 2.54);
    };

    const Items = Array.from({length: 121}, (_, i) => i + 30);

    const rednerItem = (item: any, index: any) => (
        <View style={tw`w-16 h-16 bg-gray-300 shadow-sm rounded-2xl flex items-center justify-center mx-2 mt-12`}>
            <Text style={tw`text-xl text-gray-700 font-medium`}>
                { item }
            </Text>
        </View>
    );

    const {iphoneModel} = useContext(GlobalContext);

    return (
        <View style={tw`flex flex-col mt-[15%] h-full`}>
            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>Please enter your weight.</Text>
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
            
            <View style={tw`flex flex-row w-full mx-3 mt-[7%]`}>
                <Pressable style={tw`w-[47.5%] h-14 border border-gray-300 rounded-l-[25px] flex items-center justify-center`} onPress={() => {

                    if (weightType == "KG") {
                        return;
                    }

                    setWeightType('KG')
                    setWeight(Math.round(weight / 2.20462))

                    setHeightType('CM');
                    const { feet, inches } = height; 
                    setHeight(feetInchesToCm(feet, inches));
                }}>
                    <Text style={tw`font-medium text-xl ${weightType === 'KG' ? 'text-[#fd3e4b]' : 'text-black'}`}>KG</Text>
                </Pressable>
                <Pressable style={tw`w-[47.5%] h-14 border border-gray-300 rounded-r-[25px] flex items-center justify-center`} onPress={() => {

                    if (weightType == "LB") {
                        return;
                    }

                    setWeightType('LB')
                    setWeight(Math.round(weight * 2.20462))

                    setHeightType('FT');
                    const convertedHeight = cmToFeetInches(height);
                    setHeight(convertedHeight);
                }}>
                    <Text style={tw`font-medium text-xl ${weightType === 'LB' ? 'text-[#fd3e4b]' : 'text-black'}`}>LB</Text>
                </Pressable>
            </View>

            <View style={tw`flex flex-row gap-x-1 justify-center mt-[7%]`}>
                <Text style={tw`font-medium text-5xl`}>{weight}</Text>
                <Text style={tw`text-gray-500 text-xl font-medium ${weightType === "KG" ? "mt-[12px]" : "mt-[14px]"}`}>{weightType.toLowerCase()}</Text>
            </View>

            <View style={tw`mx-3 mt-5 w-[94.5%] h-full`}>
                <View style={tw`w-full h-[18%] bg-gray-200 rounded-[47px]`}>

                    <HorizontalPicker
                        style={tw`${iphoneModel.includes('SE') ? "mt-[-10px] mx-2" : "mx-1"}`}
                        data={Items}
                        renderItem={rednerItem}
                        itemWidth={80}
                        defaultIndex={weight - 30}
                        onChange={(index: any) => {
                            setWeight(index + 30);
                        }}
                    />

                </View>

            </View>

        </View>
    )
}

export default SetupPageThree