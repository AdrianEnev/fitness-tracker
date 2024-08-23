import { View, Pressable, Image, Text } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from 'twrnc';
import * as ImagePicker from 'expo-image-picker';
import uploadFile from '../use/useUploadFile'
import { useContext, useState } from 'react';
import GlobalContext from '../../GlobalContext';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { NavigationProp } from "@react-navigation/native";

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
            await uploadFile(blob, `users/${FIREBASE_AUTH.currentUser?.uid}/profile_picture`);
            alert('Snimkata be kachena uspeshno!')
    
            setProfilePicture(result.assets[0].uri);
    
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
                    <Pressable style={tw`${page === 'Main' ? 'absolute' : 'hidden'} right-[-3px] top-[-5px] w-6 h-6 rounded-full ${internetConnected ? 'bg-[#32CD32]' : 'bg-gray-400'} z-20`}
                        onPress={() => setShowConnectionStatus(!showConnectionStatus)}
                    >
                        
                    </Pressable>

                    {(showConnectionStatus && internetConnected) && (
                        <View style={tw`absolute top-5 left-16 z-30 shadow-md rounded-[10px] w-44 h-8 flex items-center justify-center bg-green-500`}>
                            <Text style={tw`text-base font-medium text-white`}>Connection: Stable</Text>
                        </View>
                    )}

                    {(showConnectionStatus && !internetConnected) && (
                        <View style={tw`absolute top-5 left-16 z-30 shadow-md rounded-[10px] w-42 h-8 flex items-center justify-center bg-gray-300`}>
                            <Text style={tw`text-base font-medium text-black`}>Connection: None</Text>
                        </View>
                    )}
                    

                    <Pressable onPress={() => {
                        if (page === 'Main') {
                            navigation?.navigate('Настройки-Акаунт')
                            return;
                        }

                        uploadProfilePicture();
                    }}>
                        <Image
                            source={{ uri: profilePicture }}
                            style={tw`${page === 'Main' ? 'w-16 h-16' : 'w-22 h-22'} rounded-full ml-2`}
                        />
                    </Pressable>
                </View>
            )}
        </View>
    )
}

export default ProfilePicture;