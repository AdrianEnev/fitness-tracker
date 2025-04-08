import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect } from 'react'
import tw from "twrnc"
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useTranslation } from 'react-i18next'
import i18next from "i18next";
import AsyncStorage from '@react-native-async-storage/async-storage'

const Welcome = ({navigation}: any) => {

    // set the language to english 
    const {t} = useTranslation();
    
    useEffect(() => {
        const fetch = async () => {
            const language = await AsyncStorage.getItem(`language`);
            i18next.changeLanguage(language?.toString());
        }

        fetch();
        
    }, [])

    return (
        <SafeAreaView style={tw`flex-1 h-full w-full bg-white`}>
            

            <View style={tw`flex-1 flex-col gap-y-2 justify-end mx-4`}>

                <Text style={tw`text-5xl font-bold text-black ml-2`}>Lunge</Text>
                <Text style={tw`text-3xl font-medium text-black mt-[-4px] mb-8 ml-2`}>Fitness Tracker</Text>

                <Text style={tw`text-lg font-medium ml-2 mb-3`}>{t('slogan')}</Text>

                <TouchableOpacity style={tw`w-full h-20 bg-[#fd1c47] rounded-2xl flex justify-center items-center shadow-md`} 
                    onPress={() => navigation.navigate("Вход")}>

                    <Text style={tw`text-3xl text-white`}>{t('login')}</Text>

                </TouchableOpacity>

                <TouchableOpacity style={tw`w-full h-20 bg-white rounded-2xl flex justify-center items-center shadow-md border border-gray-200 mb-4`}
                    onPress={() => navigation.navigate("Регистрация")}>

                    <Text style={tw`text-3xl`}>{t('register')}</Text>

                </TouchableOpacity>

            </View>

        </SafeAreaView>
    )
}

export default Welcome