import { View, Text, SafeAreaView, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import searchForFriend from '../use/useSearchForFriend'
import { Friend } from '../../interfaces'
import { FlatList } from 'react-native-gesture-handler'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'

const AddFriends = ({route}: any) => {

    // imeto na potrebitelq koito e lognat
    const {username} = route.params;

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const [suggestedFriends, setSuggestedFriends] = useState<Friend[]>([]);

    const [searchingAnimation, setSearchingAnimation] = useState(false);

    const searchButton = async () => {
        setSearchingAnimation(true);
        await searchForFriend(searchQuery).then((results) => {
            setSearchResults(results);
            if (results.length > 0) {
                addToSuggestions(results);  // Move this inside the then block
            }
        });
    }

    const addToSuggestions = (users: any) => {
        users.map((user: any) => {

            // ako namereniqt username ne e sushtiqt kato tozi na lognatiqt chovek
            // toest ne mojesh da pratish friend request na sebe si
            if (user.username !== username) {
                
                if (!suggestedFriends.some((friend) => friend.username === user.username)) {
                    setSuggestedFriends((prevFriends) => [...prevFriends, user]);
                }

            }else{
                console.log('filtered username: ' + username)
            }
        });
        setSearchingAnimation(false);
    }

    const sendFriendRequest = async (user: Friend) => {
        console.log(user);
    
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, user.id);
        const userInfoCollectionRef = collection(userDocRef, 'user_info');
    
        // add document called "friendRequests" if it already doesn't exist, inside add 2 collections, one named "sent" and one named "received" if they don't exist then inside received add the current logged in user's id and username
        const friendRequestsDocRef = doc(userInfoCollectionRef, 'friendRequests');
        const friendRequestsDoc = await getDoc(friendRequestsDocRef);
    
        if (!friendRequestsDoc.exists()) {
            await setDoc(friendRequestsDocRef, {});
        }
    
        const sentCollectionRef = collection(friendRequestsDocRef, 'sent');
        const receivedCollectionRef = collection(friendRequestsDocRef, 'received');
    
        const loggedInUser = FIREBASE_AUTH.currentUser;
        if (loggedInUser) {
            const loggedInUserDocRef = doc(receivedCollectionRef, loggedInUser.uid);
            await setDoc(loggedInUserDocRef, { username: username, id: loggedInUser.uid });
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`w-full h-full`}>
                
                <View style={tw`w-full flex flex-row mx-3`}>

                    <TextInput
                        placeholder="Потърси някого..."
                        style={tw`w-[80%] h-12 bg-white shadow-sm rounded-xl pl-4`}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />

                    <Pressable style={tw`ml-3 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md`} onPress={searchButton}>
                        <Ionicons name="search" size={36} color='black' />
                    </Pressable>

                </View>

                {searchingAnimation ? (
                    <View style={tw`flex items-center mt-3`}>
                        <ActivityIndicator size="large" color="#007AFF" />
                    </View>
                ) : suggestedFriends.length === 0 ? (
                    <Text style={tw`text-lg font-medium text-center mt-3`}>празно</Text>
                ) : (
                    <FlatList 
                        data={suggestedFriends}
                        keyExtractor={(item) => item.id}
                        renderItem={({item}) => (
                            <Pressable onPress={() => sendFriendRequest(item)}>
                                <View style={tw`w-full h-14 bg-white p-3 mb-2 mt-3`}>
                                    
                                    <Text style={tw`text-lg font-medium`}>{item.username}</Text>

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