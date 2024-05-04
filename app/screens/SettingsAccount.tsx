import { View, Text, Button } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../firebaseConfig'
import tw from 'twrnc'
import { getAuth } from 'firebase/auth'
import deleteAccount  from '../use/useDeleteAccount';
import changePassword from '../use/useChangePassword'
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';

const SettingsAccount = () => {

    const auth = getAuth();
    const user = auth.currentUser;
    const email = user?.email;

    return (
        <View style={tw`mt-10`}>
            <Text style={tw`m-3 font-medium text-base`}>Имейл: {email}</Text>

            <Button title='смяна на парола' onPress={() => changePassword(email, user, auth)}/>
            
            <Button title='изтрий акаунт' onPress={() => deleteAccount(email, user)}/>

            <Button title='излез от акаунт' onPress={() => FIREBASE_AUTH.signOut()}/>
        </View>
    )
}

export default SettingsAccount