import { View, Text, TouchableWithoutFeedback, SafeAreaView, KeyboardAvoidingView, Keyboard, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc";
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

const ChangePassword = () => {

    const [email, setEmail] = useState('');

    const changePassword = () => {

        if (email.length <= 0) {    
            return;
        }

        sendPasswordResetEmail(getAuth(), email)
        .then(() => {
            alert('Email sent successfuly!');
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    const {t} = useTranslation();

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw`flex-1 mx-5`}>
                
                    <Text style={tw`text-4xl text-center text-[#fd1c47] font-bold my-2`}>{t('new-password')}</Text>

                    <KeyboardAvoidingView behavior='padding'>
                        
                        <View style={tw`flex-col gap-y-2 my-5`}>
                        <View style={tw`mb-2`}>
                            <Text style={tw`font-medium text-gray-600 mb-1 ml-1`}>{t('email')}</Text>
                            <TextInput 
                                style={tw`h-14 border-2 rounded-lg border-gray-200 px-2`} 
                                placeholder={t('example-email')}
                                onChangeText={(text: string) => setEmail(text)} 
                                value={email} 
                                autoCapitalize='none'
                                maxLength={50}
                            />
                        </View>

                            <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-lg flex justify-center items-center shadow-md`}
                                onPress={changePassword}>
                                <Text style={tw`text-2xl text-white`}>{t('send')}</Text>
                            </TouchableOpacity>
                                
                        </View>
                    
                    </KeyboardAvoidingView>

                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default ChangePassword