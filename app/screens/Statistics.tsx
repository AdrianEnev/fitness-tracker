import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import { useFocusEffect } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const Statistics = () => {

    const [weightLifted, setWeightLifted] = useState(0);
    const [workoutsFinished, setWorkoutsFinished] = useState(0);

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, "user_info");
    const statisticsDocRef = doc(userInfoCollectionRef, "statistics");

    const [formattedTotalWorkoutsDuration, setFormattedTotalWorkoutsDuration] = useState("");

    const [getTotalWorkoutsDurationRan, setGetTotalWorkoutsDurationRan] = useState(false);

    const getTotalWorkoutsDuration = async () => {

        const savedWorkoutsCollectionRef = collection(userDocRef, "saved_workouts");
    
        getDocs(savedWorkoutsCollectionRef).then((querySnapshot) => {
            let totalDuration = 0; // Initialize a local variable to accumulate durations
            querySnapshot.forEach((doc) => {
                totalDuration += doc.data().duration; // Accumulate durations
            });
            
            
            // totalDuration is in seconds, convert it to hours, minutes and seconds
            const hours = Math.floor(totalDuration / 3600);
            const minutes = Math.floor((totalDuration % 3600) / 60);
            const seconds = totalDuration % 60;

            setFormattedTotalWorkoutsDuration(
                (() => {
                    switch (true) {
                        case hours === 0 && minutes === 0 && seconds === 1:
                            return `${seconds} second`;
                        case hours === 0 && minutes === 0 && seconds > 1:
                            return `${seconds} seconds`;
                        case hours === 0 && minutes === 1 && seconds === 1:
                            return `${minutes} minute and ${seconds} second`;
                        case hours === 0 && minutes > 1 && seconds === 1:
                            return `${minutes} minutes and ${seconds} second`;
                        case hours === 0 && minutes === 1 && seconds > 1:
                            return `${minutes} minute and ${seconds} seconds`;
                        case hours === 0 && minutes > 1 && seconds > 1:
                            return `${minutes} minutes and ${seconds} seconds`;
                        case hours === 1 && minutes === 1:
                            return `${hours} hour and ${minutes} minute`;
                        case hours === 1 && minutes > 1:
                            return `${hours} hour and ${minutes} minutes`;
                        case hours === 1 && minutes === 0 && seconds === 0:
                            return `${hours} hour`;
                        case hours > 1 && minutes === 0 && seconds === 0:
                            return `${hours} hours`;
                        case hours > 1 && minutes === 1:
                            return `${hours} hours and ${minutes} minute`;
                        case hours > 1 && minutes > 1:
                            return `${hours} hours and ${minutes} minutes`;
                        case hours === 1 && minutes === 0 && seconds >= 1:
                            return `${hours} hour`;
                        case hours > 1 && minutes === 0 && seconds >= 1:
                            return `${hours} hours`;
                        default:
                            return `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
                    }
                })()
            );


        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });
    
        setGetTotalWorkoutsDurationRan(true);
    };


    useEffect(() => {
        const unsubscribe = onSnapshot(statisticsDocRef, (doc) => {
            setWeightLifted(doc.data()?.weightLifted || 0);
            setWorkoutsFinished(doc.data()?.finishedWorkouts || 0);
        });

        if (!getTotalWorkoutsDurationRan) {
            getTotalWorkoutsDuration();
        }

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
                <Text style={tw`m-3 text-lg font-medium`}>Total-weight-lifted: {weightLifted} KG</Text>
                <Text style={tw`m-3 text-lg font-medium`}>Number-of-workouts: {workoutsFinished}</Text>
                <Text style={tw`m-3 text-lg font-medium`}>Total workouts duration: {formattedTotalWorkoutsDuration}</Text>
                <Text style={tw`m-3 text-lg font-medium`}>Average workout duration</Text>
                <Text style={tw`m-3 text-lg font-medium`}>Last workout</Text>
            </View>
        </View>
    )
}

export default Statistics