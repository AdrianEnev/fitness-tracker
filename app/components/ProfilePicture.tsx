import { View, Pressable, Image } from "react-native"
import Ionicons from '@expo/vector-icons/Ionicons';
import uploadProfilePicture from '../use/useUploadProfilePicture';
import tw from 'twrnc';

const ProfilePicture = ({profilePicture, setProfilePicture}: any) => {
    return (
        <View>
            {profilePicture === '' ? (
                <Pressable 
                    style={tw`bg-white w-28 h-28 rounded-full flex items-center justify-center border-2 border-gray-200 ml-2`}
                    onPress={() => uploadProfilePicture(setProfilePicture)}
                >
                    <Ionicons name='person-outline' 
                        size={40}
                        color='#000000'  
                    />

                </Pressable>
            ) : (
                <Pressable onPress={() => uploadProfilePicture(setProfilePicture)}>
                    <Image
                        source={{ uri: profilePicture }}
                        style={tw`w-22 h-22 rounded-full ml-2`}
                    />
                </Pressable>
            )}
        </View>
    )
}

export default ProfilePicture;