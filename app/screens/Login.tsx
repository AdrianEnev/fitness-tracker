import { View, TextInput, KeyboardAvoidingView, Text, TouchableWithoutFeedback, Keyboard, SafeAreaView, TouchableOpacity, Pressable } from 'react-native'
import React, { useContext, useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from "twrnc";
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, doc, getDoc } from 'firebase/firestore';
import { BlurView } from 'expo-blur';


const Login = ({navigation}: any) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(true)

    const {internetConnected, setLoggingIn, setSetupRan, internetSpeed} = useContext(GlobalContext);

    const auth = FIREBASE_AUTH;

    const signIn = async() => {

        setIsLoginButtonDisabled(true)

        if (!internetConnected || internetSpeed < 56) {
            alert(t('unstable-connection'));
            setIsLoginButtonDisabled(false)
            return
        }

        if (email.length <= 0 || password.length <= 0) {
            setIsLoginButtonDisabled(false)
            return;
        }

        const weirdCharPattern = /[^a-zA-Z0-9@#$£€%^&*()"'-/|.,?![]{}+=_~<>¥]/;
        if (weirdCharPattern.test(password)) {
            alert(t('password-no-emojis'));
            setIsLoginButtonDisabled(false)
            return;
        }

        const trimmedEmail = email.trim();

        try{

            const user = await signInWithEmailAndPassword(auth, trimmedEmail, password);
            setLoggingIn(true)

            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, user.user.uid);
            const userInfoCollectionRef = collection(userDocRef, 'user_info');

            await checkForNutrients(trimmedEmail, userInfoCollectionRef);
            await checkForUsername(trimmedEmail, userInfoCollectionRef);

            // save username locally using AsyncStorage
            await AsyncStorage.setItem(`email`, trimmedEmail);

            setLoggingIn(false)
            setIsLoginButtonDisabled(false)

        }catch(err: any){
            alert(t('error'));
        }
        
    }

    // Check asyncstorage for username. This function is used for checkFireBaseForUsername
    const checkForUsername = async (email: any, userInfoCollectionRef: any) => {
        const username = await AsyncStorage.getItem(`username_${email}`)

        if (username) {
            console.log('username already exists')
            return true;
        } else if (!username) {

            console.log('username doesnt exist, checking documents')
            const firebaseUsername = await checkFireBaseForUsername(userInfoCollectionRef);

            if (firebaseUsername) {
                console.log('found firebase username: ', firebaseUsername)

                const usernameToStore = firebaseUsername.username

                if (!usernameToStore) return;
                
                await AsyncStorage.setItem(`username_${email}`, usernameToStore);
                console.log('set username to: ', usernameToStore)
                return true;
            }

            console.log('no firebase username found')
        }

        return false;
    }

    // Check if firebase contains a username, only if asyncstorage doesn't. This is used to retreive the username from firebase if the user is logging in from another device
    const checkFireBaseForUsername = async (userInfoCollectionRef: any) => {
        const usernameDocRef = doc(userInfoCollectionRef, 'username');
        const docSnapshot = await getDoc(usernameDocRef);
    
        console.log('Document Snapshot:', docSnapshot);
        console.log('Document Snapshot Data:', docSnapshot.data());
        console.log('Document Exists:', docSnapshot.exists());
    
        if (docSnapshot.exists()) {
            console.log('Firebase username document found:', docSnapshot.data());

            setSetupRan(true);
            return docSnapshot.data();
        } else {
            console.log('Firebase username document does not exist');
        }
    
        return null;
    }   

    // Check asyncstorage for nutrients. This function is used for checkFirebaseForNutrients
    const checkForNutrients = async (email: any, userInfoCollectionRef: any) => {
        const nutrients = await AsyncStorage.getItem(`goal_nutrients_${email}`);

        console.log('Checking for nutrients -> Step 1')

        if (nutrients) {

            console.log('Nutrients already found, proceeding...')

            return true;
        } else if (!nutrients) {

            console.log('Nutrients not found locally, checking database...')

            const firebaseNutrients = await checkFirebaseForNutrients(userInfoCollectionRef);

            if (firebaseNutrients) {
                console.log('nutrients found in database')

                await AsyncStorage.setItem(`goal_nutrients_${email}`, JSON.stringify(firebaseNutrients));
                console.log("set goal nutrients to: ",  JSON.stringify(firebaseNutrients))
                return true;
            }

            console.log('nutrients not found in database')
        }

        return false;
    }

    // Check if firebase contains nutrients, only if asyncstorage doesn't. This is used to retreive the nutrients from firebase if the user is logging in from another device
    const checkFirebaseForNutrients = async (userInfoCollectionRef: any) => {
        const nutrientsDocRef = doc(userInfoCollectionRef, 'nutrients');

        const docSnapshot = await getDoc(nutrientsDocRef);

        if (docSnapshot.exists()) {
            return docSnapshot.data();
        }

        return null;
    }

    const { t } = useTranslation();

    return (
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

    )
}

export default Login