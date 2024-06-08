import { collection, doc, getDocs } from "firebase/firestore";

const getFriendRequests = async (userInfoCollectionRef: any) => {

    const friendRequestsDocRef = doc(userInfoCollectionRef, 'friendRequests');
    const receievedFriendRequestsColRef = collection(friendRequestsDocRef, 'received');

    // get number of documents inside receievedFriendRequestsColRef
    const receivedFriendRequests = await getDocs(receievedFriendRequestsColRef);
    const friendRequestsNumber = receivedFriendRequests.docs.length;
    
    return friendRequestsNumber;
    

}

export default getFriendRequests;