import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "@config/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

const checkReceiveFriendRequests = async () => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const receiveFriendRequestsDocRef = doc(userInfoCollectionRef, 'receiveFriendRequests');

    const receiveFriendRequestsDoc = await getDoc(receiveFriendRequestsDocRef);
    
    if (receiveFriendRequestsDoc.exists()) {
        return receiveFriendRequestsDoc.data().receiveFriendRequests;
    } else {
        await setDoc(receiveFriendRequestsDocRef, { receiveFriendRequests: true });
        return true;
    }
    
}


export default checkReceiveFriendRequests