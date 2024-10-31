import { collection, doc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Friend } from '../../interfaces';

const deleteFriendRequest = async (user: Friend, usersCollectionRefState: any) => {

    let usersCollectionRef = usersCollectionRefState;

    if (!usersCollectionRefState) {
        usersCollectionRef = collection(FIRESTORE_DB, 'users');
    }

    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const friendRequestsDocRef = doc(userInfoCollectionRef, 'friendRequests');

    // delete sent from logged user
    const sentCollectionRef = collection(friendRequestsDocRef, 'sent');
    const requestDocRef = doc(sentCollectionRef, user.id);

    try {
        await deleteDoc(requestDocRef);
        console.log(`Step 1 - sucessful (Deleted request to ${user.username})`);

    } catch (err) {
        console.error(`Step 1 - error -> Error deleting request to ${user.username}: `, err);
    }

    // delete recieved from other user
    const otherUserDocRef = doc(usersCollectionRef, user.id);
    const otherUserInfoCollectionRef = collection(otherUserDocRef, 'user_info');
    const otherUserFriendRequestsDocRef = doc(otherUserInfoCollectionRef, 'friendRequests');

    try {
        const receivedCollectionRef = collection(otherUserFriendRequestsDocRef, 'received');
        const recievedDocRef = doc(receivedCollectionRef, FIREBASE_AUTH.currentUser?.uid)

        await deleteDoc(recievedDocRef)
        console.log(`Step 2 - successful (deleted request by ${user.username})`)

    }catch (err) {
        console.log('Step 2 - error -> ', err)
    }
    
}

export default deleteFriendRequest;