import { View, Text, FlatList, Pressable, Alert, Button} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Timestamp, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, orderBy } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH, setCurrentSplit } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from "twrnc";
import AddSplit from '../components/AddSplit';

export interface Split {
  title: string;
  created: Timestamp;
  id: string;
}

const Splits = ({navigation}: any) => {

    if (!FIREBASE_AUTH.currentUser) {
      console.error('User is not authenticated.');
      return;
    }

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userCollectionRef = collection(userDocRef, 'user_splits');
      
    const [splits, setSplits] = useState<Split[]>([]);

    const updateSplits = async () => {
      try {
        const data = await getDocs(query(userCollectionRef, orderBy("created", "desc")));

        const filteredData: Split[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Split));
        
        setSplits(filteredData);
        
      } catch (err) {
        console.error(err);
      }
    };

    const renderSplit = ({item}: any) => {

        const deleteItem = () => {
          Alert.alert('Сигурен ли си, че искаш да изтриеш тази тренировка?', '', [
            {
              text: 'Отказ',
              onPress: () => handleCancel,
              style: 'cancel',
            },
            {text: 'Да', onPress: () => handleOk()},
          ]);

          const handleOk = async () => {
            await deleteDoc(doc(userCollectionRef, item.id));
          }

          const handleCancel = () => {
            console.log("cancel");
          }
            
        }

      const pressedWorkout = () => {

        navigation.navigate('Дни');
        setCurrentSplit(item);
      
      }

      const changeWorkoutName = () => {
        Alert.prompt(
          'Моля въведи ново име!',
          '',
          (newName) => {
            if (newName && newName.length <= 50) {
              updateDoc(doc(userCollectionRef, item.id), {
                title: newName
              });
              setCurrentSplit(item);
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

            <Pressable style={tw`flex flex-row items-center w-full h-24 my-1 rounded-lg bg-white shadow-sm`} onPress={pressedWorkout} onLongPress={changeWorkoutName}>
                <Text style={tw`flex-1 ml-5 text-base`} numberOfLines={1} ellipsizeMode='tail'>{item.title}</Text>
                <Ionicons name='trash-bin-outline' size={24} color="red" onPress={deleteItem} style={tw`mr-3`}/>
            </Pressable>

        </View>
      )
    }
    
    useEffect(() => {
      
      onSnapshot(userCollectionRef, (_snapshot) => {
          updateSplits();
        })
    }, [])

    return (
      <View style={tw``}>

          <View style={tw`w-full h-12 bg-blue-500 mb-2`}></View> 

          <AddSplit />

          {splits.length > 0 ? (

          <View>

              <FlatList data={splits} renderItem={(item) => renderSplit(item)} keyExtractor={(split: Split) => split.id}/>

          </View>

          ) : (
            <View style={tw`flex items-center justify-center h-full`}>
              <Text style={tw`text-lg text-blue-500`}>Цъкни плюса горе, за да добавиш програма.</Text>
            </View>
          )}

      </View>
    )

}

export default Splits;