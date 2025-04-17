import { View, Text, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { Friend } from '@config/interfaces';
import { FlatList } from 'react-native-gesture-handler';
import BottomNavigationBar from '@components/BottomNavigationBar';
import { useTranslation } from 'react-i18next';
import getEmail from '@use/settings/get/useGetEmail'
import AsyncStorage from '@react-native-async-storage/async-storage';
import getFriendsList from '@use/friends/get/useGetFriendsList';
import { FIREBASE_AUTH } from '@config/firebaseConfig';

const FriendsList = ({navigation}: any) => {

    const [username, setUsername] = useState<any>('');

    useEffect(() => {
        const fetch = async () => {
            const email = await getEmail();
            const asyncStorageUsername = await AsyncStorage.getItem(`username_${email}`);
            setUsername(asyncStorageUsername)
        }
        fetch();
    }, []);

    const [friends, setFriends] = useState<Friend[]>([]);

    useEffect(() => {

        const fetch = async () => {
            const friendsList = await getFriendsList(FIREBASE_AUTH.currentUser?.uid);
            if (friendsList) {
                setFriends(friendsList);
            } else {
                setFriends([]);
            }
        }

        fetch();
    }, []);

    const {t} = useTranslation();

    return (
        <View style={tw`w-full h-full bg-white`}>

            <View style={tw`bg-gray-100 w-full h-[15%] flex justify-end`}>
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