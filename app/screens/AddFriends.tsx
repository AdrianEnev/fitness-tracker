import { View, Text, SafeAreaView, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import searchForFriend from '../use/useSearchForFriend'
import { Friend } from '../../interfaces'
import { FlatList } from 'react-native-gesture-handler'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import sendFriendRequest from '../use/useSendFriendRequest'

const AddFriends = ({route, navigation}: any) => {

    // imeto na potrebitelq koito e lognat
    const {username} = route.params;

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [suggestedFriends, setSuggestedFriends] = useState<Friend[]>([]);

    const [searchingAnimation, setSearchingAnimation] = useState(false);

    const [friendRequestButtonDisabled, setFriendRequestButtonDisabled] = useState(false);

    const searchButton = async () => {

        setSearchingAnimation(true); // puska animaciqta za tursene

        await searchForFriend(searchQuery).then((results) => {
            setSearchResults(results);
            if (results.length > 0) {
                addToSuggestions(results); 
            }
        });
    }

    const isFriendAlready = async (checkUser: any) => {

        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const userInfoCollectionRef = collection(userDocRef, 'user_info');
        const friendsDocRef = doc(userInfoCollectionRef, 'friends');
        const listCollectionRef = collection(friendsDocRef, 'list');

        const friendDocRef = doc(listCollectionRef, checkUser.id);
        const friendDoc = await getDoc(friendDocRef);

        if (friendDoc.data()) {
            return true;
        } else {
            return false;
        }
    }
    
    const isRequestPending = async (checkUser: any) => {
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
        const userInfoCollectionRef = collection(userDocRef, 'user_info');
        const friendRequestsCollectionRef = doc(userInfoCollectionRef, 'friendRequests');
        const sentCollectionRef = collection(friendRequestsCollectionRef, 'received');
    
        const requestDocRef = doc(sentCollectionRef, checkUser.id);
        const requestDoc = await getDoc(requestDocRef);
    
        if (requestDoc.data()) {
            return true;
        } else {
            return false;
        }
    }

    const addToSuggestions = async (users: any) => {
        const suggestions = await Promise.all(users.map(async (user: any) => {
            if (user.username !== username) {
                const alreadyFriend = await isFriendAlready(user);
                const requestPending = await isRequestPending(user);
                if (!alreadyFriend && !requestPending) {
                    console.log('Added', user.username, 'to suggestions');
                    return user;
                } else {
                    console.log(user.username, 'is already a friend or has a pending request, not adding to suggestions');
                    return null;
                }
            } else {
                console.log('filtered username: ' + username);
                return null;
            }
        }));
    
        setSuggestedFriends(suggestions.filter(user => user !== null));
        setSearchingAnimation(false);
    }

   
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`w-full h-full`}>
                
                <View style={tw`w-full flex flex-row mx-3`}>

                    <TextInput
                        placeholder="Потърси някого..."
                        style={tw`w-[80%] h-12 bg-white shadow-md rounded-xl pl-4`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    <Pressable style={tw`ml-3 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md`} onPress={searchButton}>
                        <Ionicons name="search" size={36} color='black' />
                    </Pressable>

                </View>

                <Text style={tw`text-xl font-medium text-center mt-2`}>Suggestions:</Text>

                {searchingAnimation ? (
                    <View style={tw`flex items-center mt-3`}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                ) : suggestedFriends.length === 0 ? (
                    <Text style={tw`text-lg font-medium text-center mt-3`}>none</Text>
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
                                <View style={tw`w-[94%] h-14 bg-white mb-2 mt-3 mx-3 rounded-xl flex flex-row justify-between items-center px-2`}>
                                    
                                    <Text style={tw`text-lg font-medium`}>{item.username}</Text>
                                    <Ionicons name='add-circle-outline' size={42} color='#16a34a'/>

                                </View>
                            </Pressable>
                        )}
                    />
                )}

            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default AddFriends