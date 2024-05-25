import { View, Text, SafeAreaView, TextInput, TouchableWithoutFeedback, Keyboard, Pressable } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import searchForFriend from '../use/useSearchForFriend'

const AddFriends = () => {

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const searchButton = async () => {
        await searchForFriend(searchQuery).then((result) => {
            setSearchResults(result);
        });

        console.log(searchResults);
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

            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

export default AddFriends