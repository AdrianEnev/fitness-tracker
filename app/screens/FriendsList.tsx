import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc'
import { Friend } from '../../interfaces';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, runTransaction } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import GlobalContext from '../../GlobalContext';

const FriendsList = ({navigation, route}: any) => {

    const { username, friendRequestsNumber } = useContext(GlobalContext);

    const [friends, setFriends] = useState<Friend[]>([]);

    const [removeFriendDisabled, setRemoveFriendDisabled] = useState(false);

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const friendsDocRef = doc(userInfoCollectionRef, 'friends');
    const listCollectionRef = collection(friendsDocRef, 'list');

    const getFriends = async () => {
        
        const querySnapshot = await getDocs(listCollectionRef);
        const friendsList: Friend[] = [];
        querySnapshot.forEach((doc) => {
            friendsList.push(doc.data() as Friend);
        });
        setFriends(friendsList);
    }

    useEffect(() => {
        onSnapshot(listCollectionRef, (_snapshot) => {
            getFriends();
        });
    })

    const removeFriend = async (friend: Friend) => {
        console.log('running remove friend');
        setRemoveFriendDisabled(true);
    
        const loggedInUserFriendsCollectionRef = collection(friendsDocRef, 'list');
        const loggedInUserFriendDocRef = doc(loggedInUserFriendsCollectionRef, friend.id);

        const friendUserDocRef = doc(usersCollectionRef, friend.id);
        const friendUserInfoCollectionRef = collection(friendUserDocRef, 'user_info');
        const friendFriendsDocRef = doc(friendUserInfoCollectionRef, 'friends');
        const friendFriendsCollectionRef = collection(friendFriendsDocRef, 'list');
        const friendFriendDocRef = doc(friendFriendsCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        
        console.log('About to delete documents');
    
        try {
            await runTransaction(FIRESTORE_DB, async (transaction) => {
                transaction.delete(loggedInUserFriendDocRef);
                transaction.delete(friendFriendDocRef);
            });
            console.log('Delete operations successful');
        } catch (err) {
            console.error('Error deleting documents:', err);
        }
    
        setRemoveFriendDisabled(false);
    }
    //onPress={() => navigation.navigate('Приятел-Профил', {username: username, friend: item})}

    return (
        <SafeAreaView style={tw`w-full h-full`}>

            <View style={tw`w-full flex flex-row justify-around`}>
                
                <TouchableOpacity style={tw`w-32 h-12 bg-white rounded-xl flex justify-center items-center`} onPress={() => navigation.navigate('Приятели-Добави', {username: username})}>
                    <Text style={tw`text-lg text-black font-medium`}>Добави</Text>
                </TouchableOpacity>

                <TouchableOpacity style={tw`w-32 h-12 bg-white rounded-xl flex justify-center items-center`} onPress={() => navigation.navigate('Приятели-Покани-Изпратени', {username: username})}>
                    <Text style={tw`text-lg text-black font-medium`}>Изпратени</Text>
                </TouchableOpacity>

                <View>
                    <TouchableOpacity style={tw`w-32 h-12 bg-white rounded-xl flex justify-center items-center`} onPress={() => navigation.navigate('Приятели-Покани-Получени', {username: username})}>
                            <Text style={tw`text-lg text-black font-medium`}>Получени</Text>
                    </TouchableOpacity>
                    {friendRequestsNumber >= "1" && 
                        <View style={tw`w-6 h-6 bg-red-500 rounded-full absolute top-[-6px] left-[-2px] flex justify-center items-center`}>
                            <Text style={tw`text-white`}>{friendRequestsNumber}</Text>
                        </View>
                    }
                </View>

            </View>

            <View style={tw`m-3`}>
                <FlatList 
                    data={friends}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <View style={tw`flex flex-row justify-between items-center bg-white rounded-xl p-3 my-2`}>

                            <Text style={tw`text-lg text-black font-medium`}>{item.username}</Text>

                            <View style={tw`flex flex-row gap-x-3`}>
                                <TouchableOpacity style={tw`w-24 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-md`} onPress={() => navigation.navigate('Приятел-Акаунт', {friend_info: item})}>
                                    <Text style={tw`text-lg text-white font-medium`}>Профил</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={tw`w-28 h-12 bg-red-500 rounded-2xl flex items-center justify-center shadow-md`} disabled={removeFriendDisabled} onPress={() => removeFriend(item)}>
                                    <Text style={tw`text-lg text-white font-medium`}>Премахни</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    )}
                />
            </View>
            
        </SafeAreaView>
    )
}

export default FriendsList