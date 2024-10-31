import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import { Friend } from "../../interfaces";
import { User } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "../use/useGetEmail";

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

    console.log(loggedInUser.uid)
    console.log(user.username)

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

    // Add a document with the id of the user to the sent collection
    await setDoc(userDocRef, { username: user.username, id: user.id });
}

// Function to send a friend request
const sendFriendRequest = async (user: Friend, navigation: any) => {

    const loggedInUser = FIREBASE_AUTH.currentUser;

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
            alert('Вече е изпратена покана за приятелство към този потребител!')
        }
    }
}

export default sendFriendRequest;