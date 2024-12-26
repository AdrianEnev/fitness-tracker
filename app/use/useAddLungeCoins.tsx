import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import { useContext } from "react";
import GlobalContext from "../../GlobalContext";

export const addLungeCoins = async (coins: number) => {

    const {lungeCoinsAmount, setLungeCoinsAmount} = useContext(GlobalContext);
            
    console.log('addLungeCoins function ran...');
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    
    await getDoc(userDocRef).then(async (doc) => {
        if (doc.exists()) {
            const data = doc.data();
            
            data.lungeCoins += coins;
            await updateDoc(userDocRef, { lungeCoins: data.lungeCoins });
            setLungeCoinsAmount(lungeCoinsAmount + coins)
            console.log('lunge coins incremented:', data.lungeCoins);
        } else {
            console.log('No user document found.');
            return false;
        }
    })

}