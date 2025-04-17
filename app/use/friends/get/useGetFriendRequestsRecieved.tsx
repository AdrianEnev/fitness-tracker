import { FIREBASE_AUTH } from "@config/firebaseConfig";

const getFriendRequests = async () => {

    const userId = FIREBASE_AUTH.currentUser?.uid;

    const params = new URLSearchParams({
        getUsers: 'false'
   });

    try {
        const response = await fetch(`http://172.20.10.5:3000/api/friends/${userId}/received?${params.toString()}`);
        
        if (!response.ok) {
            console.error("getReceivedFriendRequests: error:", response.statusText);
            return null;
        }

        const data = await response.json();
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

export default getFriendRequests;