import { View, TextInput, Button, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import tw from "twrnc";
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';

const Login = ({navigation}: any) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const auth = FIREBASE_AUTH;

    const signIn = async() => {

        if (email.length <= 0 || password.length <= 0) {    
            return;
        }


        try{
            const user = await signInWithEmailAndPassword(auth, email, password);

        }catch(err: any){
            alert(err);
        }
        
    }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={tw`flex-1 mx-5`}>

                <Text style={tw`text-4xl text-center text-[#fd1c47] font-bold my-2`}>Вход</Text>

                <KeyboardAvoidingView behavior='padding'>
                    
                    <View style={tw`flex-col gap-y-2 my-5`}>
                       
                        <View style={tw`mb-2`}>
                            <Text style={tw`font-medium text-gray-600 mb-1 ml-1`}>Имейл</Text>
                            <TextInput 
                                style={tw`h-14 border-2 rounded-lg border-gray-200 px-2`} 
                                placeholder='example@gmail.com'
                                onChangeText={(text: string) => setEmail(text)} 
                                value={email} 
                                autoCapitalize='none'
                                maxLength={50}
                            />
                        </View>
                        
                        <View style={tw`mb-2`}>
                            
                            <Text style={tw`font-medium text-gray-600 mb-1 ml-1`}>Парола</Text>
                                
                            <TextInput 
                                style={tw`h-14 border-2 rounded-lg border-gray-200 px-2`} 
                                placeholder='Enter your password'
                                onChangeText={(text: string) => setPassword(text)} 
                                value={password} 
                                autoCapitalize='none'
                                maxLength={65}
                            />

                            <Pressable style={tw`flex items-end w-full mt-1 mb-2`} onPress={() => navigation.navigate('Парола-Смяна')}>
                                <Text style={tw`font-medium text-gray-500`}>Забравена парола?</Text>
                            </Pressable>
                        </View>
                        
                        <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-lg flex justify-center items-center shadow-md`}
                            onPress={signIn}>
                            <Text style={tw`text-2xl text-white`}>Вход</Text>
                        </TouchableOpacity>
                        

                        
                            
                    </View>
                
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>

  )
}

export default Login