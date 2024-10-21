import { View, Text, SafeAreaView, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import searchForFriend from '../use/useSearchForFriend'
import { Friend } from '../../interfaces'
import { FlatList } from 'react-native-gesture-handler'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import sendFriendRequest from '../use/useSendFriendRequest'
import BottomNavigationBar from '../components/BottomNavigationBar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import getEmail from '../use/useGetEmail'

const AddFriends = ({route, navigation}: any) => {

    // imeto na potrebitelq koito e lognat
    const [username, setUsername] = useState<any>('');

    useEffect(() => {
        const fetch = async () => {
            const email = await getEmail();
            const asyncStorageUsername = await AsyncStorage.getItem(`username_${email}`);
            setUsername(asyncStorageUsername)
        }
        fetch();
        
    }, [])

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [suggestedFriends, setSuggestedFriends] = useState<Friend[]>([]);

    const [searchingAnimation, setSearchingAnimation] = useState(false);

    const [friendRequestButtonDisabled, setFriendRequestButtonDisabled] = useState(false);

    const userDisabledFriendRequests = async (checkUser: any) => {

        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, checkUser.id);
        const userInfoCollectionRef = collection(userDocRef, 'user_info');
        const receiveFriendRequestsDocRef = doc(userInfoCollectionRef, 'receiveFriendRequests');
        const receiveFriendRequestsDoc = await getDoc(receiveFriendRequestsDocRef);
    
        if (receiveFriendRequestsDoc.data()) {
            const friendRequestsEnabled = receiveFriendRequestsDoc.data()?.receiveFriendRequests;

            if (friendRequestsEnabled === false) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
        
    }

    // ako user 1 e pratil pokana na user 2 i posle user 2 prati na user 1, stavat priqteli
    /*const hasUserSentRequest = async (checkUser: any) => {
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, checkUser.id);
        const userInfoCollectionRef = collection(userDocRef, 'user_info');
        const friendRequestsCollectionRef = doc(userInfoCollectionRef, 'friendRequests');
        const receivedCollectionRef = collection(friendRequestsCollectionRef, 'sent');
    
        const requestDocRef = doc(receivedCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const requestDoc = await getDoc(requestDocRef);
    
        if (requestDoc.data()) {
            return true;
        } else {
            return false;
        }
    }*/

    const isFriendAlready = async (checkUser: any, currentUserInfoCollectionRef: any) => {

        const friendsDocRef = doc(currentUserInfoCollectionRef, 'friends');
        const listCollectionRef = collection(friendsDocRef, 'list');

        const friendDocRef = doc(listCollectionRef, checkUser.id);
        const friendDoc = await getDoc(friendDocRef);

        if (friendDoc.data()) {
            return true;
        } else {
            return false;
        }
    }
    
    const isRequestPending = async (checkUser: any, currentUserInfoCollectionRef: any, usersCollectionRef: any) => {
        
        const currentUserSentRequestsCollectionRef = collection(currentUserInfoCollectionRef, 'friendRequests', 'sent');
        //const currentUserReceivedRequestsCollectionRef = collection(currentUserInfoCollectionRef, 'friendRequests', 'received');
    
        const otherUserDocRef = doc(usersCollectionRef, checkUser.id);
        const otherUserInfoCollectionRef = collection(otherUserDocRef, 'user_info');
        const otherUserSentRequestsCollectionRef = collection(otherUserInfoCollectionRef, 'friendRequests', 'sent');
        const otherUserReceivedRequestsCollectionRef = collection(otherUserInfoCollectionRef, 'friendRequests', 'received');
    
        // Check if the current user has sent a request to the other user
        const sentRequestDocRef = doc(currentUserSentRequestsCollectionRef, checkUser.id);
        const sentRequestDoc = await getDoc(sentRequestDocRef);
    
        // Check if the other user has sent a request to the current user
        const receivedRequestDocRef = doc(otherUserSentRequestsCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const receivedRequestDoc = await getDoc(receivedRequestDocRef);
    
        if (sentRequestDoc.exists() || receivedRequestDoc.exists()) {
            console.log('requestPending:', sentRequestDoc.data() || receivedRequestDoc.data());
            return true;
        } else {
            console.log('requestPending:', false);
            return false;
        }
    };

    const searchButton = async () => {

        if (searchQuery === '' || searchingAnimation) {
            return;
        }

        setSearchingAnimation(true); // Start the searching animation
    
        try {
            const results = await searchForFriend(searchQuery);
            setSearchResults(results);
            if (results.length > 0) {
                await addToSuggestions(results);
            } else {
                setSuggestedFriends([]); // Clear suggestions if no results
                setNoUserFoundMessage("No user found"); // Set no user found message
                setSearchingAnimation(false); // Stop the searching animation
            }
        } catch (error) {
            console.error('Error searching for friend:', error);
            setSearchingAnimation(false); // Stop the searching animation in case of error
        }
    };

    const userAddedThemself = async (username: string) => {
        const email = await getEmail()
        const asyncStorageUsername = await AsyncStorage.getItem(`username_${email}`)

        if (asyncStorageUsername == username) {
            return true
        }else {
            return false
        }
    }
    
    const addToSuggestions = async (users: any) => {

        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const currentUserDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const currentUserInfoCollectionRef = collection(currentUserDocRef, 'user_info');

        const suggestions = await Promise.all(users.map(async (user: any) => {
            if (user.username !== username) {

                const userAddedThemselfBool = await userAddedThemself(user.username);
                if (userAddedThemselfBool) {
                    console.log('You cannot add yourself!')
                    return null;
                }

                const alreadyFriend = await isFriendAlready(user, currentUserInfoCollectionRef);
                if (alreadyFriend) {
                    console.log(user.username, 'is already a friend, not adding to suggestions');
                    return null;
                }

                const pending = await isRequestPending(user, currentUserInfoCollectionRef, usersCollectionRef);
                if (pending) {
                    return null;
                }

                const friendRequestsDisabled = await userDisabledFriendRequests(user);
                if ( !friendRequestsDisabled) {
                    console.log('Added', user.username, 'to suggestions');
                    return user;
                } else {
                    console.log(user.username, 'is already a friend or has a pending request or has disabled friend requests, not adding to suggestions');
                    return null;
                }

            } else {
                console.log('filtered username: ' + username);
                return null;
            }
        }));
    
        setSuggestedFriends(suggestions.filter(user => user !== null));
        setSearchingAnimation(false); // Stop the searching animation after processing suggestions
    };

    const [noUserFoundMessage, setNoUserFoundMessage] = useState("");

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`w-full h-full`}>
                
                <View style={tw`w-[96%] flex flex-row justify-between mx-2`}>

                    <TextInput
                        placeholder="Потърси някого..."
                        style={tw`w-[83%] h-13 bg-white shadow-md rounded-xl pl-4 border border-gray-200`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    <Pressable style={tw`w-13 h-13 bg-white shadow-lg rounded-2xl flex items-center justify-center`} onPress={searchButton}>
                        <Ionicons name="search" size={36} color='#fa1148' />
                    </Pressable>

                </View>

                <View style={tw`w-[96%] h-[82.5%] mx-2 my-2 bg-white shadow-lg border border-gray-200 rounded-lg`}>

                    {searchingAnimation ? (
                        <View style={tw`flex-1 items-center justify-center mt-3`}>
                            <ActivityIndicator size="large" color="#fa1148" />
                        </View>
                    ) : suggestedFriends.length === 0 ? (
                        <View>
                            {!noUserFoundMessage && <Text style={tw`text-lg font-medium text-center mt-3`}>Потърси някого...</Text>}
                            {noUserFoundMessage && <Text style={tw`text-lg font-medium text-center mt-3`}>{noUserFoundMessage}</Text>}
                        </View>
                    ) : (
                        
                            <FlatList 
                                data={suggestedFriends}
                                keyExtractor={(item) => item.id}
                                renderItem={({item}) => (
                                    <Pressable disabled={friendRequestButtonDisabled} onPress={async () => {
                                        setFriendRequestButtonDisabled(true);
                                        console.log('sending friend request...');
                                        await sendFriendRequest(item, username, navigation)
                                        setFriendRequestButtonDisabled(false);
                                    }}>
                                        <View style={tw`w-[96%] h-16 bg-white shadow-lg border border-gray-200 mt-3 mx-2 rounded-lg flex flex-row justify-between items-center px-2`}>
                                            
                                            <Text style={tw`text-lg font-medium max-w-[88%]`} ellipsizeMode='tail' numberOfLines={1}>{item.username}</Text>
                                            <Ionicons name='add-circle-outline' size={42} color='#1db858' style={tw`ml-2`}/>

                                        </View>
                                    </Pressable>
                                )}
                            />
                        
                    )}

                </View>

                <BottomNavigationBar navigation={navigation} currentPage='Settings' />

            </SafeAreaView>

        </TouchableWithoutFeedback>
    )
}

export default AddFriends