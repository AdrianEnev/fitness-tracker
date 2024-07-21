import { View, Text, Button, Pressable, Image, Alert, Switch } from 'react-native'
import React, { useContext, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig'
import tw from 'twrnc'
import { getAuth } from 'firebase/auth'
import deleteAccount  from '../use/useDeleteAccount';
import changePassword from '../use/useChangePassword'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalContext from '../../GlobalContext'
import ProfilePicture from '../components/ProfilePicture'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import BottomNavigationBar from '../components/BottomNavigationBar'
import { useTranslation } from 'react-i18next'
import { deleteObject, getStorage, ref } from 'firebase/storage'

const SettingsAccount = ({navigation}: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');

    const auth = getAuth();
    const user = auth.currentUser;
    const email = user?.email;

    const { username, setUsername, receiveFriendRequests, setReceiveFriendRequests, faceIdEnabled, setFaceIdEnabled } = useContext(GlobalContext);

    const logOut = () => {

        // add confirmation alert before logging out
        Alert.alert(
            'Излизане от Акаунт',
            'Сигурен ли си, че искаш да излезеш от този акаунт?',
            [
                {
                    text: 'Отказ',
                    style: 'cancel',
                },
                {
                    text: 'Напред',
                    style: 'destructive',
                    onPress: () => {
                        FIREBASE_AUTH.signOut();
                    },
                },
            ],
        );

    }

    const changeUsername = async () => {
        Alert.prompt(
            'Смяна на име',
            'Моля въведи ново потребителско име',
            [
                {
                    text: 'Отказ',
                    style: 'default',
                },
                {
                    text: 'Смяна',
                    style: 'default',
                    onPress: async (newUsername: string | undefined) => {

                        if (newUsername) {

                            const trimmedUsername = newUsername.trim();
                            console.log(trimmedUsername);

                            if (newUsername.length <= 2) {
                                alert('Потребителското име трябва да съдържа поне 3 символа!');
                                return;
                            } 

                            if (newUsername == username) {
                                alert('Потребителското име не може да бъде същото като предишното!');
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
                                const usersCollectionRef = collection(FIRESTORE_DB, 'users');
                                const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
                                const userInfoCollectionRef = collection(userDocRef, 'user_info');


                                // check if there is a 7 day difference between the current date and the date inside the database and if so, alert the user that there is still a cooldown
                        
                                // add a document inside userInfoCollectionRef and call that document "username"
                                await setDoc(doc(userInfoCollectionRef, 'username'), { username: trimmedUsername, date: new Date()});
                                setUsername(trimmedUsername);

                                alert('Името ви успешно беше сменено на ' + trimmedUsername);
                            } catch(err: any) {
                                alert(err);
                            }

                        }
                        
                        
                    },
                },
            ],
            'plain-text',
        );
    }

    const button = (title: any, icon: any, background: string, iconColor: any, iconSize: number, action: any) => {
        return (
            <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={action}>
                <View style={tw`flex flex-row justify-between`}>

                    <View style={tw`flex flex-row`}>
                        <View style={tw`w-10 h-10 bg-${background} rounded-full flex items-center justify-center mr-2`}>
                            <Ionicons name={icon} size={iconSize} color={iconColor} />
                        </View>
                        
                        <View style={tw`flex justify-center`}>
                            <Text style={tw`text-lg font-medium`}>{title}</Text>
                        </View>
                    </View>

                    <View style={tw`flex justify-center`}>
                        <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                    </View>

                </View>
            </Pressable>
        )
    }

    const [isFaceIdEnabled, setIsFaceIdEnabled] = useState(faceIdEnabled);
    const toggleFaceIdSwitch = async () => {
        setIsFaceIdEnabled(previousState => !previousState)
        setFaceIdEnabled(!isFaceIdEnabled);

        await setDoc(doc(userInfoCollectionRef, 'faceIdEnabled'), { faceIdEnabled: !isFaceIdEnabled });
    };

    const [isReceiveFriendRequestsEnabled, setIsReceiveFriendRequestsEnabled] = useState(receiveFriendRequests);
    const toggleReceiveFriendRequestsSwitch = async () => {
        setIsReceiveFriendRequestsEnabled(previousState => !previousState)
        setReceiveFriendRequests(!isReceiveFriendRequestsEnabled);
        
        await setDoc(doc(userInfoCollectionRef, 'receiveFriendRequests'), { receiveFriendRequests: !isReceiveFriendRequestsEnabled });

    };


    const switchButton = (title: any, icon: any, background: string, iconColor: any, iconSize: number) => {
        return (
            <View style={tw`w-full h-14 bg-white p-3 mb-1`}>
                <View style={tw`flex flex-row justify-between`}>

                    <View style={tw`flex flex-row`}>
                        <View style={tw`w-10 h-10 bg-${background} rounded-full flex items-center justify-center mr-2`}>
                            <Ionicons name={icon} size={iconSize} color={iconColor} />
                        </View>
                        
                        <View style={tw`flex justify-center`}>
                            <Text style={tw`text-lg font-medium`}>{title}</Text>
                        </View>
                    </View>

                    <View style={tw`flex justify-center`}>
                        <Switch
                            trackColor={{ false: "#ef4444", true: "#81b0ff" }}
                            thumbColor={
                                title === 'face-id' ? (isFaceIdEnabled ? "#f5dd4b" : "#f4f3f4") :
                                title === 'receive-friend-requests' ? (isReceiveFriendRequestsEnabled ? "#f5dd4b" : "#f4f3f4") : 
                                "#f4f3f4"
                            }
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={
                                title === 'face-id' ? toggleFaceIdSwitch :
                                title === 'receive-friend-requests' ? toggleReceiveFriendRequestsSwitch : 
                                () => {
                                    console.log('Switch button not working');
                                }
                            }
                            value=
                            {
                                title === 'face-id' ? isFaceIdEnabled :
                                title === 'receive-friend-requests' ? isReceiveFriendRequestsEnabled : 
                                false
                            }
                        />
                    </View>

                </View>
            </View>
        )
    }

    const {t} = useTranslation();

    //{switchButton('2FA', 'lock-closed-outline', 'green-300', '#22c55e', 24)}

    return (
        <SafeAreaView style={tw`w-full h-full bg-white`}>

            <View style={tw`h-full pt-2`}>

                {/* Profile Picture + Username + Email */}
                <View style={tw`w-full flex flex-row mb-3`}>

                    <ProfilePicture page='SettingsAccount'/>

                    <View style={tw`flex flex-col justify-center ml-2`}>

                        <Text style={tw`text-xl font-medium`}>{username}</Text>
                        <Text style={tw`text-base text-gray-500`}>{FIREBASE_AUTH.currentUser?.email}</Text>

                    </View>

                </View>

                {/* Seperator */}
                <View style={tw`h-[2px] w-[94%] bg-gray-300 rounded-full mx-2`}></View>

                {/* Icons */}
                {button(t('change-username'), 'text-outline', 'yellow-300', '#eab308', 24, () => changeUsername())}
                {button(t('change-password'), 'create-outline', 'green-300', '#22c55e', 26, () => changePassword(email, user, auth))}
                {button(t('log-out'), 'log-out-outline', 'blue-300', '#3b82f6', 28, () => logOut())}
                {button(t('delete-account'), 'close-outline', 'red-300', '#ef4444', 34, () => deleteAccount(email, user))}

                {switchButton('face-id', 'eye-outline', 'blue-300', '#3b82f6', 30)}
                {switchButton('receive-friend-requests', 'notifications-outline', 'purple-300', '#8b5cf6', 24)}
                

            </View>

            <BottomNavigationBar currentPage='Settings' navigation={navigation}/>

        </SafeAreaView>
    )
}

export default SettingsAccount