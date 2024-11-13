import { View, TextInput, Button, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import tw from "twrnc";
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';


const Login = ({navigation}: any) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const {internetConnected} = useContext(GlobalContext);

    const auth = FIREBASE_AUTH;

    const signIn = async() => {

        if (!internetConnected) {
            alert('Няма интернет връзка!');
            return
        }

        if (email.length <= 0 || password.length <= 0) {    
            return;
        }

        const weirdCharPattern = /[^a-zA-Z0-9@#$£€%^&*()"'-/|.,?![]{}+=_~<>¥]/;
        if (weirdCharPattern.test(password)) {
            alert('Паролата не може да съдържа емоджитa!');
            return;
        }

        const trimmedEmail = email.trim();

        try{
            const user = await signInWithEmailAndPassword(auth, trimmedEmail, password);

            // save username locally using AsyncStorage
            await AsyncStorage.setItem(`email`, trimmedEmail);

        }catch(err: any){
            alert(err);
        }
        
    }

    const { t } = useTranslation();

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw`p-5`}>

                    <Text style={tw`text-4xl text-center text-[#fd1c47] font-bold my-2`}>{t('login')}</Text>

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
                            
                            <View style={tw`mb-2`}>
                                
                                <Text style={tw`font-medium text-gray-600 mb-1 ml-1`}>{t('password')}</Text>
                                    
                                <TextInput 
                                    style={tw`h-14 border-2 rounded-lg border-gray-200 px-2`} 
                                    placeholder={t('enter-password')}
                                    onChangeText={(text: string) => setPassword(text)} 
                                    value={password} 
                                    autoCapitalize='none'
                                    maxLength={65}
                                    secureTextEntry={!isPasswordVisible}
                                />

                                <View style={tw`absolute right-2 top-8`}>
                                    {isPasswordVisible ? 
                                        (
                                            <Ionicons name='eye-outline' size={32} color="#fd3e6b" onPress={() => setIsPasswordVisible(false)}/>
                                        ) : 
                                        (
                                            <Ionicons name='eye-off-outline' size={32} color="#fd3e6b" onPress={() => setIsPasswordVisible(true)}/>

                                        )
                                    }
                                </View>

                                <Pressable style={tw`flex items-end w-full mt-1 mb-2`} onPress={() => navigation.navigate('Парола-Смяна')}>
                                    <Text style={tw`font-medium text-gray-500`}>{t('forgot-password')}</Text>
                                </Pressable>
                            </View>
                            
                            <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-lg flex justify-center items-center shadow-md`}
                                onPress={signIn}>
                                <Text style={tw`text-2xl text-white`}>{t('login')}</Text>
                            </TouchableOpacity>
                            
                                
                        </View>
                    
                    </KeyboardAvoidingView>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>

    )
}

export default Login