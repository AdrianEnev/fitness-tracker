import { View, Text, SafeAreaView, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import { Friend } from '../../interfaces';

const FriendRequestsRecieved = ({route}: any) => {

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

        // delete sent from logged user
        const sentCollectionRef = collection(friendRequestsDocRef, 'received');
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
            const receivedCollectionRef = collection(otherUserFriendRequestsDocRef, 'sent');
            const recievedDocRef = doc(receivedCollectionRef, FIREBASE_AUTH.currentUser?.uid)

            await deleteDoc(recievedDocRef)
            console.log(`Step 2 - successful (deleted request by ${username})`)

        }catch (err) {
            console.log('Step 2 - error -> ', err)
        }

        // add to friends list
        try {
            // add both to friend list
            const otherUserFriendsDocRef = doc(otherUserInfoCollectionRef, 'friends');
            const loggedInUserFriendsDocRef = doc(userInfoCollectionRef, 'friends');
    
            // check if documents exist, if not create them
            const otherUserFriendsDoc = await getDoc(otherUserFriendsDocRef);
            const loggedInUserFriendsDoc = await getDoc(loggedInUserFriendsDocRef);
            if (!loggedInUserFriendsDoc.exists()) {
                await setDoc(loggedInUserFriendsDocRef, {});
            }
            if (!otherUserFriendsDoc.exists()) {
                await setDoc(otherUserFriendsDocRef, {});
            }
    
            const otherUserFriendsCollectionRef = collection(otherUserFriendsDocRef, 'list');
            const loggedInUserFriendsCollectionRef = collection(loggedInUserFriendsDocRef, 'list');
    
            await setDoc(doc(loggedInUserFriendsCollectionRef, user.id), { username: user.username, id: user.id });
            await setDoc(doc(otherUserFriendsCollectionRef, FIREBASE_AUTH.currentUser?.uid), { username: username, id: FIREBASE_AUTH.currentUser?.uid });
    
            console.log('Step 3 - successful (added friends to both users)');
        }catch (err) {
            console.error('Step 3 - error ->', err);
        }
    }

    const declineRequest = async (user: Friend) => {
            
        // delete sent from logged user
        const sentCollectionRef = collection(friendRequestsDocRef, 'received');
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
            const receivedCollectionRef = collection(otherUserFriendRequestsDocRef, 'sent');
            const recievedDocRef = doc(receivedCollectionRef, FIREBASE_AUTH.currentUser?.uid)

            await deleteDoc(recievedDocRef)
            console.log(`Step 2 - successful (deleted request by ${username})`)

        }catch (err) {
            console.log('Step 2 - error -> ', err)
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

                            <Pressable onPress={() => acceptRequest(item)}>
                                <Ionicons name="checkmark-circle" size={24} color='green' />
                            </Pressable>

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