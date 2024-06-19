import { View, Button, Text, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, {useEffect, useState} from 'react'
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig'
import tw from "twrnc";
import { TextInput } from 'react-native-gesture-handler';
import { setDoc, collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { GoalNutrients } from '../../interfaces';

const Settings = () => {

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const nutrientsDocRef = doc(userInfoCollectionRef, 'nutrients')

    let [nutrients, setNutrients] = useState<GoalNutrients[]>([]);

    /*const updateNutrients = async () => {
        try {
          const data = await getDocs(userInfoCollectionRef);
  
          const filteredData: GoalNutrients[] = data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as GoalNutrients));
          
          setNutrients(filteredData);
          
        } catch (err) {
          console.error(err);
        }
    };*/

    const updateNutrients = async () => {
        try {
            const docRef = doc(userInfoCollectionRef, "nutrients");
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const data = docSnap.data() as GoalNutrients;
                setNutrients([{ ...data, id: docSnap.id }]);
            } else {
                console.log("No such document!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const setNutrient = async (text: string, nutrientType: string) => {
        try {
            const updatedNutrient = { [nutrientType]: text };
            await setDoc(nutrientsDocRef, updatedNutrient, { merge: true });
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        onSnapshot(userInfoCollectionRef, (_snapshot) => {
            updateNutrients();
        });
    }, []);

    const renderNutrients = ({item}: any) => {
        return (
            <View style={tw`mt-10`}>
                <View style={tw`flex flex-row justify-between`}>

                    <TextInput 
                        style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                        placeholder='Калории' 
                        keyboardType='number-pad' 
                        defaultValue={item.calories}
                        maxLength={4} 
                        onChangeText={(text) => setNutrient(text, "calories")} 
                    />

                    <Text style={tw`font-medium text-xl mt-3`}>Калории</Text>

                </View>

                <View style={tw`flex flex-row justify-between`}>

                    <TextInput 
                        style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                        placeholder='Протеин' 
                        keyboardType='number-pad' 
                        defaultValue={item.protein}
                        maxLength={3} 
                        onChangeText={(text) => {
                            setNutrient(text, "protein")
                        }}
                    />

                    <Text style={tw`font-medium text-xl mt-3`}>Протеин</Text>

                </View>

                <View style={tw`flex flex-row justify-between`}>

                    <TextInput 
                        style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                        placeholder='Въглехидрати' 
                        keyboardType='number-pad' 
                        defaultValue={item.carbs}
                        maxLength={3} 
                        onChangeText={(text) => setNutrient(text, "carbs")} //da ne moje texta da zapochva s 0 kato naprimer 0800 kalorii
                    />

                    <Text style={tw`font-medium text-xl mt-3`}>Въглехидрати</Text>

                </View>

                <View style={tw`flex flex-row justify-between`}>

                    <TextInput 
                        style={tw`border border-gray-400 p-2 rounded-lg mt-3 w-[40%]`} 
                        placeholder='Мазнини' 
                        keyboardType='number-pad' 
                        defaultValue={item.fat}
                        maxLength={3} 
                        onChangeText={(text) => setNutrient(text, "fat")} //da ne moje texta da zapochva s 0 kato naprimer 0800 kalorii
                    />

                    <Text style={tw`font-medium text-xl mt-3`}>Мазнини</Text>

                </View>
                
            </View>
            
        );
    }

    return (
      <View style={tw`mx-3 h-full flex-1`}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

                <View style={tw`flex-1`}>


                    <View>
                        <FlatList data={nutrients} renderItem={(item) => renderNutrients(item)} />
                    </View>

                </View>

          </TouchableWithoutFeedback>
      </View>
    )
}

export default Settings