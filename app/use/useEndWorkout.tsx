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
    t: any
) => {

    // t -> useTranslation

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

        Alert.alert(t('finish-workout-alert'), '', [
          {
            text: t('cancel'),
            onPress: handleCancel,
            style: 'cancel',
          },
          { text: t('yes'), onPress: () => handleOk(saveToDatabase) },
        ]);
    }else{
        navigation.navigate("Тренировки");
        console.log('no exercises saved');
    }

    
};