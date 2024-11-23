import { View, Text, Button, Pressable, Image, Alert, Switch, Vibration, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig'
import tw from 'twrnc'
import { getAuth } from 'firebase/auth'
import deleteAccount  from '../use/useDeleteAccount';
import changePassword from '../use/useChangePassword'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalContext from '../../GlobalContext'
import ProfilePicture from '../components/ProfilePicture'
import { collection, doc, getDoc, getDocs, setDoc, writeBatch } from 'firebase/firestore'
import BottomNavigationBar from '../components/BottomNavigationBar'
import { useTranslation } from 'react-i18next'
import { deleteObject, getStorage, ref } from 'firebase/storage'
import getEmail from '../use/useGetEmail'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { BlurView } from 'expo-blur'
import SyncingInfoModal from '../loadingModals/SyncingInfoModal'
import syncInformation from '../use/useSyncInfo'
import DeletingAccountModal from '../loadingModals/DeletingAccountModal'
import checkUsernameNSFW from '../use/useCheckUsernameNSFW'
import ChangingUsernameModal from '../loadingModals/ChangingUsernameModal'
import SyncingInfoInformationModal from '../modals/SyncInfoInformationModal'
import SyncInfoModal from '../modals/SyncInfoModal'

const SettingsAccount = ({navigation}: any) => {
 
    const { 
        receiveFriendRequests, 
        setReceiveFriendRequests, 
        faceIdEnabled, 
        setFaceIdEnabled, 
        internetConnected,
        setProfilePicture, 
        setSetupRan, 
        setIsAccountDeleted, 
        syncingInfoRunning, 
        setSyncingInfoRunning,
        internetSpeed
    } = useContext(GlobalContext);

    const [changingUsernameRunning, setChangingUsernameRunning] = useState(false);

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

    const changeUsernameForFriends = async (currentUserID: any, newUsername: any) => {
        // go through all users -> userID -> userInfo -> friends and see if anyone has currentUserID as a document there 
        // if they have currentUserID, set that document's username property as newUsername

        try {
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const usersSnapshot = await getDocs(usersCollectionRef);

            const batch = writeBatch(FIRESTORE_DB);

            for (const userDoc of usersSnapshot.docs) {
                const userInfoCollectionRef = collection(userDoc.ref, 'user_info');
                const friendsDocRef = doc(userInfoCollectionRef, 'friends');
                const friendsListCollectionRef = collection(friendsDocRef, 'list');
                const friendDocRef = doc(friendsListCollectionRef, currentUserID);

                const friendDocSnapshot = await getDoc(friendDocRef);

                if (friendDocSnapshot.exists()) {
                    // Update the friend's username
                    batch.update(friendDocRef, { username: newUsername });
                }
            }

            await batch.commit();
            console.log('Successfully updated username for friends');
        } catch (error) {
            console.error("Error updating username for friends:", error);
        }

    }

    const changeUsername = async () => {

        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const userInfoCollectionRef = collection(userDocRef, 'user_info');

        const usernameDocRef = doc(userInfoCollectionRef, 'username');
        // get the date property inside the usernameDocRef and check the difference between the timestamp property and the current date
        const usernameDoc = await getDoc(usernameDocRef);
        const usernameData = usernameDoc.data();
        const date = usernameData?.date?.toDate(); // add a check for undefined date
        const currentDate = new Date();
        const difference = currentDate.getTime() - (date?.getTime() || 0); // use 0 if date is undefined
        const daysDifference = difference / (1000 * 3600 * 24);

        // if 7 days haven't passed since the last username change, alert the user that there is still a cooldown
        if (daysDifference < 7) {
            Alert.alert(
                'Грешка!',
                'Можете да смените потребителското си име отново след ' + (7 - Math.floor(daysDifference)) + ' дни!',
                [
                    {
                        text: 'Разбрах',
                        style: 'cancel',
                    },
                ],
            );

            return
            
        }

        Alert.prompt(
            'Смяна на име',
            'Моля въведи ново потребителско име',
            [
                {
                    text: 'Отказ',
                    style: 'destructive',
                },
                {
                    text: 'Смяна',
                    style: 'default',
                    onPress: async (newUsername: string | undefined) => {

                        if (newUsername) {

                            try {
                                if (await checkUsernameNSFW(newUsername)) {
                                    alert('This username is not allowed!');
                                    return;
                                }
                            } catch (error: any) {
                                // Check if the error message contains the specific model loading error
                                if (error && error.error && error.error.includes('Model facebook/bart-large-mnli is currently loading')) {
                                    alert("Please try again later!");
                                    return;
                                }
                            }
                            
                            setChangingUsernameRunning(true)

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

                            const weirdCharPattern = /[^a-zA-Z0-9@#$£€%^&*()"'-/|.,?![]{}+=_~<>¥]/;
                            if (weirdCharPattern.test(newUsername)) {
                                alert('Името не може да съдържа емоджитa!');
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

                            AsyncStorage.setItem(`username_${await getEmail()}`, trimmedUsername)

                            if (!internetConnected) return;
                        
                            try {
                                const usersCollectionRef = collection(FIRESTORE_DB, 'users');
                                const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
                                const userInfoCollectionRef = collection(userDocRef, 'user_info');
                        
                                // add a document inside userInfoCollectionRef and call that document "username"
                                await setDoc(doc(userInfoCollectionRef, 'username'), { username: trimmedUsername, date: new Date()});
                                setUsername(trimmedUsername);

                                await changeUsernameForFriends(FIREBASE_AUTH.currentUser?.uid, trimmedUsername);
                                
                                setChangingUsernameRunning(false)

                                //alert('Името ви успешно беше сменено на ' + trimmedUsername);
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
                            {(
                                title === t('change-username') && !internetConnected || 
                                title === t('change-password') && !internetConnected || 
                                title === t('delete-account') && !internetConnected || 
                                title === t(`log-out`) && !internetConnected
                            ) && (
                                <Text style={tw`text-gray-500 mb-[8px]`}>Requires Stable Internet</Text>
                            )}
                        </View>
                    </View>
                    
                    {(title != t(`sync-info`) || !syncingInfoRunning) && (
                        <View style={tw`flex justify-center`}>
                            <Ionicons name='chevron-forward' size={24} color='#6b7280' />
                        </View>
                    )}

                    {(title == t(`sync-info`) && syncingInfoRunning) && (
                        <View style={tw`flex justify-center`}>
                            <ActivityIndicator size="small" color="#6b7280"/>
                        </View>
                    )}
                    

                </View>
            </Pressable>
        )
    }



    const [isFaceIdEnabled, setIsFaceIdEnabled] = useState(faceIdEnabled);
    const toggleFaceIdSwitch = async () => {

        setIsFaceIdEnabled(previousState => !previousState)
        setFaceIdEnabled(!isFaceIdEnabled);

        AsyncStorage.setItem(`faceIdEnabled`, String(!isFaceIdEnabled))
        
    };

    const [isReceiveFriendRequestsEnabled, setIsReceiveFriendRequestsEnabled] = useState(receiveFriendRequests);
    const toggleReceiveFriendRequestsSwitch = async () => {

        setIsReceiveFriendRequestsEnabled(previousState => !previousState)
        setReceiveFriendRequests(!isReceiveFriendRequestsEnabled);
        
        AsyncStorage.setItem(`receiveFriendRequests`, String(!isReceiveFriendRequestsEnabled))

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
                            trackColor={{ false: "#ef4444", true: "#4ade80" }}
                            thumbColor={
                                title === t('face-id') ? (isFaceIdEnabled ? "#ffffff" : "#f4f3f4") :
                                title === t('receive-friend-requests') ? (isReceiveFriendRequestsEnabled ? "#ffffff" : "#f4f3f4") : 
                                "#f4f3f4"
                            }
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={
                                title === t('face-id') ? toggleFaceIdSwitch :
                                title === t('receive-friend-requests') ? toggleReceiveFriendRequestsSwitch : 
                                () => {
                                    console.log('Switch button not working');
                                }
                            }
                            value=
                            {
                                title === t('face-id') ? isFaceIdEnabled :
                                title === t('receive-friend-requests') ? isReceiveFriendRequestsEnabled : 
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

    const [username, setUsername] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null)

    const getUsername = async () => {
        const email = await getEmail()

        const AsyncStorageUsername = await AsyncStorage.getItem(`username_${email}`);
        setUsername(AsyncStorageUsername);
    }

    useEffect(()=> {
        getUsername();
        
        const fetch = async () => {
            const AsyncStorageEmail = await getEmail();
            setEmail(AsyncStorageEmail)
        }

        fetch();

    }, [])

    const syncInfo = async () => {
        if (syncingInfoRunning) return;
    
        setSyncingInfoRunning(true);
        setIsSyncingInfoModalVisible(true);
    
        try {
            await syncInformation();
        } catch (error) {
            console.error("Sync information failed", error);
        } finally {
            setIsSyncingInfoModalVisible(false);
            setTimeout(() => {
                setIsSyncInfoModalVisible(false);
                setSyncingInfoRunning(false);
            }, 10); // 100 milliseconds delay
        }
    };

    const [isSyncInfoModalVisible, setIsSyncInfoModalVisible] = useState(false)
    const [isSyncingInfoModalVisible, setIsSyncingInfoModalVisible] = useState(false)
    const [isSyncingInfoInformationModalVisible, setIsSyncingInfoInformationModalVisible] = useState(false)
    const [isDeletingAccountModalVisible, setIsDeletingAccountModalVisible] = useState(false)

    return (
        <>

            {(isSyncingInfoModalVisible || isDeletingAccountModalVisible || changingUsernameRunning || isSyncingInfoInformationModalVisible || isSyncInfoModalVisible) && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <SafeAreaView style={tw`w-full h-full bg-white`}>

                <SyncInfoModal
                    isSyncInfoModalVisible={isSyncInfoModalVisible}
                    setIsSyncInfoModalVisible={setIsSyncInfoModalVisible}
                    setIsSyncingInfoInformationModalVisible={setIsSyncingInfoInformationModalVisible}
                    syncInfo={syncInfo}
                />

                <SyncingInfoInformationModal
                    isSyncingInfoInformationModalVisible={isSyncingInfoInformationModalVisible}
                    setIsSyncingInfoInformationModalVisible={setIsSyncingInfoInformationModalVisible}
                    setIsSyncInfoModalVisible={setIsSyncInfoModalVisible}
                />

                <SyncingInfoModal
                    isSyncingInfoModalVisible={isSyncingInfoModalVisible}
                    setIsSyncingInfoModalVisible={setIsSyncingInfoModalVisible}
                />

                <DeletingAccountModal
                    isDeletingAccountModalVisible={isDeletingAccountModalVisible}
                    setIsDeletingAccountModalVisible={setIsDeletingAccountModalVisible}
                />

                <ChangingUsernameModal
                    isChangingUsernameModalVisible={changingUsernameRunning}
                    setIsChangingUsernameModalVisible={setChangingUsernameRunning}
                />

                <View style={tw`h-full pt-2`}>

                    {/* Profile Picture + Username + Email */}
                    <View style={tw`w-full flex flex-row mb-3`}>

                        <ProfilePicture page='SettingsAccount'/>

                        <View style={tw`flex flex-col justify-center ml-2`}>

                            <Text style={tw`text-xl font-medium`}>{username}</Text>
                            <Text style={tw`text-base text-gray-500`}>{email}</Text>

                        </View>

                    </View>

                    {/* Seperator */}
                    <View style={tw`h-[2px] w-[94%] bg-gray-300 rounded-full mx-2`}></View>

                    {/* Icons */}
                    {button(t('change-username'), 'text-outline', 'yellow-300', '#eab308', 24, () => {
                        if (internetConnected) {
                            changeUsername()
                        }else{
                            Vibration.vibrate()
                        }
                    })}



                    {button(t('change-password'), 'create-outline', 'green-300', '#22c55e', 26, () => {
                        
                        if (internetConnected) {
                            const auth = getAuth();
                            const user = auth.currentUser;
                            changePassword(email, user, auth)
                        }else{
                            Vibration.vibrate()
                        }
                        
                    })}
                    {button(t('log-out'), 'log-out-outline', 'blue-300', '#3b82f6', 28, () => {
                        if (internetConnected) {
                            logOut()
                        }else{
                            Vibration.vibrate()
                        }
                    })}
                    {button(t('delete-account'), 'close-outline', 'red-300', '#ef4444', 34, () => {

                        if (internetConnected && internetSpeed > 32) {
                            const auth = getAuth();
                            const user = auth.currentUser;
                            
                            deleteAccount(email, user, setProfilePicture, setSetupRan, setIsAccountDeleted, setIsSyncingInfoModalVisible)
                            
                        }else{
                            alert("Unstable or no internet connection!")
                            Vibration.vibrate()
                        }
                        
                    })}
                    {button(t('sync-info'), 'sync-outline', 'indigo-300', '#4f46e5', 34, async () => {

                       setIsSyncInfoModalVisible(true)
                        
                    })}

                    {switchButton(t('face-id'), 'eye-outline', 'orange-300', '#d97706', 30)}
                    {switchButton(t('receive-friend-requests'), 'notifications-outline', 'purple-300', '#8b5cf6', 24)}
                    

                </View>

                <BottomNavigationBar currentPage='Settings' navigation={navigation}/>

            </SafeAreaView>
        </>
    )
}

export default SettingsAccount