import { Alert } from "react-native";
import { View, Text } from 'react-native'

export const endWorkout = (navigation: any, stopTimer: () => void, saveWorkoutToDB: () => void, saveToDatabase: boolean) => {

    const handleOk = async (saveToDatabase: boolean) => {

        stopTimer();

        if (saveToDatabase) {
          saveWorkoutToDB();
        }

        navigation.navigate("Тренировки");

    };
    
    const handleCancel = () => {
        return;
    };

    Alert.alert('Сигурен ли си, че искаш да прекъснеш тази тренировка?', '', [
      {
        text: 'Отказ',
        onPress: handleCancel,
        style: 'cancel',
      },
      { text: 'Да', onPress: () => handleOk(saveToDatabase) },
    ]);
};