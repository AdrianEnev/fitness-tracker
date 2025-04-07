import { useContext } from "react";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import GlobalContext from "../../GlobalContext";
import { Friend } from "../../interfaces";

const declineFriendRequest = async (userToCheck: Friend, navigation: any, translation: any) => {

    const {friendRequestsNumber, setFriendRequestsNumber} = useContext(GlobalContext);
    
    const currentUserUid = FIREBASE_AUTH.currentUser?.uid;

    console.log('Attempting to decline friend request from:', userToCheck.username);

    try {
        const response = await fetch(`http://localhost:3000/api/friends/${currentUserUid}/decline`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            },
            body: JSON.stringify({
                userToCheck: userToCheck
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("declineFriendRequest: error:", errorData.message);
            alert(translation(errorData.message));
            navigation.goBack();
            return null;
        }

        // Remove 1 friend request from the friend requests received count
        setFriendRequestsNumber((Number(friendRequestsNumber) - 1).toString());

        console.log('Friend request declined successfully!');
        navigation.navigate('Настройки-Страница');
        alert(translation('friend-request-declined'))

    } catch (error) {
        alert(translation('error'))
        return null;
    }

};

export default declineFriendRequest

