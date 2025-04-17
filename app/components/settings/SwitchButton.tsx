import { View, Text } from "react-native";
import tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Switch } from 'react-native';

const SwitchButton = (
    title: any, icon: any, background: string, 
    iconColor: any, iconSize: number, isFaceIdEnabled: boolean, 
    isReceiveFriendRequestsEnabled: boolean, toggleFaceIdSwitch: () => void, 
    toggleReceiveFriendRequestsSwitch: () => void, translation: any
) => {
    return (
        <View style={tw`w-full h-14 bg-white p-3 mb-1`}>
            <View style={tw`flex flex-row justify-between`}>

                <View style={tw`flex flex-row`}>
                    <View style={tw`w-10 h-10 bg-${background} rounded-full flex items-center justify-center mr-2`}>
                        <Ionicons name={icon} size={iconSize} color={iconColor} />
                    </View>
                    
                    <View style={tw`flex justify-center`}>
                        <Text style={tw`text-lg font-medium`} numberOfLines={2}>{title}</Text>
                    </View>
                </View>

                <View style={tw`flex justify-center`}>
                    <Switch
                        trackColor={{ false: "#ef4444", true: "#4ade80" }}
                        thumbColor={
                            title === translation('face-id') ? (isFaceIdEnabled ? "#ffffff" : "#f4f3f4") :
                            title === translation('receive-friend-requests') ? (isReceiveFriendRequestsEnabled ? "#ffffff" : "#f4f3f4") : 
                            "#f4f3f4"
                        }
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={
                            title === translation('face-id') ? toggleFaceIdSwitch :
                            title === translation('receive-friend-requests') ? toggleReceiveFriendRequestsSwitch : 
                            () => {
                                console.log('Switch button not working');
                            }
                        }
                        value=
                        {
                            title === translation('face-id') ? isFaceIdEnabled :
                            title === translation('receive-friend-requests') ? isReceiveFriendRequestsEnabled : 
                            false
                        }
                    />
                </View>

            </View>
        </View>
    )
}

export default SwitchButton;