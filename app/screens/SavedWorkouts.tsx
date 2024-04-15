import { View, Text, FlatList, Pressable, Alert} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Timestamp, collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc, query, orderBy } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH, setCurrentSavedWorkout } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from "twrnc";
import moment from 'moment';

export interface SavedWorkout {
  title: string;
  saved: Timestamp;
  id: string;
  exerciseIndex: number,
  workoutDuration: string
}

const SavedWorkouts = ({navigation}: any) => {

    if (!FIREBASE_AUTH.currentUser) {
      console.error('User is not authenticated.');
      return;
    }

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

    const renderSavedWorkout = ({item}: any) => {

        const pressedSavedWorkout = () => {

          setCurrentSavedWorkout(item);
          navigation.navigate('Запазена-Тренировка', {workoutID: item.id});
        
        }

        const changeSavedWorkoutName = () => {
          Alert.prompt(
            'Моля въведи ново име!',
            '',
            (newName) => {
              if (newName && newName.length <= 50) {
                updateDoc(doc(savedWorkoutsCollectionRef, item.id), {
                  title: newName
                });
              }else{
                Alert.alert('Името на определена тренировка не може да надвиши 50 букви!', '', [
                  {
                    text: 'Ок',
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
              style={tw`flex flex-row items-center w-full h-24 my-1 rounded-lg bg-white shadow-sm`}
              onPress={pressedSavedWorkout}
              onLongPress={changeSavedWorkoutName}
              >

                  <View style={tw`flex flex-col flex-grow ml-3`}>

                    <Text style={tw`text-lg font-medium max-w-[95%]`} numberOfLines={1} ellipsizeMode='tail'>
                      {item.title}
                    </Text>
                      {item.saved && (
                        <Text style={tw`text-base`} numberOfLines={1} ellipsizeMode='tail'>
                          {moment(item.saved.toDate()).format('YYYY-MM-DD HH:mm:ss')}
                        </Text>
                      )}

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
      <View style={tw``}>

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