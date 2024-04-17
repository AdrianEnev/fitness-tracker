import { View, Text, Button } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../firebaseConfig'
import tw from 'twrnc'
import { getAuth } from 'firebase/auth'
import deleteAccount  from '../use/useDeleteAccount';

const SettingsAccount = () => {

    const auth = getAuth();
    const user = auth.currentUser;
    const username = user?.email;

    return (
        <View style={tw`mt-10`}>
            <Text style={tw`m-3 font-medium text-base`}>Имейл: {username}</Text>
            <Text style={tw`m-3 font-medium text-base`}>Смяна на парола TODO!</Text>
            
            <Button title='изтрий акаунт' onPress={() => deleteAccount(username, user)}/>

            <Button title='излез от акаунт' onPress={() => FIREBASE_AUTH.signOut()}/>
        </View>
    )
}

export default SettingsAccount