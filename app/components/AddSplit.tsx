import Ionicons from '@expo/vector-icons/Ionicons';
import { Alert, Pressable, View } from 'react-native'
import tw from "twrnc";

import { collection, addDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { FIRESTORE_DB, FIREBASE_AUTH } from "../../firebaseConfig";

import i18next from 'i18next';
import { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

const AddSplit = () => {

    const {t} = useTranslation();

    const [splitTitle, setSplitTitle] = useState<string>("New Split");

    useFocusEffect(() => {

        const currentLanguage = i18next.language;

        if (currentLanguage == "bg") {
            setSplitTitle("Нова Програма");
        } else {    
            setSplitTitle("New Split");
        }

    });

    const usersCollectionRef = collection(FIRESTORE_DB, "users");
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userCollectionRef = collection(userDocRef, "user_splits");

    const addSplit = async () => {
        
        try{
            const newDocumentData = {
                title: splitTitle,
                created: serverTimestamp()
            };
        
            const newDoc = await addDoc(userCollectionRef, newDocumentData);
            changeSplitName(newDoc);
            
        }catch (err) {
            console.log(err);
        }

    }

    const changeSplitName = (document: any) => {
        Alert.prompt(
          t('new-split-name-alert'),
          '',
          (newName) => {
            if (newName && newName.length <= 50) {
              updateDoc(doc(userCollectionRef, document.id), {
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
            <Pressable style={tw`w-10 h-[44px] flex items-center justify-center`} onPress={addSplit}>
                <Ionicons name='add-outline' size={44} color='white' style={tw`mr-[-15px]`}/>
            </Pressable>
        </View>
    );

}

export default AddSplit;