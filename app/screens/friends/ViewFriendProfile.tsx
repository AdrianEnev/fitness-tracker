import { View, Text, SafeAreaView, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { ref, getDownloadURL, getStorage } from "firebase/storage";
import removeFriend from '@use/friends/remove/useRemoveFriend';
import { useTranslation } from 'react-i18next';
import LoadingModal from '@modals/loading/LoadingModal';
import { BlurView } from 'expo-blur';
import { UserInfo } from '@config/interfaces';
import getUserInfo from '@use/settings/get/getUserInfo';

const ViewFriendProfile = ({route, navigation}: any) => {

    const {friend_info} = route.params;

    const {t} = useTranslation();

    const [profilePicture, setProfilePicture] = useState('');
    const [weightLifted, setWeightLifted] = useState(0);
    const [isFriendOnline, setIsFriendOnline] = useState(false);
    const [friendRegistrationDate, setFriendRegistrationDate] = useState<string>('')

    const [workoutsCompleted, setWorkoutsCompleted] = useState(0);
    const [removingFriend, setRemovingFriend] = useState(false);

    // Not yet implemented fully
    const [isFriendPremium, setIsFriendPremium] = useState(false);

    const fetchUserInfo = async () => {
        
        const userInfo = await getUserInfo(friend_info.id) as UserInfo;

        if (!userInfo) {
            console.error('Error fetching user info');
            return;
        }

        setWorkoutsCompleted(userInfo.statistics.finishedWorkouts || 0);
        setFriendRegistrationDate(userInfo.dateRegistered || t('unknown'));
        setWeightLifted(userInfo.statistics.weightLifted || 0);
        setIsFriendOnline(userInfo.isOnline || false);

        const storage = getStorage();
        const profilePictureRef = ref(storage, `users/${friend_info.id}/profile_picture`);

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

    return (
        <>
            {removingFriend && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <LoadingModal
                isLoadingModalVisible={removingFriend}
                setIsLoadingModalVisible={setRemovingFriend}
            />

            <SafeAreaView style={tw`w-full h-full flex items-center justify-center`}>
                <View style={tw`w-[80%] h-[33%] mb-8 bg-white shadow-md rounded-xl flex pt-2`}>

                    {isFriendPremium && (
                        <View style={tw`absolute top-2 right-2`}>
                            <Ionicons name='star' color={'#fde047'} size={24} />
                        </View>
                    )}

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

                            <Text style={tw`text-xl font-medium`}>{friend_info.username}</Text>
                            <Text style={tw`text-base ${isFriendOnline ? "text-green-500" : "text-red-500"}`}>{isFriendOnline ? t('online') : t('offline')}</Text>

                        </View>

                    </View>
                    
                    <View style={tw`ml-3`}>
                        <Text style={tw`text-base font-medium text-gray-700`}>{t('first-joined')} {friendRegistrationDate ? friendRegistrationDate : t('loading-friends')}</Text>
                        <Text style={tw`text-base font-medium text-gray-700`}>{workoutsCompleted} {workoutsCompleted > 1 || workoutsCompleted == 0 ? t('workouts'): t('workout')} {t('completed-workouts')}.</Text>
                        <Text style={tw`text-base font-medium text-gray-700`}>{weightLifted ? weightLifted : '0'} {t('kilograms-short')} {t('lifted-in-total')}</Text>
                    </View>

                    <View style={tw`flex-1 justify-end items-center mb-3`}>

                    <TouchableOpacity style={tw`w-64 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center shadow-md`}
                                onPress={async () => {
                                    setRemovingFriend(true);
                                    await removeFriend(friend_info, navigation, t);
                                    setRemovingFriend(false);
                                }}
                                disabled={removingFriend}
                            >
                                <Text style={tw`text-xl font-medium text-red-500`}>{removingFriend ? t('removing-friend') : t('remove-friend')}</Text>
                            </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}

export default ViewFriendProfile