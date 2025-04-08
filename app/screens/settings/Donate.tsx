import { View, Text, Button, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next'
import Ionicons from '@expo/vector-icons/Ionicons';

const Donate = ({navigation}: any) => {

    const {t} = useTranslation();
    

    //https://paypal.me/plamenenev78?country.x=BG&locale.x=en_US
    //https://paypal.me/plamenenev78

    return (
        <View style={tw`h-full w-full`}>

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-3xl font-bold text-black m-2`}>Support the Developer</Text>
            </View>

            <View style={tw`bg-white h-full w-full px-3 pt-2`}>

                <Text style={tw`font-medium text-lg`}>
                    
                    Thank you for using my fitness tracker app! As a solo developer, I’m passionate about creating tools that help people stay healthy and active. The app is completely free to use, but if you find it helpful and would like to support my work, a donation would be greatly appreciated.

                </Text>

                <Text style={tw`font-medium text-lg mt-2`}>
                    Your contribution helps me dedicate more time to improving the app, adding new features, and ensuring everything runs smoothly. No amount is too small, and your support means the world to me.
                </Text>

                <Text style={tw`font-medium text-lg mt-2`}>
                    Thank you for your generosity and for being part of this journey!
                </Text>

                <View style={tw`flex-1 items-center mt-2`}>
                    <Pressable style={tw`w-[65%] h-16 bg-yellow-400 rounded-[30px] mt-3 gap-x-2 flex flex-row items-center justify-center`} onPress={() => navigation.navigate('Дарение')}>
                        <Ionicons name='logo-paypal' size={32} color='white'/>
                        <Text style={tw`font-bold text-2xl text-white`}>Donate Now</Text>
                    </Pressable>
                </View>

            </View>
            

           
        </View>
    )
}

export default Donate