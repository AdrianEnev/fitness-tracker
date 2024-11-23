import { collection, doc, runTransaction } from "firebase/firestore";
import { Friend } from "../../interfaces";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";

const removeFriend = async (friend: Friend) => {
    //console.log('running remove friend');

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const friendsDocRef = doc(userInfoCollectionRef, 'friends');

    const loggedInUserFriendsCollectionRef = collection(friendsDocRef, 'list');
    const loggedInUserFriendDocRef = doc(loggedInUserFriendsCollectionRef, friend.id);

    const friendUserDocRef = doc(usersCollectionRef, friend.id);
    const friendUserInfoCollectionRef = collection(friendUserDocRef, 'user_info');
    const friendFriendsDocRef = doc(friendUserInfoCollectionRef, 'friends');
    const friendFriendsCollectionRef = collection(friendFriendsDocRef, 'list');
    const friendFriendDocRef = doc(friendFriendsCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    
    //console.log('About to delete documents');

    try {
        await runTransaction(FIRESTORE_DB, async (transaction) => {
            transaction.delete(loggedInUserFriendDocRef);
            transaction.delete(friendFriendDocRef);
        });
        console.log('Delete operations successful');
    } catch (err) {
        console.error('Error deleting documents:', err);
    }

}

export default removeFriend;