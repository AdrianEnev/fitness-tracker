import { View, TextInput, Text, Keyboard, TouchableWithoutFeedback, Button, Pressable, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { getCurrentDay, getCurrentExercise, getCurrentSplit, FIRESTORE_DB, FIREBASE_AUTH } from '../../firebaseConfig'
import tw from "twrnc";
import { collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';

const EditExercise = ({navigation}: any) => {

    const { t } = useTranslation();

    const currentExercise = getCurrentExercise();
    const currentDay = getCurrentDay();
    const currentSplit = getCurrentSplit();

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userCollectionRef = collection(userDocRef, 'user_splits');
    const splitDocRef = doc(userCollectionRef, currentSplit?.id);
    const daysCollectionRef = collection(splitDocRef, 'days');
    const exerciseDocRef = doc(daysCollectionRef, currentDay?.id);
    const exercisesCollectionRef = collection(exerciseDocRef, 'exercises');
    
    let [reps, setReps] = useState(currentExercise?.reps !== null ? currentExercise?.reps.toString() : '0');
    let [sets, setSets] = useState(currentExercise?.sets !== null ? currentExercise?.sets.toString() : '0');
    const [description, setDescription] = useState(currentExercise?.description || '');

    const saveChanges = () => {
        updateDoc(doc(exercisesCollectionRef, currentExercise?.id), {
            reps: reps,
            sets: sets,
            description: description
          })

        navigation.goBack();
    }

    const deleteExercise = async () => {

        const handleCancel = () => {}
        
        const handleOk = async () => {

            await deleteDoc(doc(exercisesCollectionRef, currentExercise?.id));
            navigation.goBack();
            
        }

        Alert.alert(t('delete-exercise-alert'), '' + currentExercise?.title, [
            {
              text: t('cancel'),
              onPress: handleCancel,
              style: 'cancel',
            },
            { text: t('yes'), onPress: handleOk },
          ]);

    }

  return (
    <View style={tw`mx-3`}>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View>

                <View style={tw`mt-3`}>

                    <View style={tw`mb-2 flex flex-row justify-between`}>
                        
                        <View style={tw`w-[49%] h-[150px] rounded-2xl bg-white shadow-sm p-3`}>

                            <Text style={tw`text-2xl font-medium text-center`}>{t('sets')}</Text>

                            <View style={tw`flex flex-row justify-between my-5`}>

                                <Pressable onPress={() => {
                                    if (sets !== undefined) {
                                        const newSets = parseInt(sets) - 1;
                                        if (newSets >= 0) {
                                            setSets(newSets.toString());
                                        }
                                    }
                                }}>
                                    <Ionicons name='remove-circle-outline' size={44} color='#EF4444'/>
                                </Pressable>


                                <TextInput
                                style={tw`text-2xl`}
                                keyboardType='number-pad'
                                maxLength={2}
                                onChangeText={(value) => setSets(value)}
                                defaultValue={sets}
                                />

                                <Pressable onPress={() => {
                                    if (sets !== undefined) {
                                        const newSets = parseInt(sets) + 1;
                                        if (newSets <= 9) {
                                            setSets(newSets.toString());
                                        }
                                    }
                                }}>
                                        <Ionicons name='add-circle-outline' size={44} color='#22C55E'/>
                                </Pressable>

                            </View>

                        </View>

                        <View style={tw`w-[49%] h-[150px] rounded-2xl bg-white shadow-sm p-3`}>

                            <Text style={tw`text-2xl font-medium text-center`}>{t('reps')}</Text>

                                <View style={tw`flex flex-row justify-between my-5`}>


                                    <Pressable onPress={() => {
                                        if (reps !== undefined) {
                                            const newReps = parseInt(reps) - 1;
                                            if (newReps >= 0) {
                                                setReps(newReps.toString());
                                            }
                                        }
                                    }}>
                                        <Ionicons name='remove-circle-outline' size={44} color='#EF4444'/>
                                    </Pressable>

                                    <TextInput 
                                    style={tw`flex-grow text-2xl text-center`}
                                    keyboardType='number-pad'
                                    maxLength={2}
                                    onChangeText={(value) => setReps(value)}
                                    defaultValue={reps}
                                    />

                                    <Pressable onPress={() => {
                                        if (reps !== undefined) {
                                            const newReps = parseInt(reps) + 1;
                                            if (newReps <= 99) {
                                                setReps(newReps.toString());
                                            }
                                        }
                                    }}>
                                        <Ionicons name='add-circle-outline' size={44} color='#22C55E'/>
                                    </Pressable>
                                    
                                </View>
                            

                        </View>
                        
                    </View>
                
                    <TextInput style={tw`w-full h-64 rounded-lg bg-white shadow-md px-3 py-2 text-base mt-1`}
                        multiline={true}
                        maxLength={1000}
                        placeholder={t('exercise-description')}
                        onChangeText={(value) => setDescription(value)}
                        defaultValue={description}
                    />

                    <View style={tw`mt-3`}>
                        <TouchableOpacity style={tw`w-full h-12 bg-green-500 rounded-xl flex justify-center items-center`} onPress={saveChanges}>
                            <Text style={tw`text-lg text-white`}>{t('save')}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={tw`mt-2`}>
                        <TouchableOpacity style={tw`w-full h-12 bg-red-500 rounded-xl flex justify-center items-center`} onPress={deleteExercise}>
                            <Text style={tw`text-lg text-white`}>{t('delete')}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

        </TouchableWithoutFeedback>

    </View>
  )
}

export default EditExercise;