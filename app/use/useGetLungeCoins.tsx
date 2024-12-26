import { collection, doc, getDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";

export const getLungeCoins = async () => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);

    const userInfo = await getDoc(userDocRef).then((doc) => {
        if (doc.exists()) {
            const data = doc.data();

            console.log('lunge coins fetched:', data.lungeCoins);
            return data.lungeCoins;
        } else {
            console.log('No user document found.');
            return 0; // Return 0 if no document is found
        }
    });

    return userInfo;
}