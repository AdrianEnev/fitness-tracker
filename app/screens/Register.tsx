import { View, TextInput, Button, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import tw from "twrnc";

const Register = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const auth = FIREBASE_AUTH;

    const signUp = async() => {

        if (password !== confirmPassword) {
            alert("Паролите не са еднакви!");
            return;
        }

        try{
            const after = await createUserWithEmailAndPassword(auth, email, password);

            alert("Успешно бяхте регистрирани!");
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
                        <TextInput style={tw`bg-white h-10 pl-2`} placeholder="Имейл" onChangeText={(text: string) => setEmail(text)} value={email} autoCapitalize='none'/>
                        <TextInput style={tw`bg-white h-10 pl-2`} textContentType='password' placeholder="Парола" onChangeText={(text: string) => setPassword(text)} value={password} autoCapitalize='none'/>
                        <TextInput style={tw`bg-white h-10 pl-2`} textContentType='password' placeholder="Потвърди парола" onChangeText={(text: string) => setConfirmPassword(text)} value={confirmPassword} autoCapitalize='none'/>
                        <Button onPress={signUp} title='Регистрация'/>
                    </View>
                
                </KeyboardAvoidingView>

            </View>
            
        </TouchableWithoutFeedback>
    </View>
  )
}

export default Register