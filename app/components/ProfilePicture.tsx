import { View, Pressable, Image, Text, TouchableOpacity } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import uploadFile from '../use/useUploadFile'
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../GlobalContext';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { NavigationProp } from "@react-navigation/native";
import scanImage from "../use/useScanImageNSFW";
import { useTranslation } from "react-i18next";

interface ProfilePictureProps {
    page: any;
    navigation?: NavigationProp<any>
}

const ProfilePicture = ({ page, navigation }: ProfilePictureProps) => {

    const {t} = useTranslation();

    const { profilePicture, setProfilePicture, internetConnected, lungeCoinsAmount } = useContext(GlobalContext);

    const uriToBlob = async (uri: string): Promise<Blob> => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
      };
    
    const uploadProfilePicture = async () => {

        console.log('uploading profile picture')
        
        // get image from gallery
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        console.log('result', result)
      
        if (!result.canceled) {

            console.log('not cancelled')
            
            const blob = await uriToBlob(result.assets[0].uri);

            const scannedImage = await scanImage(blob);
            
            //console.log(scannedImage[0].label, scannedImage[0].score)

            if (scannedImage[0].label === 'nsfw'){
                alert(t('nsfw-image'))
                return
            }
            
            try {
                console.log('uploading')

                await uploadFile(blob, `users/${FIREBASE_AUTH.currentUser?.uid}/profile_picture`);
                alert(t('profile-picture-uploaded-successfuly'))
                setProfilePicture(result.assets[0].uri);
            }catch (error: any){
                alert(t('unsupported-image'))
            }
           
        }
    };

    return (
        <View>
            {profilePicture === '' ? (
                <View> 
                    <Pressable 
                        style={tw`bg-white ${page === 'Main' ? 'w-16 h-16' : 'w-22 h-22'} rounded-full flex items-center justify-center border-2 border-gray-200 ml-2`}
                        onPress={() => {
                            if (page === 'Main') {
                                navigation?.navigate('Настройки-Акаунт')
                                return;
                            }
                            
                            if (internetConnected) {
                                uploadProfilePicture();
                            }
                            
                        }}
                        
                    >
                        <Ionicons name='person-outline' 
                            size={40}
                            color='#000000'  
                        />

                    </Pressable>
                </View>
            ) : (
                <View style={tw`w-full`}>

                    <Pressable onPress={() => {
                        if (page === 'Main') {
                            navigation?.navigate('Настройки-Акаунт')
                            return;
                        }

                        if (internetConnected) {
                            uploadProfilePicture();
                        }

                        
                    }}>
                        <Image
                            source={{ uri: profilePicture }}
                            style={tw`${page === 'Main' ? 'w-16 h-16' : 'w-22 h-22'} border border-gray-300 rounded-full ml-2`}
                        />
                    </Pressable>
                </View>
            )}
        </View>
    )
}

export default ProfilePicture;