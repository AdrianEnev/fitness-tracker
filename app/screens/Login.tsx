import { View, TextInput, Button, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import tw from "twrnc";

const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const auth = FIREBASE_AUTH;

    const signIn = async() => {

        try{
            const user = await signInWithEmailAndPassword(auth, email, password);

        }catch(err: any){
            alert(err);
        }
        
    }

  return (
    <View style={tw`mx-5 flex-1`}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={tw`flex-1`}>
                <KeyboardAvoidingView behavior='padding'>
                    
                    <View style={tw`flex-col gap-y-2 my-5`}>
                        <TextInput style={tw`bg-white h-10 pl-2`} placeholder="Email" onChangeText={(text: string) => setEmail(text)} value={email} autoCapitalize='none'/>
                        <TextInput style={tw`bg-white h-10 pl-2`} textContentType='password' placeholder="Password" onChangeText={(text: string) => setPassword(text)} value={password} autoCapitalize='none'/>

                        <View style={tw`flex items-center`}>
                            <Button onPress={signIn} title='Вход'/>
                            
                        </View>
                    </View>
                
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    </View>
  )
}

export default Login