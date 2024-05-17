import { View, TextInput, Button, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from "twrnc";
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { collection, doc, setDoc } from 'firebase/firestore';

const Register = () => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const auth = FIREBASE_AUTH;

    const signUp = async() => {

        if (password !== confirmPassword) {
            alert("Паролите не са еднакви!");
            return;
        }

        if (username.length <= 2) {
            alert('Потребителското име трябва да съдържа поне 3 символа!');
            return;
        } 

        try{
            const after = await createUserWithEmailAndPassword(auth, email, password);

            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, after.user.uid);
            const userInfoCollectionRef = collection(userDocRef, 'user_info');

            // add a document inside userInfoCollectionRef and call that document "username"
            await setDoc(doc(userInfoCollectionRef, 'username'), { username });

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
                        <TextInput style={tw`bg-white h-10 pl-2`} placeholder="Потребителско име" onChangeText={(text: string) => setUsername(text)} value={username} autoCapitalize='none' maxLength={22}/>
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