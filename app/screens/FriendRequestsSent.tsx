import { View, Text, SafeAreaView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons'
import { Friend } from '../../interfaces';
import { useTranslation } from 'react-i18next';

const FriendRequestsSent = ({route}: any) => {

    const {username} = route.params;

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

    const deleteRequest = async (user: Friend) => {

        // delete sent from logged user
        const sentCollectionRef = collection(friendRequestsDocRef, 'sent');
        const requestDocRef = doc(sentCollectionRef, user.id);

        try {
            await deleteDoc(requestDocRef);
            console.log(`Step 1 - sucessful (Deleted request to ${user.username})`);

        } catch (err) {
            console.error(`Step 1 - error -> Error deleting request to ${user.username}: `, err);
        }

        // delete recieved from other user
        const otherUserDocRef = doc(usersCollectionRef, user.id);
        const otherUserInfoCollectionRef = collection(otherUserDocRef, 'user_info');
        const otherUserFriendRequestsDocRef = doc(otherUserInfoCollectionRef, 'friendRequests');

        try {
            const receivedCollectionRef = collection(otherUserFriendRequestsDocRef, 'received');
            const recievedDocRef = doc(receivedCollectionRef, FIREBASE_AUTH.currentUser?.uid)

            await deleteDoc(recievedDocRef)
            console.log(`Step 2 - successful (deleted request by ${username})`)

        }catch (err) {
            console.log('Step 2 - error -> ', err)
        }
        
    }

    const {t} = useTranslation();

    return (
        <View style={tw`w-full h-full bg-white`}>
            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('sent-requests')}</Text>
            </View>

                <FlatList 
                    data={sentFriendRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={tw`w-full h-14 bg-white mb-2 mt-3 px-4 py-3 flex flex-row justify-between`}>
                            
                            <Text style={tw`text-lg font-medium`}>{item.username}</Text>

                            <Pressable onPress={() => deleteRequest(item)}>
                                <Ionicons name="trash-bin-outline" size={24} color='red' />
                            </Pressable>

                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <Text style={tw`m-3 text-lg text-center`}>{t('no-sent-requests')}</Text>
                    )}
                />
        </View>
    )
}

export default FriendRequestsSent