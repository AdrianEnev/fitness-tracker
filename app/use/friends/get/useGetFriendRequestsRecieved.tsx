import { collection, doc, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@config/firebaseConfig";

const getFriendRequests = async () => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const friendRequestsDocRef = doc(userInfoCollectionRef, 'friendRequests');
    const receievedFriendRequestsColRef = collection(friendRequestsDocRef, 'received');

    // get number of documents inside receievedFriendRequestsColRef
    const receivedFriendRequests = await getDocs(receievedFriendRequestsColRef);
    const friendRequestsNumber = receivedFriendRequests.docs.length;
    
    return friendRequestsNumber;
    

}

export default getFriendRequests;