
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";

const checkFaceIdEnabled = async () => {
    
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const faceIdEnabledDocRef = doc(userInfoCollectionRef, 'faceIdEnabled');

    const faceIdEnabledDoc = await getDoc(faceIdEnabledDocRef);
    
    if (faceIdEnabledDoc.exists()) {
        return faceIdEnabledDoc.data().faceIdEnabled;
    } else {
        await setDoc(faceIdEnabledDocRef, { faceIdEnabled: false });
        return false;
    }
    
}

export default checkFaceIdEnabled;