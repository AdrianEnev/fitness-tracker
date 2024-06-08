import { View, Text, SafeAreaView, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, runTransaction, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Friend } from '../../interfaces';

const FriendRequestsRecieved = ({route, navigation}: any) => {

    const {username} = route.params;
    
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const friendRequestsDocRef = doc(userInfoCollectionRef, 'friendRequests');

    const [receivedFriendRequests, setReceivedFriendRequests] = useState<any[]>([]);

    const getRequests = async () => {

        const friendRequestsDoc = await getDoc(friendRequestsDocRef);
        if (!friendRequestsDoc.exists()) {

            // ako ne sushtestvuva friendRequests document, se suzdava prazen takuv
            console.log('no friend requests sent or recieved')
            await setDoc(friendRequestsDocRef, {});
        }

        try{
            const sentCollectionRef = collection(friendRequestsDocRef, 'received');
            const snapshot = await getDocs(sentCollectionRef);
            const sentRequests = snapshot.docs.map(doc => doc.data());

            setReceivedFriendRequests(sentRequests);

        } catch (err) {
            console.log('no friend requests sent');
        }

    }

    useEffect(() => {
        const receivedCollectionRef = collection(friendRequestsDocRef, 'received');
        onSnapshot(receivedCollectionRef, (_snapshot) => {
            getRequests();
        });
    }, [])

    const acceptRequest = async (user: Friend) => {
 
        // delete sent from logged user - Step 1
        const sentCollectionRef = collection(friendRequestsDocRef, 'received');
        const requestDocRef = doc(sentCollectionRef, user.id);

        // delete received from other user
        const otherUserDocRef = doc(usersCollectionRef, user.id);
        const otherUserInfoCollectionRef = collection(otherUserDocRef, 'user_info');
        const otherUserFriendRequestsDocRef = doc(otherUserInfoCollectionRef, 'friendRequests');
        const receivedCollectionRef = collection(otherUserFriendRequestsDocRef, 'sent');
        const receivedDocRef = doc(receivedCollectionRef, FIREBASE_AUTH.currentUser?.uid)

        try {
            await runTransaction(FIRESTORE_DB, async (transaction) => {
                transaction.delete(requestDocRef);
                transaction.delete(receivedDocRef);
            });
            console.log(`Steps 1 and 2 - successful (Deleted request to and by ${user.username})`);
        } catch (err) {
            console.error(`Steps 1 and 2 - error -> Error deleting request to and by ${user.username}: `, err);
        }

        // Add to friends list - Step 2
        const otherUserFriendsDocRef = doc(otherUserInfoCollectionRef, 'friends');
        const loggedInUserFriendsDocRef = doc(userInfoCollectionRef, 'friends');

        try {
            await runTransaction(FIRESTORE_DB, async (transaction) => {
                const otherUserFriendsDoc = await transaction.get(otherUserFriendsDocRef);
                const loggedInUserFriendsDoc = await transaction.get(loggedInUserFriendsDocRef);

                if (!otherUserFriendsDoc.exists()) {
                    transaction.set(otherUserFriendsDocRef, {});
                }
                if (!loggedInUserFriendsDoc.exists()) {
                    transaction.set(loggedInUserFriendsDocRef, {});
                }

                const otherUserFriendsCollectionRef = collection(otherUserFriendsDocRef, 'list');
                const loggedInUserFriendsCollectionRef = collection(loggedInUserFriendsDocRef, 'list');

                transaction.set(doc(otherUserFriendsCollectionRef, FIREBASE_AUTH.currentUser?.uid), { username: username, id: FIREBASE_AUTH.currentUser?.uid });
                transaction.set(doc(loggedInUserFriendsCollectionRef, user.id), { username: user.username, id: user.id });
            });

            console.log('Step 3 - successful (added friends to both users)');
            alert(`Поканата на ${user.username} беше приета успешно!`);

        } catch (err) {
            console.error('Step 3 - error ->', err);
        }
        
    }

    const declineRequest = async (user: Friend) => {
        // delete sent from logged user
        const sentCollectionRef = collection(friendRequestsDocRef, 'received');
        const requestDocRef = doc(sentCollectionRef, user.id);
    
        // delete received from other user
        const otherUserDocRef = doc(usersCollectionRef, user.id);
        const otherUserInfoCollectionRef = collection(otherUserDocRef, 'user_info');
        const otherUserFriendRequestsDocRef = doc(otherUserInfoCollectionRef, 'friendRequests');
        const receivedCollectionRef = collection(otherUserFriendRequestsDocRef, 'sent');
        const receivedDocRef = doc(receivedCollectionRef, FIREBASE_AUTH.currentUser?.uid)
    
        try {
            await runTransaction(FIRESTORE_DB, async (transaction) => {
                transaction.delete(requestDocRef);
                transaction.delete(receivedDocRef);
            });
            console.log(`Steps 1 and 2 - successful (Deleted request to and by ${user.username})`);
        } catch (err) {
            console.error(`Steps 1 and 2 - error -> Error deleting request to and by ${user.username}: `, err);
        }
    }

    return (
        <SafeAreaView>
            <Text style={tw`m-3 text-xl text-center font-medium`}>Получени покани</Text>

                <FlatList 
                    data={receivedFriendRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={tw`w-full h-14 bg-white mb-2 mt-3 px-4 py-3 flex flex-row justify-between`}>
                            
                            <Text style={tw`text-lg font-medium`}>{item.username}</Text>

                            <View style={tw`flex flex-row gap-x-2`}>

                                <Pressable onPress={() => declineRequest(item)}>
                                    <Ionicons name="logo-xbox" size={32} color='red' />
                                </Pressable>

                                <Pressable onPress={() => acceptRequest(item)}>
                                    <Ionicons name="checkmark-circle" size={32} color='green' />
                                </Pressable>
                                
                            </View>

                        </View>
                    )}
                    ListEmptyComponent={() => (
                        <Text style={tw`m-3 text-lg text-center`}>Нямаш получени покани</Text>
                    )}
                />
        </SafeAreaView>
    )
}

export default FriendRequestsRecieved