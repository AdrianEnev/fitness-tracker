import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';

const Statistics = () => {

    const [weightLifted, setWeightLifted] = useState(0);
    const [workoutsFinished, setWorkoutsFinished] = useState(0);

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, "user_info");
    const statisticsDocRef = doc(userInfoCollectionRef, "statistics");

    
    useEffect(() => {
        const unsubscribe = onSnapshot(statisticsDocRef, (doc) => {
            setWeightLifted(doc.data()?.weightLifted || 0);
            setWorkoutsFinished(doc.data()?.finishedWorkouts || 0);
        });

        // Cleanup function
        return () => unsubscribe();
    }, []);

    const {t} = useTranslation();
    
    return (
        <View style={tw`h-full`}>

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('stats')}</Text>
            </View>

            <View style={tw`h-full w-full bg-white`}>
                <Text style={tw`m-3 text-lg font-medium`}>Weight lifted: {weightLifted} KG</Text>
                <Text style={tw`m-3 text-lg font-medium`}>Брой Тренировки: {workoutsFinished}</Text>
            </View>
        </View>
    )
}

export default Statistics