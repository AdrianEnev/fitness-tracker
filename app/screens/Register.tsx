import { View, TextInput, Button, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from "twrnc";
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import GlobalContext from '../../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { checkUserDocument } from '../use/useCheckUserInfo';

const Register = () => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const {internetConnected} = useContext(GlobalContext);

    const auth = FIREBASE_AUTH;

    const signUp = async() => {

        if (!internetConnected) {
            alert('Няма интернет връзка!');
            return
        }
        
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
    
        if (trimmedEmail.length == 0 || password.length == 0 || confirmPassword.length == 0 || trimmedUsername.length == 0) {    
            return;
        }
        const weirdCharPattern = /[^a-zA-Z0-9@#$£€%^&*()"'-/|.,?![]{}+=_~<>¥]/;
        if (weirdCharPattern.test(password)) {
            alert('Паролата не може да съдържа емоджитa!');
            return;
        }
        if (password !== confirmPassword) {
            alert("Паролите не са еднакви!");
            return;
        }
        if (trimmedUsername.length <= 2) {
            alert('Потребителското име трябва да съдържа поне 3 символа!');
            return;
        } 
        if (password.length <= 8) {
            alert('Паролата трябва да съдържа поне 8 символа!');
            return;
        }
        if (password === trimmedUsername) {
            alert('Паролата не може да бъде същата като потребителското име!');
            return;
        }
        
    
        let isUsernameTaken = false;
    
        const usersSnapshot = await getDocs(collection(FIRESTORE_DB, 'users'));
        for (const doc of usersSnapshot.docs) {
            const userInfoCollectionRef = collection(doc.ref, 'user_info');
            const usernameDoc = await getDocs(userInfoCollectionRef);
            for (const doc of usernameDoc.docs) {
                if (doc.id === 'username') {
                    if (doc.data().username.trim() === trimmedUsername) {
                        alert('Потребителското име е заето!');
                        isUsernameTaken = true;
                        break;
                    }
                }
            }
            if (isUsernameTaken) break;
        }
    
        if (isUsernameTaken) return;
    
        try {
            const after = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, after.user.uid);
            const userInfoCollectionRef = collection(userDocRef, 'user_info');
    
            // add a document inside userInfoCollectionRef and call that document "username"
            await setDoc(doc(userInfoCollectionRef, 'username'), { username: trimmedUsername });

            // save username locally using AsyncStorage
            await AsyncStorage.setItem(`email`, trimmedEmail);
            await AsyncStorage.setItem(`username_${email}`, trimmedUsername);

            // send email verification
            sendEmailVerification(after.user);
            await checkUserDocument(userDocRef, after.user, userInfoCollectionRef);
        } catch(err: any) {
            console.log('error', err)
        }
    }

    const [passwordCharacters, setPasswordCharacters] = useState(65);
    const [confirmPasswordCharacters, setConfirmPasswordCharacters] = useState(65);

    const [registerButtonDisabled, setRegisterButtonDisabled] = useState(false);

    useEffect(() => {

        setPasswordCharacters(65 - password.length);
        setConfirmPasswordCharacters(65 - confirmPassword.length);

        // console log all asyncstorage items
        AsyncStorage.getAllKeys().then(keys => {
            console.log(keys)
            return AsyncStorage.multiGet(keys)
        }).then(keyValue => {
                console.log(keyValue)
        })

        // clear all asyncstorage items
        /*AsyncStorage.clear().then(() => {
            console.log('cleared')
        })*/


    }, [password, confirmPassword])
    
    const { t } = useTranslation();

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={tw`flex-1 mx-5`}>

                    <Text style={tw`text-4xl text-center text-[#fd1c47] font-bold my-2`}>{t('register')}</Text>

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
                                <Text style={tw`font-medium text-gray-600 mb-1 ml-1`}>{t('username')}</Text>
                                <TextInput 
                                    style={tw`h-14 border-2 rounded-lg border-gray-200 px-2`} 
                                    placeholder={t('username')}
                                    onChangeText={(text: string) => setUsername(text)} 
                                    value={username} 
                                    autoCapitalize='none' 
                                    maxLength={22}
                                />
                            </View>

                            <View style={tw`mb-2`}>
                                
                                <View style={tw`flex flex-row justify-between`}>
                                    <Text style={tw`font-medium text-gray-600 mb-1 ml-1`}>{t('password')}</Text>
                                    <Text style={tw`font-medium text-gray-400 mb-1 mr-2`}>{passwordCharacters}</Text>
                                </View>

                                <TextInput 
                                    style={tw`h-14 border-2 rounded-lg border-gray-200 px-2`} 
                                    placeholder={t('password')}
                                    onChangeText={(text: string) => setPassword(text)} 
                                    value={password} 
                                    autoCapitalize='none'
                                    maxLength={65}
                                />
                            </View>

                            <View style={tw`mb-2`}>

                                <View style={tw`flex flex-row justify-between`}>
                                    <Text style={tw`font-medium text-gray-600 mb-1 ml-1`}>{t('confirm-password')}</Text>
                                    <Text style={tw`font-medium text-gray-400 mb-1 mr-2`}>{confirmPasswordCharacters}</Text>
                                </View>

                                <TextInput 
                                    style={tw`h-14 border-2 rounded-lg border-gray-200 px-2`} 
                                    placeholder={t('confirm-password')}
                                    onChangeText={(text: string) => setConfirmPassword(text)} 
                                    value={confirmPassword} 
                                    autoCapitalize='none'
                                    maxLength={65}
                                />
                            </View>
                            
                            <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-lg flex justify-center items-center shadow-md`}
                                onPress={() => {
                                    setRegisterButtonDisabled(true)
                                    signUp()
                                }}>

                                <Text style={tw`text-2xl text-white`}>{t('register')}</Text>

                            </TouchableOpacity>

                        </View>
                    
                    </KeyboardAvoidingView>



                </View>
                
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default Register