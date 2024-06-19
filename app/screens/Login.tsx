import { View, TextInput, Button, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native'
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
    <SafeAreaView style={tw`mx-5 flex-1`}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={tw`flex-1`}>

                <Text style={tw`text-base text-center font-medium mt-2`}>ENV: Fitness Tracker</Text>

                <KeyboardAvoidingView behavior='padding'>
                    
                    <View style={tw`flex-col gap-y-2 my-5`}>
                        <TextInput style={tw`bg-white h-10 pl-2 rounded-lg`} placeholder="Email" onChangeText={(text: string) => setEmail(text)} value={email} autoCapitalize='none'/>
                        <TextInput style={tw`bg-white h-10 pl-2 rounded-lg`} textContentType='password' placeholder="Password" onChangeText={(text: string) => setPassword(text)} value={password} autoCapitalize='none'/>

                        <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-2xl flex justify-center items-center shadow-md mt-1`}
                        onPress={signIn}>
                            <Text style={tw`text-2xl text-white`}>Вход</Text>
                        </TouchableOpacity>

                        <Button title='Забравена Парола' onPress={() => navigation.navigate('Парола-Смяна')}/>
                            
                    </View>
                
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default Login