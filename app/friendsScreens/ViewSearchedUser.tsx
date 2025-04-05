import { View, Text, SafeAreaView, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import sendFriendRequest from '../useFriends/useSendFriendRequest'
import tw from 'twrnc'
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { collection, doc, getDoc, getDocs, Timestamp } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig';
import deleteFriendRequest from '../useFriends/useDeleteFriendRequest'
import acceptFriendRequest from '../useFriends/useAcceptFriendRequest';
import declineFriendRequest from '../useFriends/useDeclineFriendRequest';
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';

const ViewSearchedUser = ({route, navigation}: any) => {

    const {friend, page} = route.params;

    const {iphoneModel} = useContext(GlobalContext);

    const {t} = useTranslation();

    const [profilePicture, setProfilePicture] = useState('')
    const [friendRequestButtonDisabled, setFriendRequestButtonDisabled] = useState(false);
    const [cancellingFriendRequestButtonDisabled, setCancellingFriendRequestButtonDisabled] = useState(false);
    const [acceptingFriendRequestButtonDisabled, setAcceptingFriendRequestButtonDisabled] = useState(false);
    const [decliningFriendRequestButtonDisabled, setDecliningFriendRequestButtonDisabled] = useState(false);

    const getProfilePicture = async () => {
        const storage = getStorage();
        const profilePictureRef = ref(storage, `users/${friend.id}/profile_picture`);

        try {
            const downloadURL = await getDownloadURL(profilePictureRef);
            setProfilePicture(downloadURL);
        } catch (error) {
            //console.log('Error getting profile picture:', error);
        }
    }

    const [workoutsCompleted, setWorkoutsCompleted] = useState(0);
    const [dateJoined, setDateJoined] = useState<string>('')

    const [usersCollectionRefState, setUsersCollectionRefState] = useState<any>(null)

    // Not yet implemented
    const [isUserPremium, setIsUserPremium] = useState(false);
    
    useEffect(() => {
        getProfilePicture();

        const getUserInfo = async () => {

            // users collection ref not initialized yet
            if (!usersCollectionRefState) {
                const usersCollectionRef = collection(FIRESTORE_DB, 'users');
                const userDocRef = doc(usersCollectionRef, friend.id); 
                const workoutsCollectionRef = collection(userDocRef, 'saved_workouts');

                setUsersCollectionRefState(usersCollectionRef)

                try {
                    const workoutsSnapshot = await getDocs(workoutsCollectionRef);
                    setWorkoutsCompleted(workoutsSnapshot.size);
    
                    // Get registration date from user document
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        const registrationTimestamp = userDocSnapshot.data().registrationDate;
                        if (registrationTimestamp instanceof Timestamp) {
                            const formattedDate = formatDateJoined(registrationTimestamp.toDate())
    
                            setDateJoined(formattedDate);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }

            // use the already initialized variable to save time
            }else{

                const userDocRef = doc(usersCollectionRefState, friend.id); 
                const workoutsCollectionRef = collection(userDocRef, 'saved_workouts');

                setUsersCollectionRefState(usersCollectionRefState)

                try {
                    const workoutsSnapshot = await getDocs(workoutsCollectionRef);
                    setWorkoutsCompleted(workoutsSnapshot.size);
    
                    // Get registration date from user document
                    const userDocSnapshot = await getDoc(userDocRef);
                    if (userDocSnapshot.exists()) {
                        const registrationTimestamp = userDocSnapshot.data().registrationDate;
                        if (registrationTimestamp instanceof Timestamp) {
                            const formattedDate = formatDateJoined(registrationTimestamp.toDate())
    
                            setDateJoined(formattedDate);
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        getUserInfo();
    }, []);

    const formatDateJoined = (date: any) => {
        if (date) {
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        }
        return 'unknown'; // Or any other placeholder you prefer
    }

    const ActivityIndicator = () => {
        return (
            <View>
                <ActivityIndicator />
            </View>
        )
    }

    const acceptRequest = async () => {}
    const declineRequest = async () => {}

    return (
        <>
            <SafeAreaView style={tw`w-full h-full flex items-center justify-center`}>
                <View style={tw`w-[80%] h-[30%] mb-8 bg-white shadow-md rounded-xl flex pt-2`}>

                    <View style={tw`w-full flex flex-row mb-3`}>

                        {profilePicture === '' ? 
                        (<View 
                            style={tw`bg-white w-22 h-22 rounded-full flex items-center justify-center border-2 border-gray-200 ml-2`}>
                            <Ionicons name='person-outline' 
                                size={40}
                                color='#000000'  
                            />
                        </View>
                        ) : (
                            <Image
                            source={{ uri: profilePicture }}
                            style={tw`w-22 h-22 border border-gray-300 rounded-full ml-2`}
                            />
                        )}
                        
                        <View style={tw`flex flex-col justify-center ml-2`}>

                            <Text style={tw`text-xl font-medium`}>{friend.username}</Text>
                            <Text style={tw`text-base ${isUserPremium ? 'text-blue-500' : 'text-gray-400'}`}>{isUserPremium ? t('premium-user') : t('free-user')} {t('user')}</Text>

                        </View>

                    </View>
                    
                    <View style={tw`ml-3`}>
                        <Text style={tw`text-base font-medium text-gray-700`}>{workoutsCompleted} {workoutsCompleted > 1 ? t('workouts') : t('workout')} {t('completed-workouts')}.</Text>
                        <Text style={tw`text-base font-medium text-gray-700`}>{t('first-joined')} {dateJoined ? dateJoined : t('loading-friends')}</Text>
                    </View>
                    
                    <View style={tw`flex-1 justify-end items-center mb-3`}>
                        {page == "sentRequests" ? 
                        (
                            <TouchableOpacity style={tw`w-64 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center shadow-md`}
                                onPress={async () => {
                                    setCancellingFriendRequestButtonDisabled(true);
                                    console.log('cancelling request');
                                    await deleteFriendRequest(friend, usersCollectionRefState)
                                    navigation.goBack();
                                    setCancellingFriendRequestButtonDisabled(false);
                                }}
                                disabled={cancellingFriendRequestButtonDisabled}
                            >
                                <Text style={tw`text-xl font-medium text-red-500`}>{cancellingFriendRequestButtonDisabled ? t('canceling-friend-request') : t('cancel-friend-request')}</Text>
                            </TouchableOpacity>
                        ) : page == "searchedUsers" ?
                        (
                            <TouchableOpacity style={
                                tw`w-64 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center shadow-md`
                            }
                                onPress={async () => {
                                    setFriendRequestButtonDisabled(true);
                                    await sendFriendRequest(friend, navigation, t)
                                    setFriendRequestButtonDisabled(false);
                                }}
                                disabled={friendRequestButtonDisabled}
                            >
                                <Text style={tw`text-xl font-medium text-green-500`}>{friendRequestButtonDisabled ? t('adding-friend') : t('add-friend')}</Text>
                            </TouchableOpacity>
                        ) : 
                        (   

                            <View style={tw`flex flex-row gap-x-2`}>
                                {/* ACCEPT */}
                                <TouchableOpacity style={tw`w-36 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center shadow-md ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? 'pt-2' : ''}`}
                                    onPress={async () => {
                                        setAcceptingFriendRequestButtonDisabled(true);
                                        console.log('accepting friend request...');
                                        acceptFriendRequest(friend, navigation);
                                        navigation.goBack();
                                        setAcceptingFriendRequestButtonDisabled(false);

                                    }}
                                    disabled={acceptingFriendRequestButtonDisabled}
                                >
                                    <Text style={tw`text-xl font-medium text-green-500`}>{acceptingFriendRequestButtonDisabled ? t('accepting-friend-request') : t('accept-friend-request')}</Text>
                                </TouchableOpacity>
                                
                                {/* DECLINE */}
                                <TouchableOpacity style={tw`w-36 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center shadow-md ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? 'pt-2' : ''}`}
                                    onPress={async () => {
                                        setDecliningFriendRequestButtonDisabled(true);
                                        console.log('accepting friend request...');
                                        declineFriendRequest(friend, navigation);
                                        navigation.goBack();
                                        setDecliningFriendRequestButtonDisabled(false);

                                    }}
                                    disabled={decliningFriendRequestButtonDisabled}
                                >
                                    <Text style={tw`text-xl font-medium text-red-500`}>{decliningFriendRequestButtonDisabled ? t('declining-friend-request') : t('decline-friend-request')}</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>

                </View>

            </SafeAreaView>
        </>
    )
}

export default ViewSearchedUser