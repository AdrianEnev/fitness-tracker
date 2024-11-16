import { View, Text, SafeAreaView, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, runTransaction, setDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '../components/BottomNavigationBar';


const FriendRequestsRecieved = ({route, navigation}: any) => {
    
    const [receivedFriendRequests, setReceivedFriendRequests] = useState<any[]>([]);

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

    const {t} = useTranslation();

    return (
        <View style={tw`w-full h-full bg-white`}>
            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('received-requests')}</Text>
            </View>

            <View style={tw`m-3`}>
                <FlatList 
                    data={receivedFriendRequests}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <Pressable style={tw`w-full h-14 bg-white shadow-md border border-gray-200 rounded-xl mb-[2px] px-2 py-3 flex flex-row justify-between`}
                            onPress={() => navigation.navigate('Виж-Потърсен-Потребител', {friend: item, page: "receivedRequests"})}
                        >
                            
                            <Text style={tw`text-lg font-medium`}>{item.username}</Text>

                        </Pressable>
                    )}
                    ListEmptyComponent={() => (
                        <Text style={tw`text-2xl text-center font-medium text-red-500`}>{t('no-received-requests')}</Text>
                    )}
                />
            </View>

            <BottomNavigationBar currentPage='Settings' navigation={navigation}/>
        </View>
    )
}

export default FriendRequestsRecieved