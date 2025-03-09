import { View, Text, SafeAreaView, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { ref, getDownloadURL } from "firebase/storage";
import { FIREBASE_STORAGE, FIRESTORE_DB } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import removeFriend from '../useFriends/useRemoveFriend';
import { useTranslation } from 'react-i18next';

const ViewFriendProfile = ({route, navigation}: any) => {

    const {friend_info} = route.params;

    const [profilePicture, setProfilePicture] = useState('');
    const [weightLifted, setWeightLifted] = useState(0);
    const [friendRegistrationDate, setFriendRegistrationDate] = useState<React.ReactNode | null>(null);

    const [workoutsFinished, setWorkoutsFinished] = useState(0);
    const [removingFriend, setRemovingFriend] = useState(false)

    const [isFriendPremium, setIsFriendPremium] = useState(false)
    const [isFriendOnline, setIsFriendOnline] = useState(false)

    const getIsFriendOnline = async () => {
        const friendID = friend_info.id;

        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, friendID);

        // get the "activity" property from userDocRef
        const unsubscribe = onSnapshot(userDocRef, (doc) => {
            setIsFriendOnline(doc.data()?.activity === 'online');
        });

        return () => unsubscribe();
    }

    const getFriendProfilePicture = async () => {
 
        const imagePath = `users/${friend_info.id}/profile_picture`;
        const imageRef = ref(FIREBASE_STORAGE, imagePath);

        try {
            const url = await getDownloadURL(imageRef);
            setProfilePicture(url);

        } catch (error) {
            //console.error("Error getting document:", error);
            return null;
        }

    }

    const getFriendWeightLifted = async () => {
        
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, friend_info.id);
        const userInfoCollectionRef = collection(userDocRef, 'user_info')
        const userStatisticsDocRef = doc(userInfoCollectionRef, 'statistics');

        const unsubscribe = onSnapshot(userStatisticsDocRef, (doc) => {
            setWeightLifted(doc.data()?.weightLifted);
            setWorkoutsFinished(doc.data()?.finishedWorkouts || 0);
        });

        // Cleanup function
        return () => unsubscribe();
    }

    const getFriendRegistrationDate = async () => {
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, friend_info.id);
    
        try {
            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {

                let registrationDate = docSnapshot.data()?.registrationDate;
                let date = registrationDate.toDate();
                
                let formattedDate = date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                setFriendRegistrationDate(formattedDate);

            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.log("Error getting document:", error);
        }
    }

    useFocusEffect(() => {
        getFriendProfilePicture();
        getFriendWeightLifted();
        getFriendRegistrationDate();
    })

    const deleteFriend = async () => {
        removeFriend(friend_info);
        navigation.navigate('Приятели')
    }

    const {t} = useTranslation();

    return (
        <>
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
                        <Text style={tw`text-base font-medium text-gray-700`}>{workoutsFinished} {workoutsFinished > 1 || workoutsFinished == 0 ? t('workouts'): t('workout')} {t('completed-workouts')}.</Text>
                        <Text style={tw`text-base font-medium text-gray-700`}>{weightLifted ? weightLifted : '0'} {t('kilograms-short')} {t('lifted-in-total')}</Text>
                    </View>

                    <View style={tw`flex-1 justify-end items-center mb-3`}>

                    <TouchableOpacity style={tw`w-64 h-12 bg-white shadow-lg rounded-2xl flex items-center justify-center shadow-md`}
                                onPress={async () => {
                                    setRemovingFriend(true);
                                    //console.log('removing friend');
                                    await deleteFriend()
                                    navigation.goBack();
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