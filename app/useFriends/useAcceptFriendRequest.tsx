import { collection, doc, runTransaction } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import { Friend } from "../../interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../use/useGetEmail";

const acceptFriendRequest = async (user: Friend, navigation: any) => {

    const email = await getEmail();
    const loggedInUserUsername = await AsyncStorage.getItem(`username_${email}`)

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const friendRequestsDocRef = doc(userInfoCollectionRef, 'friendRequests');
 
    // delete sent from logged user - Step 1
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
    } catch (err) {
        console.error(`Steps 1 and 2 - error -> Error deleting request to and by ${user.username}: `, err);
    }

    // Add to friends list - Step 2
    const otherUserFriendsDocRef = doc(otherUserInfoCollectionRef, 'friends');
    const loggedInUserFriendsDocRef = doc(userInfoCollectionRef, 'friends');

    try {
        await runTransaction(FIRESTORE_DB, async (transaction) => {
            const otherUserFriendsDoc = await transaction.get(otherUserFriendsDocRef);
            const loggedInUserFriendsDoc = await transaction.get(loggedInUserFriendsDocRef);

            if (!otherUserFriendsDoc.exists()) {
                transaction.set(otherUserFriendsDocRef, {});
            }
            if (!loggedInUserFriendsDoc.exists()) {
                transaction.set(loggedInUserFriendsDocRef, {});
            }

            const otherUserFriendsCollectionRef = collection(otherUserFriendsDocRef, 'list');
            const loggedInUserFriendsCollectionRef = collection(loggedInUserFriendsDocRef, 'list');

            transaction.set(doc(otherUserFriendsCollectionRef, FIREBASE_AUTH.currentUser?.uid), { username: loggedInUserUsername, id: FIREBASE_AUTH.currentUser?.uid });
            transaction.set(doc(loggedInUserFriendsCollectionRef, user.id), { username: user.username, id: user.id });
        });

        console.log('Step 3 - successful (added friends to both users)');
        navigation.goBack();

    } catch (err) {
        console.error('Step 3 - error ->', err);
    }
    
}

export default acceptFriendRequest