import { View, TextInput, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '@config/firebaseConfig';
import tw from "twrnc";
import { useTranslation } from 'react-i18next';
import GlobalContext from '@config/GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import validateCredentialsLogin from '@app/use/settings/useValidateCredentialsLogin';
import { BlurView } from 'expo-blur';
import LoadingModal from '@app/modals/loading/LoadingModal';

const Login = ({navigation}: any) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false)

    const {internetConnected, setLoggingIn, setSetupRan, internetSpeed} = useContext(GlobalContext);
    const { t } = useTranslation();

    const auth = FIREBASE_AUTH;

    const signInUser = async (trimmedEmail: string, trimmedPassword: string) => {
        try {
            const user = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
            return user;
        }catch (error: any) {
            console.log('error signing user in with firebase');
            return null;
        }
    }

    const fetchLogin = async (user: any, trimmedEmail: string) => {

        const userId = user.user.uid;

        const response = await fetch(`http://localhost:3000/api/users/${userId}/loginUser`);

        if (!response.ok) {
            console.error("response ERROR retreiving username and nutrients:", response);

            // Unlog user if firebase fetching failed
            await auth.signOut();

            alert(t('error'));
            setIsLoginButtonDisabled(false);
            setLoggingIn(false);
            return null;

        }

        const data = await response.json();
        const firebaseNutrients = data.nutrients;
        const firebaseUsername = data.username;

        if (firebaseNutrients) {
            if (typeof firebaseNutrients === 'string') {
                await AsyncStorage.setItem(`goal_nutrients_${trimmedEmail}`, firebaseNutrients);
            } else {
                await AsyncStorage.setItem(`goal_nutrients_${trimmedEmail}`, JSON.stringify(firebaseNutrients));
            }
        }else{
            setSetupRan(false);
        }

        if (firebaseUsername) {
            await AsyncStorage.setItem(`username_${trimmedEmail}`, firebaseUsername);
        }

    }

    const signIn = async() => {
        //console.log('Signing in...')

        if (isLoginButtonDisabled) return;
        
        if (!internetConnected || internetSpeed < 56) {
            alert(t('unstable-connection'));
            setIsLoginButtonDisabled(false);
            return
        }

        setLoggingIn(true);
        setIsLoginButtonDisabled(true);

        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();

        //console.log('Validating credentials...')
        if (!(await validateCredentialsLogin(trimmedEmail, trimmedPassword, t, setIsLoginButtonDisabled, setIsLoginButtonDisabled))) {
            setLoggingIn(false);
            setIsLoginButtonDisabled(false);
            return;
        }

        // save email locally, instead of calling firebase every time it's needed
        await AsyncStorage.setItem(`email`, trimmedEmail);

        // Authenticate user using firebase auth
        //console.log('Signing in user using firebase auth')
        const user = await signInUser(trimmedEmail, trimmedPassword)
        
        if (!user) {
            alert(t('invalid-credentials'));
            setIsLoginButtonDisabled(false);
            setLoggingIn(false);
            return;
        }

        // Fetch login, if signUserIn did not return an error
        // Executes any neccessary actions in the database
        //console.log('Fetching login request')
        try{
            await fetchLogin(user, trimmedEmail);
        }catch(err: any){

            //console.log('error fetching login request')

            // Unlog user if firebase fetching failed
            await auth.signOut();

            alert(t('error'));
            setIsLoginButtonDisabled(false);
            setLoggingIn(false);
            return;
        }

        setIsLoginButtonDisabled(false);
        setLoggingIn(false);
    }

    return (
        <>

            { isLoginButtonDisabled && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <LoadingModal
                isLoadingModalVisible={isLoginButtonDisabled}
                setIsLoadingModalVisible={setIsLoginButtonDisabled}
            />

            <SafeAreaView style={tw`flex-1 bg-white`}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={tw`p-5`}>

                        <Text style={tw`text-4xl text-center text-[#fd1c47] font-bold my-2`}>{t('login')}</Text>

                        <KeyboardAvoidingView behavior='padding'>
                            
                            <View style={tw`flex-col gap-y-2 my-5`}>
                            
                                <View style={tw`mb-2`}>
                                    <Text style={tw`font-medium text-gray-600 mb-1 ml-1`}>{t('email')}</Text>
                                    <TextInput 
                                        style={tw`h-14 border-2 rounded-lg border-gray-200 px-2 font-medium`} 
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
                                        style={tw`h-14 border-2 rounded-lg border-gray-200 px-2 font-medium`} 
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
                                        <Text style={tw`font-semibold text-gray-500`}>{t('forgot-password')}</Text>
                                    </Pressable>
                                </View>
                                
                                <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-lg flex justify-center items-center shadow-md`}
                                    onPress={signIn}>
                                    <Text style={tw`text-2xl text-white font-semibold`}>{t('login')}</Text>
                                </TouchableOpacity>
                                    
                            </View>
                        
                        </KeyboardAvoidingView>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </>
    )
}

export default Login