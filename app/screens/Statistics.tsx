import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";
import { ScrollView } from 'react-native-gesture-handler';
import CaloriesBurnt from '../components/CaloriesBurnt';

const Statistics = () => {

    const [weightLifted, setWeightLifted] = useState(0);
    const [workoutsFinished, setWorkoutsFinished] = useState(0);
    const [formattedTotalWorkoutsDuration, setFormattedTotalWorkoutsDuration] = useState("");
    const [formattedAverageWorkoutDuration, setFormattedAverageWorkoutDuration] = useState("");
    const [formattedLastWorkoutDate, setFormattedLastWorkoutDate] = useState("");

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, "user_info");
    const statisticsDocRef = doc(userInfoCollectionRef, "statistics");

    const [getTotalWorkoutsDurationRan, setGetTotalWorkoutsDurationRan] = useState(false);
    const [getAverageWorkoutDurationRan, setGetAverageWorkoutDurationRan] = useState(false);
    const [getLastWorkoutDateRan, setGetLastWorkoutDateRan] = useState(false);

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

    const getAverageWorkoutDuration = async () => {
        const savedWorkoutsCollectionRef = collection(userDocRef, "saved_workouts");

        getDocs(savedWorkoutsCollectionRef).then((querySnapshot) => {
            let totalDuration = 0; // Initialize a local variable to accumulate durations
            let workoutCount = 0; // Initialize a local variable to count the number of workouts
            querySnapshot.forEach((doc) => {
                totalDuration += doc.data().duration; // Accumulate durations
                workoutCount++; // Increment workout count
            });

            const averageDuration = totalDuration / workoutCount; // Calculate average duration

            // Convert averageDuration to hours, minutes, and seconds
            const hours = Math.floor(averageDuration / 3600);
            const minutes = Math.floor((averageDuration % 3600) / 60);
            const seconds = averageDuration % 60;

            setFormattedAverageWorkoutDuration(
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

        setGetAverageWorkoutDurationRan(true);
    };

    const getLastWorkoutDate = async () => {
        const savedWorkoutsCollectionRef = collection(userDocRef, "saved_workouts");

        getDocs(savedWorkoutsCollectionRef).then((querySnapshot) => {
            let lastWorkoutDate = new Date(0); // Initialize a local variable to store the last workout date
            querySnapshot.forEach((doc) => {
                const workoutDate = doc.data().created.toDate(); // Get the workout date
                if (workoutDate > lastWorkoutDate) {
                    lastWorkoutDate = workoutDate; // Update the last workout date
                }
            });

            const day = lastWorkoutDate.getDate().toString().padStart(2, '0'); // Get the day and pad with zero if necessary
            const month = (lastWorkoutDate.getMonth() + 1).toString().padStart(2, '0'); // Get the month and pad with zero if necessary
            const year = lastWorkoutDate.getFullYear();

            const formattedDate = `${day}.${month}.${year}`; // Format the last workout date

            setFormattedLastWorkoutDate(formattedDate);
        }).catch((error) => {
            console.log("Error getting documents: ", error);
        });

        setGetLastWorkoutDateRan(true);
    }


    useEffect(() => {
        const unsubscribe = onSnapshot(statisticsDocRef, (doc) => {
            setWeightLifted(doc.data()?.weightLifted || 0);
            setWorkoutsFinished(doc.data()?.finishedWorkouts || 0);
        });

        if (!getTotalWorkoutsDurationRan) {
            getTotalWorkoutsDuration();
        }

        if (!getAverageWorkoutDurationRan) {
            getAverageWorkoutDuration();
        }

        if (!getLastWorkoutDateRan) {
            getLastWorkoutDate();

        }

        // Cleanup function
        return () => unsubscribe();
    }, []);

    const {t} = useTranslation();



    const barData1 = [
        {value: 250, label: 'M'},
        {value: 500, label: 'T', frontColor: '#177AD5'},
        {value: 745, label: 'W', frontColor: '#177AD5'},
        {value: 320, label: 'T'},
        {value: 600, label: 'F', frontColor: '#177AD5'},
        {value: 256, label: 'S'},
        {value: 300, label: 'S'},
      ];
    
    return (
        <View style={tw`h-full`}>

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('stats')}</Text>
            </View>

            <View style={tw`h-full w-full bg-white px-3 pt-3`}>

                <CaloriesBurnt />
                    
            </View>

        </View>
    )
}

export default Statistics