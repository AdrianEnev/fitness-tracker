import { View, Text, FlatList, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, doc, onSnapshot, getDocs, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { getCurrentDay, getCurrentSplit, setCurrentExercise } from '../../globals';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';

//import Ionicons from '@expo/vector-icons/Ionicons';
//<Ionicons name='trash-bin-outline' size={24} color="red" onPress={deleteItem} style={tw`mr-3`}/>

export interface ExerciseInterface {
    title: string;
    sets: string;
    reps: string;
    description: string;
    exerciseIndex: number;
    id: string;
}

const Exercises = ({navigation}: any) => {

    const {t} = useTranslation();

    const currentDay = getCurrentDay();
    const currentSplit = getCurrentSplit();

    let [exercises, setExercises] = useState<ExerciseInterface[]>([]);
    let [highestIndexExerciseId, setHighestIndexExerciseId] = useState<string | null>(null);
    let [lowestIndexExerciseId, setLowestIndexExerciseId] = useState<string | null>(null);

    useEffect(() => {
      navigation.setOptions({
        title: currentDay?.title
      });
    }, []);

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userCollectionRef = collection(userDocRef, 'user_splits');
    const splitDocRef = doc(userCollectionRef, currentSplit?.id);
    const daysCollectionRef = collection(splitDocRef, 'days');
    const exerciseDocRef = doc(daysCollectionRef, currentDay?.id);
    const exercisesCollectionRef = collection(exerciseDocRef, 'exercises');
    
    const updateExercises = async () => {
        try {
            const data = await getDocs(exercisesCollectionRef);
      
            const filteredData: ExerciseInterface[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ExerciseInterface));

            filteredData.sort((a, b) => a.exerciseIndex - b.exerciseIndex);

            setExercises(filteredData);

            // Find the exercise with the lowest index
            const minIndex = Math.min(...filteredData.map((exercise) => exercise.exerciseIndex));
            const exerciseWithLowestIndex = filteredData.find((exercise) => exercise.exerciseIndex === minIndex);
            setLowestIndexExerciseId(exerciseWithLowestIndex?.id || null)
    
            // Find the highest exercise index
            const maxIndex = Math.max(...filteredData.map((exercise) => exercise.exerciseIndex), 0);
            const exerciseWithHighestIndex = filteredData.find((exercise) => exercise.exerciseIndex === maxIndex);
            setHighestIndexExerciseId(exerciseWithHighestIndex?.id || null);
            
        } catch (err) {
            console.error(err);
        }
    }

    const renderExercises = ({item}: any) => {

        // isHighestIndex i isLowestIndex se izpolzvat za da se mahnat butonite za nadolu i za nagore na nai niskoto i nai visokoto uprajnenie
        const isHighestIndex = item.id === highestIndexExerciseId;
        const isLowestIndex = item.id === lowestIndexExerciseId;

        const pressedExercise = () => {
          setCurrentExercise(item);
          navigation.navigate('Упражнение');
        }

        const changeExerciseName = () => {
          Alert.prompt(
            t('new-name-alert'),
            '',
            (newName) => {
              if (newName && newName.length <= 40) {
                updateDoc(doc(exercisesCollectionRef, item.id), {
                  title: newName
                });
                setCurrentExercise(item);
              }else{
                Alert.alert(t('35-characters-alert'), '', [
                  {
                    text: 'OK',
                    style: 'cancel',
                  }
                ]);
              }
            },
            'plain-text',
            item.title
          );
        }

        return (
          <View style={tw`mx-3`}>
            <View style={tw``}>
              <Pressable style={tw`flex flex-col w-[84%] h-36 mt-3 rounded-xl bg-white pt-3 z-10`} onPress={pressedExercise} onLongPress={changeExerciseName}>
                <Text style={tw`flex-1 ml-5 text-2xl font-medium`} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                <Text style={tw`flex-1 ml-5 text-lg`}>{t('sets')}: {item.sets !== "" ? item.sets : "0"}</Text>
                <Text style={tw`flex-1 ml-5 text-lg`}>{t('reps')}: {item.reps !== "" ? item.reps: "0"}</Text>
              </Pressable>

              <View style={tw`bg-white w-full h-36 absolute mt-3 rounded-xl`}>
                {!isLowestIndex && (
                  <Pressable style={tw`absolute right-0 top-3 `} onPress={() => moveExerciseUp(item.exerciseIndex)}>
                    <Ionicons name='chevron-up-circle-outline' size={64} color='#3b82f6'/>
                  </Pressable>
                )}
                
                {!isHighestIndex && (
                  <Pressable style={tw`absolute right-0 bottom-0 `} onPress={() => moveExerciseDown(item.exerciseIndex)}>
                    <Ionicons name='chevron-down-circle-outline' size={64} color='#3b82f6'/>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        );
    }

    const moveExerciseUp = async (index: string) => {

        try {
            const exerciseIndex = parseInt(index);
            if (isNaN(exerciseIndex)) return;

            const data = await getDocs(exercisesCollectionRef);
            const filteredData: ExerciseInterface[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ExerciseInterface));
    
            // Find the exercise to be moved up
            const clickedExercise = filteredData.find(exercise => exercise.exerciseIndex === exerciseIndex);

            // Find the exercise with the closest lower index
            const lowerIndexExercise = filteredData.reduce((prev, current) => {
                if (current.exerciseIndex < exerciseIndex && current.exerciseIndex > prev.exerciseIndex) {
                    return current;
                }
                return prev;
            }, { exerciseIndex: 0 } as ExerciseInterface);

            if (lowerIndexExercise) {

                // Switch the indexes of the coresponding exercises
                await Promise.all([
                    updateDoc(doc(exercisesCollectionRef, clickedExercise?.id), { exerciseIndex: lowerIndexExercise.exerciseIndex }),
                    updateDoc(doc(exercisesCollectionRef, lowerIndexExercise.id), { exerciseIndex: exerciseIndex })
                ]);
            }

        }catch(err){console.log(err)}

        
    }

    const moveExerciseDown = async (index: string) => {
        try {
            const exerciseIndex = parseInt(index);
            if (isNaN(exerciseIndex)) return;
    
            const data = await getDocs(exercisesCollectionRef);
            const filteredData: ExerciseInterface[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as ExerciseInterface));
    
            // Find the exercise to be moved down
            const clickedExercise = filteredData.find(exercise => exercise.exerciseIndex === exerciseIndex);
    
            // Find the exercise with the closest higher index
            const higherIndexExercise = filteredData.reduce((prev, current) => {
                if (current.exerciseIndex > exerciseIndex && current.exerciseIndex < prev.exerciseIndex) {
                    return current;
                }
                return prev;
            }, { exerciseIndex: Number.MAX_SAFE_INTEGER } as ExerciseInterface);
    
            if (higherIndexExercise) {
    
                // Switch the indexes of the corresponding exercises
                await Promise.all([
                    updateDoc(doc(exercisesCollectionRef, clickedExercise?.id), { exerciseIndex: higherIndexExercise.exerciseIndex }),
                    updateDoc(doc(exercisesCollectionRef, higherIndexExercise.id), { exerciseIndex: exerciseIndex })
                ]);
            }
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {

        onSnapshot(exercisesCollectionRef, (_snapshot) => {
            updateExercises();
        });

    }, [])

    return (
        <View>
            {exercises.length > 0 ? (
                <View style={tw`w-full h-full pb-6`}>
                    <FlatList
                        data={exercises}
                        renderItem={renderExercises}
                        keyExtractor={(exercise: ExerciseInterface) => exercise.id}
                    />
                </View>
                ) : (
                <View style={tw`flex items-center justify-center h-full`}>
                    <Text style={tw`text-xl text-blue-500`}>Цъкни плюса горе, за да добавиш упражнение.</Text>
                </View>
            )}
        </View>
    );
}

export default Exercises;