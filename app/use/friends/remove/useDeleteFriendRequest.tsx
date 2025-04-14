import { FIREBASE_AUTH } from "@config/firebaseConfig";
import { Friend } from "@config/interfaces";

const deleteFriendRequest = async (userToCheck: Friend, navigation: any, translation: any) => {

    const currentUserUid = FIREBASE_AUTH.currentUser?.uid;

    console.log('Attempting to delete friend request to:', userToCheck.username);

    try {
        const response = await fetch(`http://localhost:3000/api/friends/${currentUserUid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                userToCheck: userToCheck
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("deleteFriendRequest: error:", errorData.message);
            alert(translation(errorData.message));
            navigation.goBack();
            return null;
        }

        console.log('Friend request deleted successfully!');
        navigation.navigate('Настройки-Страница');
        alert(translation('friend-request-deleted'))

    } catch (error) {
        alert(translation('error'))
        return null;
    }
}

export default deleteFriendRequest;