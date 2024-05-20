import { View, Text, FlatList, Pressable, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Timestamp, collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc, query, orderBy } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../firebaseConfig';
import { setCurrentSavedWorkout } from '../../globals';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from "twrnc";
import moment from 'moment';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface SavedWorkout {
  title: string;
  saved: Timestamp;
  id: string;
  exerciseIndex: number,
  workoutDuration: string,
  note: string
}

const SavedWorkouts = ({navigation}: any) => {

    // tva nz dali oshte ima smisul da sedi tuka
    if (!FIREBASE_AUTH.currentUser) {
      console.error('User is not authenticated.');
      return;
    }

    const {t} = useTranslation();

    const insets = useSafeAreaInsets();
	const notchSizeTailwind = Math.round(insets.top / 4);

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const savedWorkoutsCollectionRef = collection(userDocRef, 'saved_workouts');
      
    const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);

    const updateSavedWorkouts = async () => {
      try {
          const data = await getDocs(query(savedWorkoutsCollectionRef, orderBy("saved", "desc")));
    
          const filteredData: SavedWorkout[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as SavedWorkout));

          setSavedWorkouts(filteredData);
      } catch (err) {
          console.error(err);
      }
    };

    const deleteItem = (workoutID: any) => {

        const handleOk = async () => {
            try{
                await deleteDoc(doc(savedWorkoutsCollectionRef, workoutID));
            }catch (err) {
                console.error(err);
            }
        }

        const handleCancel = () => {
            return;
        }

        Alert.alert('Сигурен ли си, че искаш да изтриеш тази тренировка?', '', [
            {
            text: 'Отказ',
            onPress: handleCancel,
            style: 'cancel',
            },
            {text: 'Да', onPress: handleOk},
        ]);

    };
        
    const renderSavedWorkout = ({item}: any) => {

        const pressedSavedWorkout = () => {

          setCurrentSavedWorkout(item);
          navigation.navigate('Запазена-Тренировка', {workoutID: item.id});
        
        }

        const changeSavedWorkoutName = () => {
          Alert.prompt(
            t('new-name-alert'),
            '',
            (newName) => {
              if (newName && newName.length <= 50) {
                updateDoc(doc(savedWorkoutsCollectionRef, item.id), {
                  title: newName
                });
              }else{
                Alert.alert(t('workout-characters-alert'), '', [
                  {
                    text: 'ОK',
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

              <Pressable
              style={tw`flex flex-row items-center w-full h-24 my-1 rounded-lg bg-white shadow-md`}
              onPress={pressedSavedWorkout}
              onLongPress={changeSavedWorkoutName}> 
                <View style={tw`flex flex-row justify-between`}>

                    <View style={tw`flex flex-col flex-grow ml-3`}>

                        <Text style={tw`text-lg font-medium max-w-[95%]`} numberOfLines={1} ellipsizeMode='tail'>
                            {item.title}
                        </Text>

                        {item.saved && (
                        <Text style={tw`text-base`} numberOfLines={1} ellipsizeMode='tail'>
                            {moment(item.saved.toDate()).format('DD/MM/YYYY, HH:mm ч.')}
                        </Text>
                        )}

                        <Text style={tw`text-base`}>{item.duration}</Text>

                    </View>

                    <Pressable style={tw`w-12 h-12`} onPress={() => deleteItem(item.id)}>
                        <Ionicons name='close-circle-outline' size={43} color="#FF0000" />
                    </Pressable>

                </View>
              </Pressable>

          </View>
        )
    }
    
    useEffect(() => {
      
      onSnapshot(savedWorkoutsCollectionRef, (_snapshot) => {
          updateSavedWorkouts();
        })
    }, [])

    

    return (
        <View style={tw.style(`w-full h-full bg-[#F2F2F2] pt-${notchSizeTailwind}`)}>

          {savedWorkouts.length > 0 ? (

            <View>

                <FlatList data={savedWorkouts} renderItem={(item) => renderSavedWorkout(item)} keyExtractor={(savedWorkout: SavedWorkout) => savedWorkout.id}/>

            </View>

            ) : (
              <View style={tw`flex items-center justify-center h-full`}>
                <Text style={tw`text-lg text-blue-500`}>Нямаш запазени тренировки. Завърши тренировка и тя ще се появи тук.</Text>
              </View>
              
          )}

      </View>
    )
}

export default SavedWorkouts;