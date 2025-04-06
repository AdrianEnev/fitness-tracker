import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../use/useGetEmail";
import { FIREBASE_AUTH } from "../../firebaseConfig";

const acceptFriendRequest = async (userToCheck: any, navigation: any, translation: any) => {
    
    const email = await getEmail();
    const loggedUserUsername = await AsyncStorage.getItem(`username_${email}`)

    const currentUserUid = FIREBASE_AUTH.currentUser?.uid;

    console.log('Attempting to accept friend request from:', userToCheck.username);

    try {
        const response = await fetch(`http://localhost:3000/api/friends/${currentUserUid}/accept`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            },
            body: JSON.stringify({
                userToCheck: userToCheck,
                loggedUserUsername: loggedUserUsername
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("acceptFriendRequest: error:", errorData.message);
            alert(translation(errorData.message));
            navigation.goBack();
            return null;
        }

        console.log('Friend request accepted successfully!');
        navigation.goBack();
        navigation.goBack();
        alert(translation('friend-request-accepted'))

    } catch (error) {
        alert(translation('error'))
        return null;
    }

};

export default acceptFriendRequest