import { View, TextInput, Button, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from "twrnc";
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';

const Register = () => {

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const auth = FIREBASE_AUTH;

    const signUp = async() => {
        
        const trimmedUsername = username.trim();
    
        if (email.length <= 0 || password.length <= 0 || confirmPassword.length <= 0 || trimmedUsername.length <= 0) {    
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
            const after = await createUserWithEmailAndPassword(auth, email, password);
    
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, after.user.uid);
            const userInfoCollectionRef = collection(userDocRef, 'user_info');
    
            // add a document inside userInfoCollectionRef and call that document "username"
            await setDoc(doc(userInfoCollectionRef, 'username'), { username: trimmedUsername });
        } catch(err: any) {
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
                            <TextInput style={tw`bg-white h-10 pl-2 rounded-lg`} placeholder="Потребителско име" onChangeText={(text: string) => setUsername(text)} value={username} autoCapitalize='none' maxLength={22}/>
                            <TextInput style={tw`bg-white h-10 pl-2 rounded-lg`} placeholder="Имейл" onChangeText={(text: string) => setEmail(text)} value={email} autoCapitalize='none'/>
                            <TextInput style={tw`bg-white h-10 pl-2 rounded-lg`} textContentType='password' placeholder="Парола" onChangeText={(text: string) => setPassword(text)} value={password} autoCapitalize='none'/>
                            <TextInput style={tw`bg-white h-10 pl-2 rounded-lg`} textContentType='password' placeholder="Потвърди парола" onChangeText={(text: string) => setConfirmPassword(text)} value={confirmPassword} autoCapitalize='none'/>
                            
                            <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-2xl flex justify-center items-center shadow-md mt-1`}
                                onPress={signUp}>

                                <Text style={tw`text-2xl text-white`}>Регистрация</Text>

                            </TouchableOpacity>
                        </View>
                    
                    </KeyboardAvoidingView>



                </View>
                
            </TouchableWithoutFeedback>
        </SafeAreaView>
    )
}

export default Register