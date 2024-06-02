import { View, Text, SafeAreaView, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { FIREBASE_AUTH, FIREBASE_STORAGE, FIRESTORE_DB } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { collection, doc, onSnapshot } from 'firebase/firestore';

const ViewFriendProfile = ({route}: any) => {

    const {friend_info} = route.params;

    const [profilePicture, setProfilePicture] = useState('');
    const [weightLifted, setWeightLifted] = useState(0);

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
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const userInfoCollectionRef = collection(userDocRef, 'user_info')
        const userWeightLiftedDocRef = doc(userInfoCollectionRef, 'weight_lifted');

        const unsubscribe = onSnapshot(userWeightLiftedDocRef, (doc) => {
            setWeightLifted(doc.data()?.weight);
        });

        // Cleanup function
        return () => unsubscribe();
    }

    useFocusEffect(() => {
        getFriendProfilePicture();
        getFriendWeightLifted();
    })

    return (
        <SafeAreaView style={tw`w-full h-full`}>

            <View style={tw`flex flex-col items-center mb-5`}>

                <View style={tw`w-full`}>

                    <View style={tw`flex items-center`}>
                        {profilePicture === '' ? (
                            <Pressable 
                                style={tw`bg-white w-28 h-28 rounded-full flex items-center justify-center border-2 border-gray-200 ml-2`}
                                
                            >
                                <Ionicons name='person-outline' 
                                    size={40}
                                    color='#000000'  
                                />

                            </Pressable>
                        ) : (
                            <Pressable>
                                <Image
                                    source={{ uri: profilePicture }}
                                    style={tw`w-28 h-28 rounded-full ml-2`}
                                />
                            </Pressable>
                        )}
                    </View>

                </View>

                <View>
                    <Text style={tw`text-xl `}>{friend_info.username}</Text>
                </View>
            </View>

            
            <Text>Подвигната тежест: {weightLifted} КГ</Text>

        </SafeAreaView>
    )
}

export default ViewFriendProfile