import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { doc, onSnapshot, getDocs, collection, Timestamp, query, orderBy } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB, getCurrentSplit } from '../../firebaseConfig';
import tw from "twrnc";
import { ExerciseInterface } from './Exercises';
import { renderDays } from '../components/renderDays';
import { AddDay } from '../components/AddDay';

export interface Day {
    title: string;
    created: Timestamp;
    id: string;
}

const Days = ({navigation}: any) => {

  const [exercises, setExercises] = useState<ExerciseInterface[]>([]);
  const [days, setDays] = useState<Day[]>([]);

  const currentSplit = getCurrentSplit();

  useEffect(() => {
    navigation.setOptions({
      title: currentSplit?.title
    });
  }, []);

  const usersCollectionRef = collection(FIRESTORE_DB, 'users');
  const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
  const userCollectionRef = collection(userDocRef, 'user_splits');
  const splitDocRef = doc(userCollectionRef, currentSplit?.id);
  const daysCollectionRef = collection(splitDocRef, 'days');

  const updateDays = async () => {
      try {
          const data = await getDocs(query(daysCollectionRef, orderBy("created", "desc")));
    
          const filteredData: Day[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Day));
    
          setDays(filteredData);
          
      } catch (err) {
          console.error(err);
      }
  }

  useEffect(() => {
  
      onSnapshot(daysCollectionRef, (_snapshot) => {
          updateDays();
      });

  }, [])

  return (
      <View>

        <View style={tw`w-full h-12 bg-blue-500 mb-2`}></View> 

        <AddDay />

        {days.length > 0 ? (
          <View style={tw`mx-3`}>
            <FlatList
              data={days}
              renderItem={({item}: any) => renderDays({ item, navigation, daysCollectionRef, setExercises })}
              keyExtractor={(day: Day) => day.id}
            />
          </View>
        ) : (
          <View style={tw`flex items-center justify-center h-full`}>
            <Text style={tw`text-xl text-blue-500`}>Цъкни плюса горе, за да добавиш ден.</Text>
          </View>
        )}
      </View>

    );
}

export default Days;