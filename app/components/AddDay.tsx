import { Timestamp, addDoc, collection, doc, serverTimestamp } from 'firebase/firestore';
import tw from "twrnc";
import { Pressable, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { FIREBASE_AUTH, FIRESTORE_DB, getCurrentSplit } from '../../firebaseConfig';

export const AddDay = () => {

    const currentSplit = getCurrentSplit();

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userCollectionRef = collection(userDocRef, "user_splits");
    const splitDocRef = doc(userCollectionRef, currentSplit?.id);
    const daysCollectionRef = collection(splitDocRef, 'days');
    
    const addDay = async () => {
        try{

            const newDocumentData = {
                title: "Нов Ден",
                created: serverTimestamp(),
            };
        
            await addDoc(daysCollectionRef, newDocumentData);
            
        }catch (err) {
            console.log(err);
        }
    }

    return (
        <View style={tw`flex items-center`}>
            <Pressable style={tw`w-10 h-[44px] flex items-center justify-center`} onPress={addDay}>
                <Ionicons name='add-outline' size={44} color='black' style={tw`mr-[-15px]`}/>
            </Pressable>
        </View>
    )

}