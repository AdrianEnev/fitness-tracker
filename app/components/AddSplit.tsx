import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, View } from 'react-native'
import tw from "twrnc";

import { collection, addDoc, doc, serverTimestamp } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";

const AddSplit = () => {

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userCollectionRef = collection(userDocRef, "user_splits");

    const addSplit = async () => {
        
        try{
            const newDocumentData = {
                title: "Нова Програма",
                created: serverTimestamp()
            };
        
            await addDoc(userCollectionRef, newDocumentData);
            
        }catch (err) {
            console.log(err);
        }

    }

    return (
        <View style={tw`flex items-center`}>
            <Pressable style={tw`w-10 h-[44px] flex items-center justify-center`} onPress={addSplit}>
                <Ionicons name='add-outline' size={44} color='black' style={tw`mr-[-15px]`}/>
            </Pressable>
        </View>
    );

}

export default AddSplit;