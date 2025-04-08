import { FIREBASE_AUTH } from "@config/firebaseConfig";

const getSentFriendRequests = async () => {

    const userId = FIREBASE_AUTH.currentUser?.uid;

    try {
        const response = await fetch(`http://localhost:3000/api/friends/${userId}/sent`);
        
        //console.log('Response received: ', response);

        if (!response.ok) {
            console.error("getSentFriendRequests: error:", response.statusText);
            return null;
        }

        const data = await response.json();
        //console.log('Data received: ', data);
        if (data.length === 0) {
            console.log("No sent friend requests found.");
            return [];
        }

        console.log('Sent friend requests: ', data);
        return data;

    } catch (error) {
        console.error("getSentFriendRequests: error:", error);
        return null;
    }

}

export default getSentFriendRequests;