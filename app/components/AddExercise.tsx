import { addDoc, collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import tw from "twrnc";
import { Alert, Pressable } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { FIREBASE_AUTH, FIRESTORE_DB, getCurrentDay, getCurrentSplit } from '../../firebaseConfig';
import { ExerciseInterface } from '../screens/Exercises';
import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

export const AddExercise = () => {

    const {t} = useTranslation();

    const [exerciseTitle, setExerciseTitle] = useState<string>("New Exercise");
    const [isDisabled, setIsDisabled] = useState(false);

    useFocusEffect(() => {

        const currentLanguage = i18next.language;

        if (currentLanguage == "bg") {
            setExerciseTitle("Ново Упражнение");
        } else {    
            setExerciseTitle("New Exercise");
        }

    });

    const currentSplit = getCurrentSplit();
    const currentDay = getCurrentDay();

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userCollectionRef = collection(userDocRef, "user_splits");
    const splitDocRef = doc(userCollectionRef, currentSplit?.id);
    const daysCollectionRef = collection(splitDocRef, 'days');
    const exerciseDocRef = doc(daysCollectionRef, currentDay?.id);
    const exercisesCollectionRef = collection(exerciseDocRef, 'exercises');

    const addExercise = async () => {
        try {

            setIsDisabled(true);

            // Fetch the latest exercises
            const data = await getDocs(exercisesCollectionRef);
            const filteredData: ExerciseInterface[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ExerciseInterface));
    
            // Find the maximum index among existing exercises
            const maxIndex = Math.max(...filteredData.map((exercise) => exercise.exerciseIndex), 0);
    
            // Calculate the new index for the next exercise
            const newIndex = maxIndex === 0 ? 500 : maxIndex + 500;
    
            // Add the new exercise with the correct index
            const newDocumentData = {
                title: exerciseTitle,
                sets: '0',
                reps: '0',
                exerciseIndex: newIndex,
                description: ''
            };
    
            // Add the new exercise to the collection
            const newDoc = await addDoc(exercisesCollectionRef, newDocumentData);
            changeExerciseName(newDoc);
            setIsDisabled(false);
    
        } catch (err) {
            console.log(err);
        }
    }

    const changeExerciseName = (document: any) => {
      Alert.prompt(
        t('new-exercise-name-alert'),
        '',
        (newName) => {
          if (newName && newName.length <= 50) {
            updateDoc(doc(exercisesCollectionRef, document.id), {
              title: newName
            });
          }else{
            Alert.alert(t('workout-characters-alert'), '', [
              {
                    text: 'OK',
                    style: 'cancel',
                  }
            ]);
          }
        },
        'plain-text',
        ""
      );
    }

    return (
        <Pressable style={tw`w-10 h-[44px] flex items-center justify-center`} onPress={addExercise} disabled={isDisabled}>
            <Ionicons name='add-outline' size={44} color='white' style={tw`mr-[-15px]`}/>
         </Pressable>
    )

}