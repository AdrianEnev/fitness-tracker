import { collection, doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";

const checkForBiometrics = async () => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, "user_info")
    const faceIdEnabledDocRef = doc(userInfoCollectionRef, 'faceIdEnabled');

    const faceIdEnabledDoc = await getDoc(faceIdEnabledDocRef);
    if (faceIdEnabledDoc.exists()) {
        const data = faceIdEnabledDoc.data();
        
        if (data.faceIdEnabled) {
            return true
        } else{
            return false
        }
    }

}

export default checkForBiometrics