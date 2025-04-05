import { FIREBASE_AUTH } from '../../firebaseConfig';

const getReceivedFriendRequests = async () => {

    const userId = FIREBASE_AUTH.currentUser?.uid;

    try {
        const response = await fetch(`http://localhost:3000/api/friends/${userId}/received`);
        
        //console.log('Response received: ', response);

        if (!response.ok) {
            console.error("getReceivedFriendRequests: error:", response.statusText);
            return null;
        }

        const data = await response.json();
        //console.log('Data received: ', data);
        if (data.length === 0) {
            console.log("No received friend requests found.");
            return [];
        }
        
        console.log('Received friend requests: ', data);
        return data;

    } catch (error) {
        console.error("getReceivedFriendRequests: error:", error);
        return null;
    }

}

export default getReceivedFriendRequests;
