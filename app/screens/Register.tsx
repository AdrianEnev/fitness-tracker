import { View, TextInput, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { FIREBASE_AUTH } from '@config/firebaseConfig';
import tw from "twrnc";
import { useTranslation } from 'react-i18next';
import GlobalContext from '@config/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import LoadingModal from '@modals/loading/LoadingModal';
import validateCredentials from '@app/use/settings/useValidateCredentials';
import reauthenticateAndDelete from '@app/use/settings/remove/useDeleteAccount';

const Register = ({navigation}: any) => {

    const { t } = useTranslation();

    const {internetConnected, setIsAccountDeleted, internetSpeed, setAccountJustRegistered, setSetupRan} = useContext(GlobalContext);

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

    // Used to check if the username is taken and set all neccessary documents once the user is registered
    // Returns 'success' if everything went smoothly
    // Returns 'username-taken' if the username is taken
    // Returns 'error' if there were any errors
    const fetchRegistration = async(newUser: any) => {
        try {
            const response = await fetch(`http://localhost:3000/api/users/registerUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Specifies the request body is JSON
                },
                body: JSON.stringify({
                    username: username,
                    newUser: newUser
                }),
            });

            if (!response.ok) {
                console.error("Error fetching data:", response.statusText);
                return null;
            }

            const data = await response.json();

            if (data.message == 'username-taken') {
                return 'username-taken';
            }

            if (data.message == 'error') {
                return 'error';
            }

            if (data.message != 'success'){
                return 'error';
            }

            return 'success';
        } catch (error) {
            console.error("Error fetching data:", error);
            return 'error';
        }
    }

    // After fetching to database, unverified account is deleted if any error is returned;
    const deleteUnverifiedAccount = async () => {
        const isVerified = false

        await reauthenticateAndDelete(setSetupRan, setIsAccountDeleted, isVerified, undefined, undefined);                    
    }

    const createUnverifiedUser = async (trimmedEmail: string) => {
        try {

            const newUser = await createUserWithEmailAndPassword(FIREBASE_AUTH, trimmedEmail, password);
            return newUser;

        }catch (error: any){
            console.log('Error creating unverified user, user probably already exists', error)
        }
    }

    // Sign up user by first validating credentials, then fetching to the database to finish registration
    const signUp = async() => {

        if (!internetConnected || internetSpeed < 16) {
            alert(t('unstable-connection'));
            return;
        }

        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim();

        console.log('Validating credentials...')
        await validateCredentials(trimmedUsername, trimmedEmail, password, confirmPassword, t, setRegisterButtonDisabled);

        // Credentials are stored early on purpose since deleting an account requires reauthentication
        console.log('Storing credentials...')
        await AsyncStorage.setItem(`email`, trimmedEmail);
        await AsyncStorage.setItem(`username_${email}`, trimmedUsername);

        console.log('Creating unverified user...')
        const newUser = await createUnverifiedUser(trimmedEmail);
        if (!newUser) {
            alert(t('error'));
            setRegisterButtonDisabled(false)
            return;
        }

        console.log('Fetching registration...')
        // Fecth registration to backend
        const result = await fetchRegistration(newUser.user);

        console.log('Checking registration result...')

        if (result == 'username-taken') {

            console.log('Username taken')
            await deleteUnverifiedAccount();
            
            alert(t('username-taken'));
            setRegisterButtonDisabled(false);
            
            return;
        }

        if (result == 'error') {
            
            console.log('Registration failed')
            await deleteUnverifiedAccount();

            alert(t('error'));
            setRegisterButtonDisabled(false);

            return;
        }

        if (result != 'success') {

            console.log('Registration failed')
            await deleteUnverifiedAccount();
            
            alert(t('error'));
            setRegisterButtonDisabled(false);

            return;
        }

        // send email verification
        await sendEmailVerification(newUser.user);
        setIsAccountDeleted(false);
        setAccountJustRegistered(true);

        navigation.navigate('Email-Not-Verified')

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