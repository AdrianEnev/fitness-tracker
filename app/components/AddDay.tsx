import { Timestamp, addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import tw from "twrnc";
import { Alert, Pressable, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import { FIREBASE_AUTH, FIRESTORE_DB, getCurrentSplit } from '../../firebaseConfig';
import i18next from 'i18next';
import { useFocusEffect } from '@react-navigation/native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const AddDay = () => {

    const {t} = useTranslation();

    const [dayTitle, setAddDayTitle] = useState<string>("New Day");

    useFocusEffect(() => {

        const currentLanguage = i18next.language;

        if (currentLanguage == "bg") {
            setAddDayTitle("Нов Ден");
        } else {    
            setAddDayTitle("New Day");
        }

    });

    const currentSplit = getCurrentSplit();

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userCollectionRef = collection(userDocRef, "user_splits");
    const splitDocRef = doc(userCollectionRef, currentSplit?.id);
    const daysCollectionRef = collection(splitDocRef, 'days');
    
    const addDay = async () => {
        try{

            const newDocumentData = {
                title: dayTitle,
                created: serverTimestamp(),
            };
        
            const newDoc = await addDoc(daysCollectionRef, newDocumentData);
            changeDayName(newDoc);
            
        }catch (err) {
            console.log(err);
        }
    }

    const changeDayName = (document: any) => {
      Alert.prompt(
        t('new-day-name-alert'),
        '',
        (newName) => {
          if (newName && newName.length <= 50) {
            updateDoc(doc(daysCollectionRef, document.id), {
              title: newName
            });
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
        ""
      );
    }

    return (
        <View style={tw`flex items-center`}>
            <Pressable style={tw`w-10 h-[44px] flex items-center justify-center`} onPress={addDay}>
                <Ionicons name='add-outline' size={44} color='white' style={tw`mr-[-15px]`}/>
            </Pressable>
        </View>
    )

}