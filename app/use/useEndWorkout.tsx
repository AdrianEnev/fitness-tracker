import { Alert } from "react-native";
import { View, Text } from 'react-native'
import { saveWorkoutToDB } from "./useSaveWorkoutDB";
import { ExerciseInterface } from "../screens/Exercises";

export const endWorkout = (
    navigation: any, 
    stopTimer: () => void, 
    exercisesInfoArrays: any, 
    saveToDatabase: boolean, 
    currentDay: any, 
    time: any,
    ) => {

    const handleOk = async (saveToDatabase: boolean) => {

        stopTimer();

        if (saveToDatabase) {

           

            saveWorkoutToDB(currentDay, exercisesInfoArrays, time);
        }

        navigation.navigate("Тренировки");

    };
    
    const handleCancel = () => {
        return;
    };

    if (saveToDatabase) {
        Alert.alert('Сигурен ли си, че искаш да прекъснеш тази тренировка?', '', [
          {
            text: 'Отказ',
            onPress: handleCancel,
            style: 'cancel',
          },
          { text: 'Да', onPress: () => handleOk(saveToDatabase) },
        ]);
    }else{
        navigation.navigate("Тренировки");
        console.log('no exercises saved');
    }

    
};