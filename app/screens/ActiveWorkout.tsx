import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Alert, FlatList, Button, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from "twrnc";
import { FIREBASE_AUTH, FIRESTORE_DB, getCurrentDay, getCurrentSplit } from '../../firebaseConfig';
import { addDoc, collection, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ExerciseInterface } from './Exercises';
import ActiveWorkoutExercises from '../components/ActiveWorkoutExercises';
import { endWorkout } from '../use/useEndWorkout';

const ActiveWorkout = ({navigation}: any) => {

	const currentSplit = getCurrentSplit();
	const currentDay = getCurrentDay();

	const usersCollectionRef = collection(FIRESTORE_DB, 'users');
	const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);

	const userCollectionRef = collection(userDocRef, 'user_splits');

	const splitDocRef = doc(userCollectionRef, currentSplit?.id);
	const daysCollectionRef = collection(splitDocRef, 'days');
	const exerciseDocRef = doc(daysCollectionRef, currentDay?.id);
	const exercisesCollectionRef = collection(exerciseDocRef, 'exercises');

	const [exerciseNumber, setExerciseNumber] = useState(1);

	const [exercises, setExercises] = useState<ExerciseInterface[]>([]);

	const [inputValues, setInputValues] = useState<{ [key: string]: { [key: string]: string } }>({});

	const updateInputValue = (exerciseId: string, key: string, value: string) => {
		setInputValues((prevValues) => ({
			...prevValues,
			[exerciseId]: {
				...prevValues[exerciseId],
				[key]: value,
			},
		}));
	};

	const getExercises = async () => {
		try {
				const data = await getDocs(exercisesCollectionRef);
	
				const filteredData: ExerciseInterface[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ExerciseInterface));
				filteredData.sort((a, b) => a.exerciseIndex - b.exerciseIndex);
	
				setExercises(filteredData);
				
		} catch (err) {
				console.error(err);
		}
	}
	useEffect(() => {
		getExercises();
	}, []);

	const [time, setTime] = useState(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const startTimeRef = useRef<number>(0);

	const startTimer = () => {
		startTimeRef.current = Date.now() - time * 1000;
		intervalRef.current = setInterval(() => {
			setTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
		}, 1000);
	};

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		const timeString = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
		return timeString;
	};

	const stopTimer = () => {
		if (intervalRef.current !== null) {
			clearInterval(intervalRef.current);
		}
	};

	useEffect(() => {
		startTimer();

		return () => {
			stopTimer();
		};
	}, []);

	useEffect(() => {
		const headerOptions = {
			headerLeft: () => (
				<Text style={tw`font-medium mr-3 text-white text-base`}>
					{
						formatTime(time)
					}
				</Text>
			),
			headerRight: () => (
				<Pressable onPress={() => endWorkout(navigation, stopTimer, saveWorkoutToDB, true)} style={tw`mr-[-18px] mt-[-1px]`}>
					<Ionicons name='stop-circle-outline' size={44} color='#FF0000'/>
				</Pressable>
			)
		};

		navigation.setOptions(headerOptions);
	}, [navigation, time]);

	const getRowValuesForExercise = (
		inputValues: { [key: string]: string },
		exerciseId: string,
		exerciseTitle: string,
		exerciseIndex: number
	): { [rowNumber: number]: { [key: string]: string | number; exerciseTitle: string; exerciseIndex: number } } => {
		const rowValues: { [rowNumber: number]: { [key: string]: string | number; exerciseTitle: string; exerciseIndex: number } } = Object.keys(inputValues)
			.filter((key) => key.startsWith(`${exerciseId}-`)) // Filter by exerciseId
			.reduce<{ [rowNumber: number]: { [key: string]: string | number; exerciseTitle: string; exerciseIndex: number } }>((acc, key) => {
				const [, rowNumberStr, inputType] = key.split('-');
				const rowNumber = parseInt(rowNumberStr, 10);
	
				if (!acc[rowNumber]) {
					acc[rowNumber] = { exerciseTitle, exerciseIndex };
				}
	
				acc[rowNumber][inputType] = inputValues[key];
				return acc;
			}, {});
	
		return rowValues;
	};
	
	const getExercisesInfo = () => {
		if (exercises.length > 0) {
			const exerciseInfoArrays: any[] = [];
	
			exercises.forEach((exercise, index) => {
				const exerciseId = exercise.id;
	
				if (inputValues[exerciseId]) {
					const rowValues = getRowValuesForExercise(inputValues[exerciseId], exerciseId, exercise.title, index + 1);
					exerciseInfoArrays.push(rowValues);
				} else {
					console.log(`No input values available for exercise ${index + 1}`);
				}
			});
	
			return exerciseInfoArrays;
		} else {
			return [];
		}
	};
	
	const saveWorkoutToDB = async () => {
		try {
			const currentDayTitle = currentDay?.title;
	
			if (currentDayTitle) {
				const exercisesInfoArrays = getExercisesInfo();
	
				if (exercisesInfoArrays.length === 0) {
					console.log('No exercises to save. Workout not saved.');
					return;
				}

				// format the current duration of the workout
				const minutes = Math.floor(time / 60);
                const hours = Math.floor(minutes / 60);
                const remainingMinutes = minutes % 60;
                const remainingSeconds = time % 60;
                let timeString: string;

                if (hours == 1) {
                    timeString = `${String(hours)} час и ${String(remainingMinutes)} минути`;
                }  
                else if (hours > 1) {
                    timeString = `${String(hours)} часа и ${String(remainingMinutes)} минути`;
                } else if (minutes > 0) {
                    timeString = `${String(minutes)} минути`;
                } else {
                    timeString = `${String(remainingSeconds)} секунди`;
                }
					
				const usersCollectionRef = collection(FIRESTORE_DB, 'users');
				const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
				const savedWorkoutsCollectionRef = collection(userDocRef, 'saved_workouts');
				const savedWorkoutDocRef = await addDoc(savedWorkoutsCollectionRef, {
					saved: serverTimestamp(),
					title: currentDayTitle,
				});
				const exerciseInfoCollectionRef = collection(savedWorkoutDocRef, 'info');
	
				const savePromises = exercisesInfoArrays.map(async (exerciseInfo, index) => {
					const exerciseDocRef = await addDoc(exerciseInfoCollectionRef, {
						title: exerciseInfo[1].exerciseTitle,
						exerciseIndex: exerciseInfo[1].exerciseIndex,
						saved: serverTimestamp(),
						workoutDuration: timeString,
					});
	
					for (const rowNumber in exerciseInfo) {
						const rowInfo = exerciseInfo[rowNumber];
						const setCollectionRef = collection(exerciseDocRef, 'sets');
	
						const repsValue = rowInfo.reps !== undefined ? rowInfo.reps : 'N/A';
						const weightValue = rowInfo.weight !== undefined ? rowInfo.weight : 'N/A';
						const rpeValue = rowInfo.rpe !== undefined ? rowInfo.rpe : 'N/A';
	
						await addDoc(setCollectionRef, {
							reps: repsValue,
							weight: weightValue,
							rpe: rpeValue,
						});
					}
				});
	
				await Promise.all(savePromises);
	
				console.log('Workout saved successfully!');
			}
		} catch (error) {
			console.error('Error saving workout:', error);
		}
		
	};

	const nextExercise = () => {
		setExerciseNumber((prevIndex) => Math.min(exercises.length, prevIndex + 1));
	};
	
	const previousExercise = () => {
		setExerciseNumber((prevIndex) => Math.max(0, prevIndex - 1));
	};

	const handleSkipExercise = () => {
		// Get the ID of the current exercise
		const currentExerciseId = exercises[exerciseNumber - 1]?.id;

		if (currentExerciseId) {

			if (exercises.length === 1) {
				// ends the workout without saving anything to the database if the last exercise is skipped
				endWorkout(navigation, stopTimer, saveWorkoutToDB, false);
				return;
			}

			// Create a new array without the current exercise
			const updatedExercises = exercises.filter((exercise) => exercise.id !== currentExerciseId);

			// Update the exercises state
			setExercises(updatedExercises);

			// move to the next exercise
			setExerciseNumber((prevIndex) => Math.min(exercises.length, prevIndex));
		 
		}
	};

	const skipExercise = () => {

		// add an alert with an ok and cancel button
		Alert.alert('Сигурен ли си, че искаш да пропуснеш това упражнение?', '', [
			{
				text: 'Отказ',		
				style: 'cancel',
			},
			{ text: 'Да', onPress: () => handleSkipExercise() },
		]);
		
	};
	
	return (
		<View style={tw`w-full h-full bg-white`}>
		
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<FlatList
						data={exerciseNumber <= exercises.length ? [exercises[exerciseNumber - 1]] : []}
						renderItem={({ item }: any) => (
							<ActiveWorkoutExercises
							item={item}
							updateInputValue={(key: string, value: string) => updateInputValue(item.id, key, value)}
							inputValue={inputValues[item.id] || {}}
							/>
						)}
						keyExtractor={(exercise: ExerciseInterface) => exercise.id}
						/>
				</TouchableWithoutFeedback>

				<View style={tw`flex flex-row justify-between mx-3 mt-[-10px]`}>

					<Pressable onPress={previousExercise} disabled={exerciseNumber === 1}>
						<Ionicons name='arrow-back-circle-outline' size={77} color='#3B82F6'/>
					</Pressable>
					
					<Pressable style={tw`flex items-center justify-center`} onPress={skipExercise}>
						<Ionicons name='close-circle-outline' size={77} color='#FF0000'/>
					</Pressable>

					<Pressable  onPress={nextExercise} disabled={exerciseNumber === exercises.length}>
						<Ionicons name='arrow-forward-circle-outline' size={77} color='#3B82F6'/>
					</Pressable>
            
				</View>

		</View>
	);
};

export default ActiveWorkout