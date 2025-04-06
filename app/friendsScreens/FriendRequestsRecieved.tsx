import { View, Text, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '../components/BottomNavigationBar';
import getReceivedFriendRequests from '../useFriends/useGetReceivedFriendRequests';
import { useFocusEffect } from '@react-navigation/native';

const FriendRequestsRecieved = ({navigation}: any) => {
    
    const [receivedFriendRequests, setReceivedFriendRequests] = useState<any[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetch = async () => {
                const sentRequests = await getReceivedFriendRequests();
                setReceivedFriendRequests(sentRequests);
            }
    
            fetch();
        }, []) 
    );

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
                            <Text style={tw`text-lg font-medium max-w-[100%]`} ellipsizeMode='tail' numberOfLines={1}>
                                {item.username}
                            </Text>
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