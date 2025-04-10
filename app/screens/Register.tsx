import { View, TextInput, Button, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '@config/firebaseConfig';
import tw from "twrnc";
import { useTranslation } from 'react-i18next';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import GlobalContext from '@config/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import checkUsernameNSFW from '@use/settings/check/useCheckUsernameNSFW';
import Ionicons from '@expo/vector-icons/Ionicons';
import checkIsAccountLimitReached from '@use/settings/check/useCheckAccountLimitReached';
import { BlurView } from 'expo-blur';
import LoadingModal from '@modals/loading/LoadingModal';

const Register = ({navigation}: any) => {

    const { t } = useTranslation();

    const {internetConnected, setIsAccountDeleted, internetSpeed, setAccountJustRegistered} = useContext(GlobalContext);

    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordCharacters, setPasswordCharacters] = useState(65);
    const [confirmPasswordCharacters, setConfirmPasswordCharacters] = useState(65);

    const [registerButtonDisabled, setRegisterButtonDisabled] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState('')
    const [confirmPasswordStrength, setConfirmPasswordStrength] = useState('')

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)

    const auth = FIREBASE_AUTH;

    const signUp = async() => {

        if (!internetConnected || internetSpeed < 16) {
            alert(t('unstable-connection'));
            return;
        }
        
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();
    
        if (trimmedEmail.length == 0 || password.length == 0 || confirmPassword.length == 0 || trimmedUsername.length == 0) {    
            setRegisterButtonDisabled(false)
            return;
        }

        const weirdCharPattern = /[^a-zA-Z0-9@#$£€%^&*()"'-/|.,?![]{}+=_~<>¥]/;
        if (weirdCharPattern.test(password)) {
            alert(t('password-no-emojis'));
            setRegisterButtonDisabled(false)
            return;
        }
        if (password !== confirmPassword) {
            alert(t('passwords-not-match'));
            setRegisterButtonDisabled(false)
            return;
        }
        if (trimmedUsername.length <= 2) {
            alert(t('username-at-least-three-symbols'));
            setRegisterButtonDisabled(false)
            return;
        } 
        if (password.length <= 8) {
            alert(t('password-at-least-eight-symbols'));
            setRegisterButtonDisabled(false)
            return;
        }
        if (password === trimmedUsername) {
            alert(t('password-not-same-as-username'));
            setRegisterButtonDisabled(false)
            return;
        }

        if (await checkIsAccountLimitReached()) {
            alert(t('max-number-accounts-device'));
            setRegisterButtonDisabled(false)
            return;
        }    
        
        if (await checkUsernameNSFW(trimmedUsername)) {
            alert(t('nsfw-username'));
            setRegisterButtonDisabled(false)
            return;
        }
    
        if (await isUsernameTaken(trimmedUsername)) {
            alert(t('username-taken'));
            setRegisterButtonDisabled(false)
            return;
        }
    
        try {
            const after = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
            setIsAccountDeleted(false);

            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, after.user.uid);

            await setDoc(userDocRef, { lungeCoins: 1, lastGeneratedWorkout: null }, { merge: false });

            await AsyncStorage.setItem(`email`, trimmedEmail);
            await AsyncStorage.setItem(`username_${email}`, trimmedUsername);

            // send email verification
            await sendEmailVerification(after.user);
            setAccountJustRegistered(true)
            navigation.navigate('Непотвърден-Имейл')

        } catch(err: any) {
            console.log('error', err)
        }
    }

    const isUsernameTaken = async (trimmedUsername: any) => {
        const usersSnapshot = await getDocs(collection(FIRESTORE_DB, 'users'));

        for (const doc of usersSnapshot.docs) {
            const userInfoCollectionRef = collection(doc.ref, 'user_info');
            const usernameDoc = await getDocs(userInfoCollectionRef);

            for (const user of usernameDoc.docs) {
                if (user.id === 'username' && user.data().username.trim() === trimmedUsername) {
                    return true; // Username is taken
                }
            }
        }

        return false; 
    }

    const checkPasswordStrength = (password: string): string => {

        if (password.length <= 8) {
            return t('weak');
        }
        if (password.length <= 12) {
            let hasNumber = /\d/.test(password);
            let hasSpecialChar = /[^A-Za-z0-9]/.test(password);
            if (hasNumber && hasSpecialChar) {
                return t('strong');
            } else if (hasNumber || hasSpecialChar) {
                return t('decent');
            } else {
                return t('weak');
            }
        }
        if (password.length > 12) {
            let hasNumber = /\d/.test(password);
            let hasSpecialChar = /[^A-Za-z0-9]/.test(password);
            if (hasNumber && hasSpecialChar) {
                return t('very-strong');
            } else if (hasNumber || hasSpecialChar) {
                return t('good');
            } else {
                return t('decent');
            }
        }
        return t('weak');
    }

    useEffect(() => {

        setPasswordCharacters(65 - password.length);
        setConfirmPasswordCharacters(65 - confirmPassword.length);

        const strength = checkPasswordStrength(password);
        setPasswordStrength(strength)
        
        const confirmStrenght = checkPasswordStrength(confirmPassword);
        setConfirmPasswordStrength(confirmStrenght)

    }, [password, confirmPassword])
    
    return (
        <>
            {registerButtonDisabled && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <LoadingModal
                isLoadingModalVisible={registerButtonDisabled}
                setIsLoadingModalVisible={setRegisterButtonDisabled}
            />

            <SafeAreaView style={tw`bg-white flex-1`}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={tw`p-5 `}>

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

                                        <Text style={tw`font-medium text-gray-600 mb-1 ml-1`}>
                                            {t('password')} <Text style={tw`${passwordStrength == "weak" ? "text-red-500" : 
                                                passwordStrength == t('decent') ? "text-yellow-500" : 
                                                passwordStrength == t('good') ? "text-orange-500" : 
                                                passwordStrength == t('strong') ? "text-green-500" : 
                                                passwordStrength == t('very-strong') ? "text-blue-500" : 
                                                ""
                                            }`}>{password.length > 0 ? '(' + passwordStrength + ')' : ''}
                                        </Text></Text>

                                        <Text style={tw`font-medium text-gray-400 mb-1 mr-2`}>{passwordCharacters}</Text>
                                    </View>

                                    <TextInput 
                                        style={tw`h-14 border-2 rounded-lg border-gray-200 px-2`} 
                                        placeholder={t('password')}
                                        onChangeText={(text: string) => setPassword(text)} 
                                        value={password} 
                                        autoCapitalize='none'
                                        maxLength={65}
                                        secureTextEntry={!isPasswordVisible}
                                    />

                                    <View style={tw`absolute right-2 bottom-[12px]`}>
                                        {isPasswordVisible ? 
                                            (
                                                <Ionicons name='eye-outline' size={32} color="#fd3e6b" onPress={() => setIsPasswordVisible(false)}/>
                                            ) : 
                                            (
                                                <Ionicons name='eye-off-outline' size={32} color="#fd3e6b" onPress={() => setIsPasswordVisible(true)}/>

                                            )
                                        }
                                    </View>
                                </View>

                                <View style={tw`mb-2`}>

                                    <View style={tw`flex flex-row justify-between`}>
                                        <Text style={tw`font-medium text-gray-600 mb-1 ml-1`}>
                                            {t('confirm-password')} <Text style={tw`${confirmPasswordStrength == "weak" ? "text-red-500" : 
                                                confirmPasswordStrength == t('decent') ? "text-yellow-500" : 
                                                confirmPasswordStrength == t('good') ? "text-orange-500" : 
                                                confirmPasswordStrength == t('strong') ? "text-green-500" : 
                                                confirmPasswordStrength == t('very-strong') ? "text-blue-500" : 
                                                ""
                                            }`}>{confirmPassword.length > 0 ? '(' + confirmPasswordStrength + ')' : ''}
                                        </Text></Text>

                                        <Text style={tw`font-medium text-gray-400 mb-1 mr-2`}>{confirmPasswordCharacters}</Text>
                                    </View>

                                    <TextInput 
                                        style={tw`h-14 border-2 rounded-lg border-gray-200 px-2`} 
                                        placeholder={t('confirm-password')}
                                        onChangeText={(text: string) => setConfirmPassword(text)} 
                                        value={confirmPassword} 
                                        autoCapitalize='none'
                                        maxLength={65}
                                        secureTextEntry={!isConfirmPasswordVisible}
                                    />

                                    <View style={tw`absolute right-2 bottom-[12px]`}>
                                        {isConfirmPasswordVisible ? 
                                            (
                                                <Ionicons name='eye-outline' size={32} color="#fd3e6b" onPress={() => setIsConfirmPasswordVisible(false)}/>
                                            ) : 
                                            (
                                                <Ionicons name='eye-off-outline' size={32} color="#fd3e6b" onPress={() => setIsConfirmPasswordVisible(true)}/>

                                            )
                                        }
                                    </View>
                                </View>
                                
                                <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-lg flex justify-center items-center shadow-md`}
                                    onPress={() => {
                                        setRegisterButtonDisabled(true)
                                        signUp()
                                    }} disabled={registerButtonDisabled}>

                                    <Text style={tw`text-2xl text-white font-semibold`}>{t('register')}</Text>

                                </TouchableOpacity>

                            </View>
                        
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </>
    )
}

export default Register