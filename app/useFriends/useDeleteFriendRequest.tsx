import { FIREBASE_AUTH } from "../../firebaseConfig";

const deleteFriendRequest = async (userToCheck: any, navigation: any, translation: any) => {

    const currentUserUid = FIREBASE_AUTH.currentUser?.uid;

    console.log('Attempting to delete friend request to:', userToCheck.username);

    try {
        const response = await fetch(`http://localhost:3000/api/friends/${currentUserUid}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
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
        navigation.goBack();
        navigation.goBack();
        alert(translation('friend-request-deleted'))

    } catch (error) {
        alert(translation('error'))
        return null;
    }
}

export default deleteFriendRequest;