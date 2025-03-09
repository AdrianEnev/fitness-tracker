import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import { Friend } from "../../interfaces";
import { User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../use/useGetEmail";
import { useTranslation } from "react-i18next";

// Function to send a friend request to a user
const sendFriendRequestToUser = async (user: Friend, loggedInUser: User) => {
    
    const email = await getEmail();
    const loggedInUserUsername = await AsyncStorage.getItem(`username_${email}`)

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, user.id);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const friendRequestsDocRef = doc(userInfoCollectionRef, 'friendRequests');
    const friendRequestsDoc = await getDoc(friendRequestsDocRef);

    // If the friendRequests document doesn't exist, create it
    if (!friendRequestsDoc.exists()) {
        await setDoc(friendRequestsDocRef, {});
    }

    const receivedCollectionRef = collection(friendRequestsDocRef, 'received');
    // Add a document with the id of the logged in user to the received collection
    const loggedInUserDocRef = doc(receivedCollectionRef, loggedInUser.uid);
    await setDoc(loggedInUserDocRef, { username: loggedInUserUsername, id: loggedInUser.uid });
}

// Function to send a friend request from the logged in user
const sendFriendRequestFromUser = async (user: Friend, loggedInUser: User) => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const loggedInUserDocRef = doc(usersCollectionRef, loggedInUser.uid);
    const userInfoCollectionRef = collection(loggedInUserDocRef, 'user_info');
    const friendRequestsDocRef = doc(userInfoCollectionRef, 'friendRequests');
    const friendRequestsDoc = await getDoc(friendRequestsDocRef);

    // If the friendRequests document doesn't exist, create it
    if (!friendRequestsDoc.exists()) {
        await setDoc(friendRequestsDocRef, {});
    }

    const sentCollectionRef = collection(friendRequestsDocRef, 'sent');
    const userDocRef = doc(sentCollectionRef, user.id);
    const userDoc = await getDoc(userDocRef);

    // If the document exists, throw an error because a friend request has already been sent to this user
    if (userDoc.exists()) {
        throw new Error('Friend request already sent');
    }

    // Get the number of existing sent friend requests
    const sentRequestsSnapshot = await getDocs(sentCollectionRef);
    const numSentRequests = sentRequestsSnapshot.size;

    // Check if the user has already sent 9 friend requests
    if (numSentRequests >= 9) {
        throw new Error('You can only send 9 friend requests at a time.');
    }

    // Add a document with the id of the user to the sent collection
    await setDoc(userDocRef, { username: user.username, id: user.id });
}

const isFriendLimitReached = async (loggedInUser: any) => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const loggedInUserDocRef = doc(usersCollectionRef, loggedInUser.uid);
    const userInfoCollectionRef = collection(loggedInUserDocRef, 'user_info');
    const friendsDocRef = doc(userInfoCollectionRef, 'friends');
    const friendsListCollectionRef = collection(friendsDocRef, 'list')

    // if friendsListCollectionRef contains 5 or more documents, return true
    const friendsSnapshot = await getDocs(friendsListCollectionRef);
    const numFriends = friendsSnapshot.size;

    // Friend limit -> 5
    return numFriends >= 5; 
}

// Function to send a friend request
const sendFriendRequest = async (user: Friend, navigation: any) => {

    const {t} = useTranslation();

    const loggedInUser = FIREBASE_AUTH.currentUser;

    if (await isFriendLimitReached(loggedInUser)) {
        alert(t('friend-limit-reached'))
        return;
    }

    if (loggedInUser) {
        try {

            // Send a friend request to the user
            await sendFriendRequestToUser(user, loggedInUser);
            // Send a friend request from the logged in user
            await sendFriendRequestFromUser(user, loggedInUser);
            
            navigation.goBack();

        } catch (error) {
            // If an error occurs, display it in an alert
            console.log(error);
            alert(t('friend-request-already-sent'))
        }
    }
}

export default sendFriendRequest;