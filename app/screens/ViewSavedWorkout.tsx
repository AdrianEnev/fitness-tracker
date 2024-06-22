import { View, Text, TouchableOpacity, SafeAreaView, TouchableWithoutFeedback, Keyboard, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from 'twrnc'
import BottomNavigationBar from '../components/BottomNavigationBar';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { collection, deleteDoc, doc } from 'firebase/firestore';
import getSavedWorkoutInfo from '../use/useGetSavedWorkoutInfo';

const ViewSavedWorkout = ({navigation, route}: any) => {

    const { workout, date, time } = route.params;

    const getExercises = async () => {

        const savedWorkoutInfo = await getSavedWorkoutInfo(workout.id);
        if (savedWorkoutInfo) {

            const { exercisesData, workoutTitle } = savedWorkoutInfo;
            setExercises(exercisesData);
            setWorkoutTitle(workoutTitle);
        }
    }

    const [currentIndex, setCurrentIndex] = useState(0);

    const [exercises, setExercises] = useState<any>([]); 
    const [newExercises, setNewExercises] = useState<any>([]); 
    const [workoutTitle, setWorkoutTitle] = useState('');

    useEffect(() => {
        getExercises();
    }, []);

    useEffect(() => {
        setNewExercises([...exercises]);
    }, [exercises]);

    const deleteSavedWorkout = async () => {

        const deleteWorkout = async () => {
           
            const usersCollectionRef = collection(FIRESTORE_DB, 'users');
            const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
            const savedWorkoutsCollectionRef = collection(userDocRef, 'saved_workouts');

            await deleteDoc(doc(savedWorkoutsCollectionRef, workout.id));
            navigation.navigate('Запазени-Тренировки');

        }

        Alert.alert(
            'Изтриване на Тренировка',
            'Сигурен ли си, че искаш да изтриеш тази тренировка?',
            [
            {
                text: 'Отказ',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            },
            { text: 'Изтрий', onPress: () => deleteWorkout() }
            ],
            { cancelable: false }
        );
       
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>


                {exercises.length === 0 ? (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <ActivityIndicator size='large' color="#fd3e6b" />
                    </View>
                ) : (

                    <SafeAreaView style={tw`w-full h-full`}>
                
                        <View style={tw`flex flex-col mx-3 mb-3`}>
                            <Text style={tw`text-2xl font-medium`}>{workoutTitle}</Text>
                        </View>

                        <View style={tw`flex flex-col gap-y-1`}>
                            {newExercises.map((exercise: any, index: any) => {
                                if (exercise.exerciseIndex === currentIndex + 1) {
                                    return (
                                        <View key={exercise.id} style={tw`w-full`}>

                                            <Text style={tw`text-2xl text-center mb-4`} numberOfLines={1}>{exercise.title}</Text>
                                            
                                            <ScrollView style={tw``}>
                                                {exercise.sets.sort((a: any, b: any) => a.setIndex - b.setIndex).map((set: any, mapIndex: any) => (
                                                    <View key={set.id} style={tw`ml-3`}>
                                                        <View style={tw`flex flex-row gap-x-2`}>
                                                            <View style={tw`w-10 h-10 bg-white rounded-xl flex items-center justify-center`}>
                                                                <Text style={tw`text-base ml-5 absolute font-medium`}>{mapIndex + 1}</Text>
                                                            </View>

                                                            <View style={tw`flex flex-row gap-x-2 mb-3 w-full`}>

                                                                <View style={tw`w-1/3 h-10 bg-white rounded-2xl flex items-start justify-center`}>
                                                                    <Text style={tw`ml-3`}>{set.reps === "" ? '0 Повторения' : set.reps.toString() + ' Повторения'}</Text>
                                                                </View>

                                                                <View style={tw`w-1/3 h-10 bg-white rounded-2xl flex items-start justify-center`}>
                                                                    <Text style={tw`ml-3`}>{set.weight === "" ? '0 KG' : set.weight.toString() + ' KG'}</Text>
                                                                </View>

                                                                <View style={tw`w-1/3 h-10 bg-white rounded-2xl flex items-start justify-center`}>
                                                                    <Text style={tw`ml-3`}>{set.rpe === "" ? '0 KG' : set.rpe.toString() + ' KG'}</Text>
                                                                </View>


                                                            </View>
                                                        </View>
                                                    </View>
                                                ))}

                                                

                                            </ScrollView>
                                        </View>
                                    );
                                }
                            })}
                        </View>

                        <BottomNavigationBar
                            currentPage='SavedWorkout'
                            navigation={navigation}
                            forwardButton={() => setCurrentIndex((currentIndex + 1) % newExercises.length)}
                            backButton={() => setCurrentIndex((currentIndex - 1 + newExercises.length) % exercises.length)}
                            deleteSavedWorkout={deleteSavedWorkout}
                        />

                    </SafeAreaView>
                    
                )}

            
        </TouchableWithoutFeedback>
    );
}

export default ViewSavedWorkout;