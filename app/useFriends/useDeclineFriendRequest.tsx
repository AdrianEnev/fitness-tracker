import { collection, doc, runTransaction } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import { Friend } from "../../interfaces";

const declineFriendRequest = async (user: Friend, navigation: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const friendRequestsDocRef = doc(userInfoCollectionRef, 'friendRequests');

    // delete sent from logged user
    const sentCollectionRef = collection(friendRequestsDocRef, 'received');
    const requestDocRef = doc(sentCollectionRef, user.id);

    // delete received from other user
    const otherUserDocRef = doc(usersCollectionRef, user.id);
    const otherUserInfoCollectionRef = collection(otherUserDocRef, 'user_info');
    const otherUserFriendRequestsDocRef = doc(otherUserInfoCollectionRef, 'friendRequests');
    const receivedCollectionRef = collection(otherUserFriendRequestsDocRef, 'sent');
    const receivedDocRef = doc(receivedCollectionRef, FIREBASE_AUTH.currentUser?.uid)

    try {
        await runTransaction(FIRESTORE_DB, async (transaction) => {
            transaction.delete(requestDocRef);
            transaction.delete(receivedDocRef);
        });
        console.log(`Steps 1 and 2 - successful (Deleted request to and by ${user.username})`);
        navigation.goBack()
    } catch (err) {
        console.error(`Steps 1 and 2 - error -> Error deleting request to and by ${user.username}: `, err);
    }
}

export default declineFriendRequest