import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from 'twrnc'

const Statistics = () => {

    const [weightLifted, setWeightLifted] = useState(0);

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, "user_info");
    const weightLiftedDocRef = doc(userInfoCollectionRef, "weight_lifted");

    
    useEffect(() => {
        const unsubscribe = onSnapshot(weightLiftedDocRef, (doc) => {
            setWeightLifted(doc.data()?.weight);
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);
    
    return (
        <SafeAreaView>
            <Text style={tw`m-3 text-lg font-medium`}>Weight lifted: {weightLifted} KG</Text>
        </SafeAreaView>
    )
}

export default Statistics