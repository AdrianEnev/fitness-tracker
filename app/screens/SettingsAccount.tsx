import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig'
import tw from 'twrnc'
import { getAuth } from 'firebase/auth'
import deleteAccount  from '../use/useDeleteAccount';
import changePassword from '../use/useChangePassword'
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import getUsername from '../use/useGetUsername'
import { collection, doc } from 'firebase/firestore'
import { useFocusEffect } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';

const SettingsAccount = () => {

    const auth = getAuth();
    const user = auth.currentUser;
    const email = user?.email;

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');

    const [username, setUsername] = useState('');

    useFocusEffect(() => {
        const fetch = async () => {
            setUsername(await getUsername(userInfoCollectionRef));
        }
        fetch();
    });

    const uploadProfilePicture = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    
    }

    return (
        <View style={tw`mt-10`}>
            <Text style={tw`m-3 font-medium text-base`}>Имейл: {email}</Text>
            <Text style={tw`m-3 font-medium text-base`}>Име: {username}</Text>

            <Button title='смяна на парола' onPress={() => changePassword(email, user, auth)}/>
            
            <Button title='изтрий акаунт' onPress={() => deleteAccount(email, user)}/>

            <Button title='излез от акаунт' onPress={() => FIREBASE_AUTH.signOut()}/>

            <Button title='смени профилна снимка' onPress={uploadProfilePicture}/>
        </View>
    )
}

export default SettingsAccount