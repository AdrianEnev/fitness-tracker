import { View, Text, SafeAreaView, TextInput, TouchableWithoutFeedback, Keyboard, Pressable, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import searchFriend from '@app/use/friends/get/useSearchFriend'
import { Friend } from '@config/interfaces'
import { FlatList } from 'react-native-gesture-handler'
import BottomNavigationBar from '@components/BottomNavigationBar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import getEmail from '@use/settings/get/useGetEmail'
import { useTranslation } from 'react-i18next'
import { validateFriendSearch } from '@use/friends/useValidateFriendSearch'

const AddFriends = ({navigation}: any) => {

    const {t} = useTranslation();

    const [suggestedFriends, setSuggestedFriends] = useState<Friend[]>([]);

    // Logged in user username
    const [usernameLogged, setUsernameLogged] = useState<any>('');

    const [searchQuery, setSearchQuery] = useState('');
    //const [searchResults, setSearchResults] = useState<any[]>([]);
    const [searchingAnimation, setSearchingAnimation] = useState(false);
    const [noUserFoundMessage, setNoUserFoundMessage] = useState("");

    useEffect(() => {
        const fetch = async () => {
            const email = await getEmail();
            const asyncStorageUsername = await AsyncStorage.getItem(`username_${email}`);
            setUsernameLogged(asyncStorageUsername)
        }
        fetch();
        
    }, [])

    const searchButton = async () => {

        if (searchQuery === '' || searchingAnimation) {
            return;
        }

        setSearchingAnimation(true); // Start the searching animation
    
        try {
            const results = await searchFriend(searchQuery);

            if (results.length > 0) {
                await addToSuggestions(results);
            } else {
                setSuggestedFriends([]); // Clear suggestions if no results
                setNoUserFoundMessage(t('no-user-found')); // Set no user found message
                setSearchingAnimation(false); // Stop the searching animation
            }
        } catch (error) {
            //console.error('Error searching for friend:', error);
            setSearchingAnimation(false); // Stop the searching animation in case of error
        }
    };
    
    const addToSuggestions = async (users: any) => {
        const suggestions = await Promise.all(users.map(async (user: any) => {
            if (user.username !== usernameLogged) {

                return await validateFriendSearch(user);

            } else {
                console.log('filtered username: ' + user.username);
                return null;
            }
        }));
    
        setSuggestedFriends(suggestions.filter(user => user !== null));
        setSearchingAnimation(false); // Stop the searching animation after processing suggestions
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={tw`w-full h-full`}>
                
                <View style={tw`w-[96%] flex flex-row justify-between mx-2`}>

                    <TextInput
                        placeholder="Потърси някого..."
                        style={tw`w-[83%] h-13 bg-white shadow-md rounded-xl pl-4 border border-gray-200`}
                        autoCapitalize='none'
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
                            {!noUserFoundMessage && <Text style={tw`text-lg font-medium text-center mt-3`}>{t('friend-search-example')}...</Text>}
                            {noUserFoundMessage && <Text style={tw`text-lg font-medium text-center mt-3`}>{noUserFoundMessage}</Text>}
                        </View>
                    ) : (
                        
                            <FlatList 
                                data={suggestedFriends}
                                keyExtractor={(item) => item.id}
                                renderItem={({item}) => (
                                    <Pressable onPress={async () => {
                                        navigation.navigate('Виж-Потърсен-Потребител', {friend: item, page: "searchedUsers"})
                                    }}>
                                        <View style={tw`w-[96%] h-16 bg-white shadow-lg border border-gray-200 mt-3 mx-2 rounded-lg flex flex-row justify-between items-center px-2`}>
                                            
                                            <Text style={tw`text-lg font-medium max-w-[88%]`} ellipsizeMode='tail' numberOfLines={1}>{item.username}</Text>
                                            <Ionicons name='chevron-forward-outline' size={42} color='#9ca3af' style={tw`ml-2`}/>

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