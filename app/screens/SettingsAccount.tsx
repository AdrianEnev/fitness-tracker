import { View, Text, Button } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../firebaseConfig'
import tw from 'twrnc'

const SettingsAccount = () => {

    const username = FIREBASE_AUTH.currentUser?.email;

    return (
        <View style={tw`mt-10`}>
            <Text style={tw`m-3 font-medium text-base`}>Имейл: {username}</Text>
            <Text style={tw`m-3 font-medium text-base`}>Смяна на парола TODO!</Text>

            <Button title='излез от акаунт' onPress={() => FIREBASE_AUTH.signOut()}/>
        </View>
    )
}

export default SettingsAccount