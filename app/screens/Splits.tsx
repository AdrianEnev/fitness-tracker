import { View, Text, FlatList, Pressable, Alert, Button, TouchableOpacity, TextInput} from 'react-native'
import React, { useEffect, useState } from 'react'
import { Timestamp, collection, deleteDoc, doc, getDocs, onSnapshot, query, updateDoc, orderBy } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH, setCurrentSplit } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import tw from "twrnc";
import AddSplit from '../components/AddSplit';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

    const {t} = useTranslation();
    
    const insets = useSafeAreaInsets();
	  const notchSizeTailwind = Math.round(insets.top / 4);

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userCollectionRef = collection(userDocRef, 'user_splits');
      
    const [splits, setSplits] = useState<Split[]>([]);

    const [search, setSearch] = useState('');

    const updateSearch: (search: string) => void = (search) => {
        setSearch(search);
    };

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
          Alert.alert(t('delete-workout-alert'), '', [
            {
              text: t('cancel'),
              onPress: () => handleCancel,
              style: 'cancel',
            },
            {text: t('yes'), onPress: () => handleOk()},
          ]);

          const handleOk = async () => {
            await deleteDoc(doc(userCollectionRef, item.id));
          }

          const handleCancel = () => {
            return;
          }
            
        }

      const pressedWorkout = () => {

        navigation.navigate('Дни');
        setCurrentSplit(item);
      
      }

      const changeWorkoutName = () => {
        Alert.prompt(
          t('new-name-alert'),
          '',
          (newName) => {
            if (newName && newName.length <= 50) {
              updateDoc(doc(userCollectionRef, item.id), {
                title: newName
              });
              //setCurrentSplit(item);
            }else{
              Alert.alert(t('workout-characters-alert'), '', [
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

            <Pressable style={tw`flex flex-row items-center w-full h-24 my-1 rounded-lg bg-white shadow-md`} onPress={pressedWorkout} onLongPress={changeWorkoutName}>
                <Text style={tw`flex-1 ml-5 text-base`} numberOfLines={2}>{item.title}</Text>
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

    // pt-${notchSizeTailwind}

    return (
        <View style={tw`pt-2`}>

            {splits.length > 0 ? (

                <View style={tw`w-full h-full pb-6`}>

                    <FlatList
                        data={splits} 
                        renderItem={(item) => renderSplit(item)} 
                        keyExtractor={(split: Split) => split.id}
                    />

                </View>

                ) : (
                    <View style={tw`flex items-center justify-center h-full`}>
                        <Text style={tw`text-lg text-blue-500`}>Цъкни плюса, за да добавиш програма.</Text>
                    </View>
            )}

        </View>
    )

}

export default Splits;