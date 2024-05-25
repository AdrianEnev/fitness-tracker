import { View, Text, SafeAreaView, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons'
import { Friend } from '../../interfaces';

const FriendRequestsReceived = ({route}: any) => {

    const {username} = route.params;

    const [receivedFriendRequests, setReceivedFriendRequests] = useState<any[]>([]);

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const friendRequestsDocRef = doc(userInfoCollectionRef, 'friendRequests');

    const getRequests = async () => {

        const friendRequestsDoc = await getDoc(friendRequestsDocRef);
        if (!friendRequestsDoc.exists()) {
            console.log('no friend requests received or sent')
        }

        try{
            const receivedCollectionRef = collection(friendRequestsDocRef, 'received');
            const snapshot = await getDocs(receivedCollectionRef);
            const receivedRequests = snapshot.docs.map(doc => doc.data());

            setReceivedFriendRequests(receivedRequests);

        } catch (err) {
            console.log('no friend requests received');
        }

    }

    useEffect(() => {
        onSnapshot(friendRequestsDocRef, (_snapshot) => {
            getRequests();
        });
    }, [])

    return (
        <SafeAreaView>
            <Text style={tw`m-3 text-xl text-center font-medium`}>Получени покани</Text>

                <FlatList 
                    data={receivedFriendRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={tw`w-full h-14 bg-white mb-2 mt-3 px-4 py-3 flex flex-row justify-between`}>
                            
                            <Text style={tw`text-lg font-medium`}>{item.username}</Text>

                            <Pressable onPress={() => {}}>
                                <Ionicons name="checkmark-circle-outline" size={24} color='green' />
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

export default FriendRequestsReceived