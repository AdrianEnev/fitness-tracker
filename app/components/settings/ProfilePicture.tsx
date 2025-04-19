import { View, Pressable, Image } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import uploadFile from '@use/settings/add/useUploadFile'
import { useContext } from 'react';
import GlobalContext from '@config/GlobalContext';
import { FIREBASE_AUTH } from '@config/firebaseConfig';
import { NavigationProp } from "@react-navigation/native";
import checkImage from "@use/settings/check/useCheckImageNSFW";
import { useTranslation } from "react-i18next";

interface ProfilePictureProps {
    page: any;
    navigation?: NavigationProp<any>
}

const ProfilePicture = ({ page, navigation }: ProfilePictureProps) => {

    const {t} = useTranslation();

    const { profilePicture, setProfilePicture, internetConnected, lungeCoinsAmount } = useContext(GlobalContext);

    
    const uploadProfilePicture = async () => {

        console.log('uploading profile picture');
        
        // get image from gallery
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
      
        if (!result.canceled) {

            console.log('not cancelled');

            const scannedImage = await checkImage(result.assets[0].uri);
            
            // If image is nsfw, return, otherwise proceed and convert image to blob then upload it
            if (scannedImage[0].label === 'nsfw'){
                alert(t('nsfw-image'));
                return
            }

            // convert uri to blob
            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();
            
            try {
                console.log('Uploading');

                await uploadFile(blob, `users/${FIREBASE_AUTH.currentUser?.uid}/profile_picture`);
                alert(t('profile-picture-uploaded-successfuly'))
                setProfilePicture(result.assets[0].uri);
            }catch (error: any){
                alert(t('unsupported-image'));
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
                                navigation?.navigate('Settings-Account');
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
                            navigation?.navigate('Settings-Account');
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