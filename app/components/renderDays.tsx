import { View, Text, Pressable, Alert } from 'react-native';
import React from 'react';
import { deleteDoc, doc, getDocs, updateDoc, collection } from 'firebase/firestore';
import { getCurrentDay, setCurrentDay } from '../../firebaseConfig';
import tw from "twrnc";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ExerciseInterface } from '../screens/Exercises';

interface RenderDaysProps {
  item: any;
  navigation: any;
  daysCollectionRef: any;
  setExercises: React.Dispatch<React.SetStateAction<ExerciseInterface[]>>;
  t: any
}

// nikva ideq shto setExercises e s takuv slojen type ama raboti

export const renderDays = ({ item, navigation, daysCollectionRef, setExercises, t }: RenderDaysProps) => {
    
    const getExercises = async (exercisesCollectionRef: any, setExercises: any) => {
        try {
            const data = await getDocs(exercisesCollectionRef);

            const filteredData: ExerciseInterface[] = data.docs.map((doc) => ({
            ...(doc.data() as ExerciseInterface),  // Typecast doc.data() to Exercise type
            id: doc.id
            }));

            setExercises(() => filteredData);

            return filteredData;
        } catch (err) {
            console.error(err);
        }
    }

  const deleteItem = () => {
    Alert.alert(t('delete-day-alert'), '', [
      {
        text: t('cancel'),
        onPress: () => handleCancel,
        style: 'cancel',
      },
      { text: t('yes'), onPress: () => handleOk() },
    ]);

    const handleOk = async () => {
      await deleteDoc(doc(daysCollectionRef, item.id));
    };

    const handleCancel = () => {
      return;
    };
  };

  const startWorkout = async () => {
    setCurrentDay(item);
    let currentDay = getCurrentDay();
    const exerciseDocRef = doc(daysCollectionRef, currentDay?.id);
    const exercisesCollectionRef = collection(exerciseDocRef, 'exercises');

    const handleOk = async () => {
      const updatedExercises = await getExercises(exercisesCollectionRef, setExercises);

      if (updatedExercises?.some((exercise) => exercise.sets === "0" || exercise.sets === "" || exercise.sets === null)) {
        Alert.alert(t('exercises-number-alert'), '', [
          {
            text: 'OK',
            style: 'cancel',
          },
        ]);
      } else {
        navigation.navigate('АктивнаТренировка');
      }
    };

    const handleCancel = () => {
    };

    Alert.alert(t('start-workout-alert'), '' + item.title, [
      {
        text: t('cancel'),
        onPress: handleCancel,
        style: 'cancel',
      },
      { text: t('yes'), onPress: handleOk },
    ]);
  };

  const pressedDay = () => {
    navigation.navigate('Упражнения');
    setCurrentDay(item);
  };

  const changeDayName = () => {
    Alert.prompt(
      t('new-name-alert'),
      '',
      (newName) => {
        if (newName && newName.length <= 35) {
          updateDoc(doc(daysCollectionRef, item.id), {
            title: newName,
          });
          setCurrentDay(item);
        } else {
          Alert.alert(t('35-characters-alert'), '', [
            {
              text: 'OK',
              style: 'cancel',
            },
          ]);
        }
      },
      'plain-text',
      item.title
    );
  };

  return (
    <View key={item.id}>
      <Pressable style={tw`flex flex-row items-center justify-between w-full h-24 my-1 rounded-lg bg-white shadow-md`} onPress={pressedDay} onLongPress={changeDayName}>
        
        <Text style={tw`flex-1 ml-5 text-base max-w-[75%]`} numberOfLines={1} ellipsizeMode='tail'>
          {item.title}
        </Text>

        <View style={tw`flex flex-row`}>
            <Ionicons name='caret-forward-outline' size={26} color='#00D100' onPress={startWorkout} style={tw`mr-3`} />
            <Ionicons name='trash-bin-outline' size={24} color="red" onPress={deleteItem} style={tw`mr-3`} />
        </View>

        
      </Pressable>
    </View>
  );
};
