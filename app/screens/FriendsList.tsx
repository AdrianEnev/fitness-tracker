import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { Friend } from '../../interfaces';

const FriendsList = ({navigation, route}: any) => {

    const {username} = route.params;

    /*
    <View style={tw`w-[25%]`}>
                    <TouchableOpacity style={tw`w-full h-12 bg-white rounded-xl flex justify-center items-center`}>
                        <Text style={tw`text-lg text-black font-medium`}>Потърси</Text>
                    </TouchableOpacity>
                </View>
    */

    const [friends, setFriends] = useState<Friend[]>([]);

    return (
        <SafeAreaView style={tw`w-full h-full`}>

            <View style={tw`w-full flex items-center`}>
                
            
                

                <TouchableOpacity style={tw`w-[95%] h-12 bg-white rounded-xl flex justify-center items-center`} onPress={() => navigation.navigate('Приятели-Добави', {username: username})}>
                    <Text style={tw`text-lg text-black font-medium`}>Добави Някого</Text>
                </TouchableOpacity>

                <View style={tw`mt-3`}>
                    {friends.length === 0 ? (
                        <Text style={tw`text-lg font-medium`}>Нямаш приятели :skull:</Text>
                    ) : (
                        <Text>Имаш живот</Text>
                    )}
                </View>

            </View>
            
        </SafeAreaView>
    )
}

export default FriendsList