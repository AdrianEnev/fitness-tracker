import { View, Text, Button, Pressable, Image } from 'react-native'
import React, { useContext, useState } from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig'
import tw from 'twrnc'
import { getAuth } from 'firebase/auth'
import deleteAccount  from '../use/useDeleteAccount';
import changePassword from '../use/useChangePassword'
import { useTranslation } from 'react-i18next';
import getUsername from '../use/useGetUsername'
import { collection, doc } from 'firebase/firestore'
import { useFocusEffect } from '@react-navigation/native'
import * as ImagePicker from 'expo-image-picker';
import uploadFile from '../use/useUploadFile'
import { SafeAreaView } from 'react-native-safe-area-context'
import getProfilePicture from '../use/useGetProfilePicture'
import Ionicons from '@expo/vector-icons/Ionicons';
import GlobalContext from '../../GlobalContext'

const SettingsAccount = ({navigation, route}: any) => {

    const auth = getAuth();
    const user = auth.currentUser;
    const email = user?.email;

    const { username, profilePicture, setProfilePicture, friendRequestsNumber } = useContext(GlobalContext);

    const uriToBlob = async (uri: string): Promise<Blob> => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
      };
      
    // okazva se che ima po lesen nachin za updatevane na profilna direktno ot firebase akaunta na usera ama veche napravih toq nachin tui che taka shte sedi  
    const uploadProfilePicture = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
      
        if (!result.canceled) {

            const blob = await uriToBlob(result.assets[0].uri);
            await uploadFile(blob, `users/${FIREBASE_AUTH.currentUser?.uid}/profile_picture`);
            alert('Snimkata be kachena uspeshno!')

            setProfilePicture(result.assets[0].uri);

        }
    };

    return (
        <SafeAreaView style={tw`w-full h-full`}>
            
            {/* Profil ikona */}
            <View style={tw`flex flex-col items-center mb-5`}>

                <View style={tw`w-full`}>

                    <View style={tw`flex items-center`}>
                        {profilePicture === '' ? (
                            <Pressable 
                                style={tw`bg-white w-28 h-28 rounded-full flex items-center justify-center border-2 border-gray-200 ml-2`}
                                onPress={uploadProfilePicture}
                            >
                                <Ionicons name='person-outline' 
                                    size={40}
                                    color='#000000'  
                                />

                            </Pressable>
                        ) : (
                            <Pressable onPress={uploadProfilePicture}>
                                <Image
                                    source={{ uri: profilePicture }}
                                    style={tw`w-28 h-28 rounded-full ml-2`}
                                />
                            </Pressable>
                        )}
                    </View>

                </View>

                <View>
                    <Text style={tw`text-xl `}>{username}</Text>
                </View>
            </View>

            <View>
                <View style={tw`w-full h-14 bg-white p-3 mb-1`}>
                    <Text style={tw`text-lg font-medium`}>Имейл: {email}</Text>
                </View>      

                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => FIREBASE_AUTH.signOut()}>
                    <Text style={tw`text-lg font-medium`}>Излез от акаунта си</Text>
                </Pressable>
                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`}>
                    <Text style={tw`text-lg font-medium`}>Промяна на потребителско име</Text>
                </Pressable>
                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => deleteAccount(email, user)}>
                    <Text style={tw`text-lg font-medium`}>Изтриване на акаунт</Text>
                </Pressable>
                <Pressable style={tw`w-full h-14 bg-white p-3 mb-1`} onPress={() => changePassword(email, user, auth)}>
                    <Text style={tw`text-lg font-medium`}>Промяна на парола</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    )
}

export default SettingsAccount