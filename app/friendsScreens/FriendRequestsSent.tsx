import { View, Text, SafeAreaView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '../components/BottomNavigationBar';
import getEmail from '../use/useGetEmail';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendRequestsSent = ({route, navigation}: any) => {

    const [username, setUsername] = useState<any>('');

    useEffect(() => {
        const fetch = async () => {
            const email = await getEmail();
            const asyncStorageUsername = await AsyncStorage.getItem(`username_${email}`);
            setUsername(asyncStorageUsername)
        }
        fetch();
        
    }, [])

    const [sentFriendRequests, setSentFriendRequests] = useState<any[]>([]);

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const friendRequestsDocRef = doc(userInfoCollectionRef, 'friendRequests');

    const getRequests = async () => {

        const friendRequestsDoc = await getDoc(friendRequestsDocRef);
        if (!friendRequestsDoc.exists()) {

            // ako ne sushtestvuva friendRequests document, se suzdava prazen takuv
            console.log('no friend requests sent or recieved')
            await setDoc(friendRequestsDocRef, {});
        }

        try{
            const sentCollectionRef = collection(friendRequestsDocRef, 'sent');
            const snapshot = await getDocs(sentCollectionRef);
            const sentRequests = snapshot.docs.map(doc => doc.data());

            setSentFriendRequests(sentRequests);

        } catch (err) {
            console.log('no friend requests sent');
        }

    }

    useEffect(() => {
        const sentCollectionRef = collection(friendRequestsDocRef, 'sent');
        onSnapshot(sentCollectionRef, (_snapshot) => {
            getRequests();
        });
    }, [])

    const {t} = useTranslation();

    return (
        <View style={tw`w-full h-full bg-white`}>
            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('sent-requests')}</Text>
            </View>

            <View style={tw`m-3`}>
                <FlatList 
                    data={sentFriendRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <Pressable style={tw`w-full h-14 bg-white shadow-md border border-gray-200 rounded-xl mb-[2px] px-2 py-3 flex flex-row justify-between`}
                            onPress={() => navigation.navigate('Виж-Потърсен-Потребител', {friend: item, page: "sentRequests"})}
                        >
                            
                            <Text style={tw`text-lg font-medium max-w-[100%]`} ellipsizeMode='tail' numberOfLines={1}>{item.username}</Text>

                        </Pressable>
                    )}
                    ListEmptyComponent={() => (
                        <Text style={tw`text-xl font-medium text-blue-500`}>{t('no-sent-requests')}</Text>
                    )}
                />
            </View>


            <BottomNavigationBar currentPage='Settings' navigation={navigation}/>
        </View>
    )
}

export default FriendRequestsSent