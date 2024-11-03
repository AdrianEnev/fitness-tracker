import { View, Text, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '../use/useGetEmail';
import BottomNavigationBar from '../components/BottomNavigationBar';

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

    const getTotalWorkoutsDurationAsyncStorage = async () => {
        
        const savedWorkoutsAS = await AsyncStorage.getItem('savedWorkouts')

        if (!savedWorkoutsAS) {
            setFormattedTotalWorkoutsDuration('No workouts')
            return
        }

        const workoutsData = JSON.parse(savedWorkoutsAS);

        if (!workoutsData || workoutsData.length === 0) {
            setFormattedTotalWorkoutsDuration('No workouts')
            return
        }
        
        let totalSeconds = 0

        workoutsData.forEach((workout: any) => {
            if (workout.duration !== undefined) {
                totalSeconds = totalSeconds + workout.duration;
            }
        });

        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

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

    }

    /*const getTotalWorkoutsDuration = async () => {

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
    };*/

    const getAverageWorkoutsDurationAsyncStorage = async () => {

        // get total seconds
        const savedWorkoutsAS = await AsyncStorage.getItem('savedWorkouts')
        if (!savedWorkoutsAS) {
            setFormattedAverageWorkoutDuration('No workouts')
            return
        }

        const workoutsData = JSON.parse(savedWorkoutsAS);
        if (!workoutsData || workoutsData.length === 0) {
            setFormattedAverageWorkoutDuration('No workouts')
            return
        }
        
        let totalSeconds = 0
        workoutsData.forEach((workout: any) => {
            if (workout.duration !== undefined) {
                totalSeconds = totalSeconds + workout.duration;
            }
        });

        let workoutCount = 0
        workoutsData.forEach(() => {
            workoutCount = workoutCount + 1
        });

        const averageDuration = totalSeconds / workoutCount;
        const hours = Math.floor(averageDuration / 3600) || 0;
        const minutes = Math.floor((averageDuration % 3600) / 60) || 0;
        const seconds = averageDuration % 60 || 0;

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
    }

    /*const getAverageWorkoutDuration = async () => {
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
            const hours = Math.floor(averageDuration / 3600) || 0;
            const minutes = Math.floor((averageDuration % 3600) / 60) || 0;
            const seconds = averageDuration % 60 || 0;

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
    };*/

    const getLastWorkoutDateAsyncStorage = async () => {
        const savedWorkoutsAS = await AsyncStorage.getItem('savedWorkouts')
        if (!savedWorkoutsAS) {
            setFormattedLastWorkoutDate('No workouts')
            return
        }

        const workoutsData = JSON.parse(savedWorkoutsAS);
        if (!workoutsData || workoutsData.length === 0) {
            setFormattedLastWorkoutDate('No workouts')
            return
        }

        let lastWorkoutDate = new Date(0);

        workoutsData.forEach((workout: any) => {
            const workoutDate = new Date(workout.created);
            
            if (workoutDate > lastWorkoutDate) {
                lastWorkoutDate = workoutDate;
            }
        });

        setFormattedLastWorkoutDate(lastWorkoutDate.toString());

    }

    /*const getLastWorkoutDate = async () => {
        const savedWorkoutsCollectionRef = collection(userDocRef, "saved_workouts");

        getDocs(savedWorkoutsCollectionRef).then((querySnapshot) => {
            if (querySnapshot.empty) {
                setFormattedLastWorkoutDate("None");
                return;
            }

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
    }*/

    const getWeightLiftedAndFinishedWorkouts = async () => {

        const email = await getEmail();
        const statisticsAS = await AsyncStorage.getItem(`statistics_${email}`);

        if (!statisticsAS) return

        const statistics = JSON.parse(statisticsAS)

        setWorkoutsFinished(statistics.finishedWorkouts)
        setWeightLifted(statistics.weightLifted)

    }

    useEffect(() => {
        
        /*const unsubscribe = onSnapshot(statisticsDocRef, (doc) => {
            setWeightLifted(doc.data()?.weightLifted || 0);
            setWorkoutsFinished(doc.data()?.finishedWorkouts || 0);
        });*/
        getWeightLiftedAndFinishedWorkouts();
        
        //getTotalWorkoutsDuration();
        getTotalWorkoutsDurationAsyncStorage();
    
        //getAverageWorkoutDuration();
        getAverageWorkoutsDurationAsyncStorage();
    
        //getLastWorkoutDate();
        getLastWorkoutDateAsyncStorage();

        // Cleanup function
        //return () => unsubscribe();
    }, []);

    const {t} = useTranslation();
    
    return (
        <View style={tw`h-full`}>

            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('stats')}</Text>
            </View>

            <View style={tw`h-full w-full bg-white px-3 flex flex-col gap-y-2 pt-3`}>

                <View style={tw`w-full h-64 mb-1 shadow-lg`}>
                    <View style={tw`w-full h-full border border-gray-300`}>
                        
                    </View>
                </View>
                
                <View style={tw`w-full h-12 bg-[#fd1c47] rounded-md`}>
                    <Text style={tw`m-3 text-lg font-medium text-white`}>Weight lifted: {weightLifted} KG</Text>
                </View>

                <View style={tw`w-full h-12 bg-[#fd1c47] rounded-md`}>
                    <Text style={tw`m-3 text-lg font-medium text-white`}>Number of workouts: {workoutsFinished}</Text>
                </View>

                <View style={tw`w-full h-12 bg-[#fd1c47] rounded-md`}>
                    <Text style={tw`m-3 text-lg font-medium text-white`}>Total workouts duration: {formattedTotalWorkoutsDuration}</Text>
                </View>

                <View style={tw`w-full h-12 bg-[#fd1c47] rounded-md`}>
                    <Text style={tw`m-3 text-lg font-medium text-white`}>Average workout duration: {formattedAverageWorkoutDuration}</Text>
                </View>

                <View style={tw`w-full h-12 bg-[#fd1c47] rounded-md`}>
                    <Text style={tw`m-3 text-lg font-medium text-white`}>Last workout: {formattedLastWorkoutDate}</Text>
                </View>
                
            </View>

            <BottomNavigationBar currentPage='Statistics'/>

        </View>

    )
}

export default Statistics