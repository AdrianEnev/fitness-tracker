import { View, Text, SafeAreaView, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import sendFriendRequest from '@use/friends/add/useSendFriendRequest'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import deleteFriendRequest from '@use/friends/remove/useDeleteFriendRequest'
import acceptFriendRequest from '@use/friends/add/useAcceptFriendRequest';
import declineFriendRequest from '@use/friends/remove/useDeclineFriendRequest';
import { useTranslation } from 'react-i18next';
import GlobalContext from '@config/GlobalContext';
import { UserInfo } from '@config/interfaces';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import getUserInfo from '@use/settings/get/getUserInfo';

const ViewUser = ({route, navigation}: any) => {

    const {friend, page} = route.params;

    const {iphoneModel} = useContext(GlobalContext);

    const {t} = useTranslation();

    const [profilePicture, setProfilePicture] = useState('')
    const [friendRequestButtonDisabled, setFriendRequestButtonDisabled] = useState(false);
    const [cancellingFriendRequestButtonDisabled, setCancellingFriendRequestButtonDisabled] = useState(false);
    const [acceptingFriendRequestButtonDisabled, setAcceptingFriendRequestButtonDisabled] = useState(false);
    const [decliningFriendRequestButtonDisabled, setDecliningFriendRequestButtonDisabled] = useState(false);

    const [workoutsCompleted, setWorkoutsCompleted] = useState(0);
    const [dateRegistered, setDateRegistered] = useState<string>('')

    // Not yet implemented fully
    const [isUserPremium, setIsUserPremium] = useState(false);

    const fetchUserInfo = async () => {
        const userInfo = await getUserInfo(friend.id) as UserInfo;

        if (!userInfo) {
            console.error('Error fetching user info');
            return;
        }

        setWorkoutsCompleted(userInfo.statistics.finishedWorkouts || 0);
        setDateRegistered(userInfo.dateRegistered || t('unknown'));

        const storage = getStorage();
        const profilePictureRef = ref(storage, `users/${friend.id}/profile_picture`);

        try {
            const downloadURL = await getDownloadURL(profilePictureRef);
            setProfilePicture(downloadURL);
        } catch (error) {
            console.log('Error fetching profile picture:', error);
            setProfilePicture('');
        }
    }
    
    useEffect(() => {
        fetchUserInfo();
    }, []);

    const ActivityIndicator = () => {
        return (
            <View>
                <ActivityIndicator />
            </View>
        )
    }

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
                        <Text style={tw`text-base font-medium text-gray-700`}>
                            <Text style={tw`font-bold`}>{workoutsCompleted} </Text>
                            {workoutsCompleted != 1 ? t('workouts') : t('workout')} {t('completed-workouts').toLowerCase()}.    
                        </Text>
                        <Text style={tw`text-base font-medium text-gray-700`}>
                            {t('first-joined')}
                            <Text style={tw`font-bold`}> {dateRegistered ? dateRegistered : t('loading-friends')}</Text>
                        </Text>
                    </View>
                    
                    <View style={tw`flex-1 justify-end items-center mb-3`}>
                        {page == "sentRequests" ? 
                        (
                            <TouchableOpacity style={tw`w-64 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center shadow-md`}
                                onPress={async () => {
                                    setCancellingFriendRequestButtonDisabled(true);
                                    await deleteFriendRequest(friend, navigation, t)
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
                                        acceptFriendRequest(friend, navigation, t);
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
                                        declineFriendRequest(friend, navigation, t);
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

export default ViewUser