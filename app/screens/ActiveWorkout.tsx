import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Pressable, Alert, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
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

	const [notes, setNotes] = useState<{index: number, note: string}[]>([]);

	let updateNote = (index: number, newNote: string) => {
		setNotes(prevNotes => {
			let newNotes = [...prevNotes];
			let noteObject = newNotes.find(note => note.index === index);
	
			if (noteObject) {
				noteObject.note = newNote;
			} else {
				newNotes.push({index: index, note: newNote});
			}
	
			return newNotes;
		});
	};

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
				endWorkout(navigation, stopTimer, exercisesInfoArrays, false, currentDay, time, t, notes);
				return;
			}

			// Create a new array without the current exercise
			const updatedExercises = exercises.filter((exercise) => exercise.id !== currentExerciseId);

			// Update the exercises state
			setExercises(updatedExercises);

			// move to the next exercise
			setExerciseNumber((prevIndex) => Math.min(exercises.length, prevIndex));

			// If the current exercise number is greater than the length of the updated exercises array
			if (exerciseNumber > updatedExercises.length) {
				// Set the exercise number to the last exercise in the updated list
				setExerciseNumber(updatedExercises.length);
			} else {
				// move to the next exercise
				setExerciseNumber((prevIndex) => Math.min(updatedExercises.length, prevIndex));
			}
		 
		}
	};

	const skipExercise = () => {

		// add an alert with an ok and cancel button
		Alert.alert(t('skip-exercise-alert'), '', [
			{
				text: t('cancel'),		
				style: 'cancel',
			},
			{ text: t('yes'), onPress: () => handleSkipExercise() },
		]);
		
	};

	const addSet = (exerciseId: string) => {
		// Find the exercise in the exercises array
		const exerciseIndex = exercises.findIndex(exercise => exercise.id === exerciseId);
	
		// If the exercise was found
		if (exerciseIndex !== -1) {
			// Create a copy of the exercises array
			const newExercises = [...exercises];

			const currentSets = Number(newExercises[exerciseIndex].sets);

			// If the current number of sets is less than 9
			if (currentSets < 15) {
				// Convert the sets property to a number, increment it, and then convert it back to a string
				newExercises[exerciseIndex].sets = (currentSets + 1).toString();

				// Update the exercises state
				setExercises(newExercises);
			}
		}
	};
	const deleteSet = (exerciseId: string) => {
		// Find the exercise in the exercises array
		const exerciseIndex = exercises.findIndex((exercise) => exercise.id === exerciseId);

		// If the exercise was found
		if (exerciseIndex !== -1) {
			// Create a copy of the exercises array
			const newExercises = [...exercises];

			// Convert the sets property to a number
			let currentSets = Number(newExercises[exerciseIndex].sets);

			// Check if there is more than 1 set
			if (currentSets > 1) {
				// Decrement the sets property and convert it back to a string
				newExercises[exerciseIndex].sets = (currentSets - 1).toString();
			}

			// Update the exercises state
			setExercises(newExercises);
		}
	};
	
	return (
		<View style={tw.style(`w-full h-full bg-white pt-${notchSizeTailwind}`)}>

			<View style={tw`flex flex-row justify-between mx-4 mb-3`}>

				<View style={tw`w-20 h-10 bg-white shadow-lg rounded-lg flex justify-center items-center`}>
					<Text style={tw`font-medium text-black text-xl`}>
						{
							formatTime(time)
						}
					</Text>
				</View>
				

				<Pressable 
					style={tw`w-20 h-10 bg-white rounded-lg shadow-lg items-center justify-center`}
					onPress={() => 
						{
							const exercisesInfoArrays = getExercisesInfo();
					
							endWorkout(navigation, stopTimer, exercisesInfoArrays, true, currentDay, time, t, notes)

						}
					}
				>
					<Text style={tw`text-black text-lg font-medium`}>{t('end-workout')}</Text>
				</Pressable>

			</View>


			<View>
				<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
						<FlatList
						bounces={true}
						data={exerciseNumber <= exercises.length ? [exercises[exerciseNumber - 1]] : []}
						renderItem={({ item }: any) => (
							<ActiveWorkoutExercises
								item={item}
								updateInputValue={(key: string, value: string) => updateInputValue(item.id, key, value)}
								inputValue={inputValues[item.id] || {}}
								currentDay={currentDay}
								skipExercise={skipExercise}
								addSet={() => addSet(item.id)}
								deleteSet={() => deleteSet(item.id)}
								previousExercise={previousExercise}
								exerciseNumber={exerciseNumber}
								nextExercise={nextExercise}
								exercises={exercises}
								notes={notes}
								updateNote={updateNote}
							/>
						)}
						keyExtractor={(exercise: ExerciseInterface) => exercise.id}
						/>
				</TouchableWithoutFeedback>
			</View>			
			

		</View>
	);
};

export default ActiveWorkout