import { View, Text, SafeAreaView, TouchableOpacity, Pressable } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tw from 'twrnc'
import { Friend } from '../../interfaces';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, runTransaction } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { FlatList } from 'react-native-gesture-handler';
import GlobalContext from '../../GlobalContext';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import getEmail from '../use/useGetEmail';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FriendsList = ({navigation, route}: any) => {

    //const { friendRequestsNumber } = useContext(GlobalContext);

    const [username, setUsername] = useState<any>('');

    useEffect(() => {
        const fetch = async () => {
            const email = await getEmail();
            const asyncStorageUsername = await AsyncStorage.getItem(`username_${email}`);
            setUsername(asyncStorageUsername)
        }
        fetch();
        
    }, [])

    const [friends, setFriends] = useState<Friend[]>([]);

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

    //onPress={() => navigation.navigate('Приятел-Профил', {username: username, friend: item})}

    const {t} = useTranslation();

    return (
        <View style={tw`w-full h-full bg-white`}>

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('friends')}</Text>
            </View>

            <View style={tw`m-3`}>
                <FlatList 
                    data={friends}
                    keyExtractor={(item) => item.id}
                    renderItem={({item}) => (
                        <Pressable style={tw`flex flex-row justify-between items-center bg-white shadow-lg rounded-xl p-3 my-2`}
                            onPress={() => navigation.navigate('Приятел-Акаунт', {friend_info: item})}
                        >

                            <Text style={tw`text-lg text-black font-medium`}>{item.username}</Text>

                            <View style={tw`flex flex-row gap-x-3`}>
                                <Pressable style={tw`w-24 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-md`} onPress={() => navigation.navigate('Приятел-Акаунт', {friend_info: item})}>
                                    <Text style={tw`text-xl text-white font-semibold`}>{t('view-friend')}</Text>
                                </Pressable>
                            </View>

                        </Pressable>
                    )}
                    ListEmptyComponent={() => (
                        <Text style={tw`text-2xl text-center font-medium text-red-500`}>{t('no-friends')}</Text>
                    )}
                />
            </View>

            <BottomNavigationBar currentPage='FriendsList' navigation={navigation} friendsListUsername={username}/>
            
        </View>
    )
}

export default FriendsList