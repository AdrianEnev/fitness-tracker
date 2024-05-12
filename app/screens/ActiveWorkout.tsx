import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Alert, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from "twrnc";
import { FIREBASE_AUTH, FIRESTORE_DB, getCurrentDay, getCurrentSplit } from '../../firebaseConfig';
import { addDoc, collection, doc, getDocs, serverTimestamp } from 'firebase/firestore';
import { ExerciseInterface } from './Exercises';
import ActiveWorkoutExercises from '../components/ActiveWorkoutExercises';
import { endWorkout } from '../use/useEndWorkout';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ActiveWorkout = ({navigation}: any) => {

	const currentSplit = getCurrentSplit();
	const currentDay = getCurrentDay();

	const {t} = useTranslation();

	// vzima razmerite na iphone notcha i go razdelq na 4 che razmera da pasva na tailwind versiqta za razmeri
	const insets = useSafeAreaInsets();
	const notchSizeTailwind = Math.round(insets.top / 4);

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

	// vzima stoinosttite za opredeleno oprajnenie a getExercisesInfo izpolzva getRowValuesForExercise da vzeme dannite za absolutno vsichko
	// narochno sum go razdelil na 2 funkcii da se chete po lesno
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
					//console.log(`No input values available for exercise ${index + 1}`);
				}
			});
	
			return exerciseInfoArrays;
		} else {
			return [];
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
				const exercisesInfoArrays = getExercisesInfo();
				endWorkout(navigation, stopTimer, exercisesInfoArrays, false, currentDay, time);
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
		<View style={tw.style(`w-full h-full bg-white pt-${notchSizeTailwind}`)}>

			<View style={tw`flex flex-row justify-between mx-3`}>
				<Text style={tw`font-medium text-black text-lg`}>
					{
						formatTime(time)
					}
				</Text>

				<Pressable 
					style={tw`w-20 h-10 bg-green-500 rounded-md items-center justify-center rounded-lg`}
					onPress={() => 
						{
							const exercisesInfoArrays = getExercisesInfo();
					
							endWorkout(navigation, stopTimer, exercisesInfoArrays, true, currentDay, time)

						}
					}
				>
					<Text style={tw`text-white text-lg font-medium`}>{t('end-workout')}</Text>
				</Pressable>

			</View>
	
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
					<FlatList
					data={exerciseNumber <= exercises.length ? [exercises[exerciseNumber - 1]] : []}
					renderItem={({ item }: any) => (
						<ActiveWorkoutExercises
							item={item}
							updateInputValue={(key: string, value: string) => updateInputValue(item.id, key, value)}
							inputValue={inputValues[item.id] || {}}
							currentDay={currentDay}
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