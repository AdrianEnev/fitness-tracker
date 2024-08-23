import { View, Pressable, Image, Text } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import uploadFile from '../use/useUploadFile'
import { useContext, useEffect, useState } from 'react';
import GlobalContext from '../../GlobalContext';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { NavigationProp } from "@react-navigation/native";
import scanImage from "../use/useScanImage";

interface ProfilePictureProps {
    page: any;
    navigation?: NavigationProp<any>;
}

const ProfilePicture = ({ page, navigation }: ProfilePictureProps) => {

    const { profilePicture, setProfilePicture, internetConnected } = useContext(GlobalContext);

    const [showConnectionStatus, setShowConnectionStatus] = useState(false);

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

            // scan image
            const scannedImage = await scanImage(blob);
            
            console.log(scannedImage[0].label, scannedImage[0].score)

            if (scannedImage[0].label === 'nsfw'){
                console.log('nsfw')
                return
            }
           
            await uploadFile(blob, `users/${FIREBASE_AUTH.currentUser?.uid}/profile_picture`);
            alert('Snimkata be kachena uspeshno!')
            setProfilePicture(result.assets[0].uri);
    
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setShowConnectionStatus(false);
        }, 4000);

        return () => {
            clearInterval(timer);
        };
    }, []);

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

                            uploadProfilePicture();
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

                    {(showConnectionStatus && internetConnected && page === 'Main') && (
                        <View style={tw`absolute bottom-[-13px] left-17 z-30 shadow-md rounded-[10px] w-44 h-8 flex items-center justify-center bg-green-500`}>
                            <Text style={tw`text-base font-medium text-white`}>Connection: Stable</Text>
                        </View>
                    )}

                    {(showConnectionStatus && !internetConnected && page === 'Main') && (
                        <View style={tw`absolute bottom-[-13px] left-17 z-30 shadow-md rounded-[10px] w-42 h-8 flex items-center justify-center bg-gray-300`}>
                            <Text style={tw`text-base font-medium text-black`}>Connection: None</Text>
                        </View>
                    )}
                    

                    <Pressable onPress={() => {
                        if (page === 'Main') {
                            navigation?.navigate('Настройки-Акаунт')
                            return;
                        }

                        uploadProfilePicture();
                    }}
                        onLongPress={() => setShowConnectionStatus(!showConnectionStatus)}
                    >
                        <Image
                            source={{ uri: profilePicture }}
                            style={tw`${page === 'Main' ? 'w-16 h-16' : 'w-22 h-22'} ${internetConnected && page === 'Main' ? 'border-2 border-[#32CD32]' : !internetConnected && page === 'Main' ? 'border-2 border-gray-400' : ''} rounded-full ml-2`}
                        />
                    </Pressable>
                </View>
            )}
        </View>
    )
}

export default ProfilePicture;