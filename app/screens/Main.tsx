import { View, Text, Pressable, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import tw from "twrnc";
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GoalNutrients } from './SettingsMacros';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import HorizontalCalendar from '../components/HorizontalCalendar';
import CustomNavigationBar from '../components/CustomNavigationBar';
import RenderGoals from '../components/RenderGoals';

const Main = ({navigation}: any) => {

    //const [steps, setSteps] = useState(0);

    const { t } = useTranslation();

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const foodDaysCollectionRef = collection(userDocRef, 'food_days');

    const [username, setUsername] = useState('');

    const getUsername = async () => {
        try {
            const docSnapshot = await getDoc(doc(userInfoCollectionRef, 'username'));
            if (docSnapshot.exists()) {
                setUsername(docSnapshot.data().username);
            } else {
                console.log('Username document does not exist');
            }
        } catch (err) {
            console.error(err);
        }
    }

    const getLanguage = async () => {
        try {
            const docSnapshot = await getDoc(doc(userInfoCollectionRef, 'language'));
            if (docSnapshot.exists()) {
                const language = docSnapshot.data().language;
                await i18next.changeLanguage(language);
               
            } else {

                // moje bi da napravq da izchaka 2 sek da probva pak ili neshto takova che ponqkoga ne go udpateva na vreme
                console.log('Language document does not exist');
            }
        } catch (err) {
            console.error(err);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            (async () => {
                await getLanguage();

            })();

            updateCurrentNutrients();
            getUsername();

            return () => {
                // Optional: You can do something when the screen is unfocused
                // This function runs when the screen goes out of focus
            };
        }, [])
    );

    const getCurrentDate = (padStart: boolean): string => {

        if (padStart) {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}/${month}/${year}`;
        }else{
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1);
            const day = String(date.getDate());
            return `${day}-${month}-${year}`;
        }

    };

    // izpolzvam GoalNutrients dori i da e za currentNutrients state-a zashtoto si pasva perfektno tuk
    let [currentNutrients, setCurrentNutrients] = useState<GoalNutrients[]>([]);
    let [goalNutrients, setGoalNutrients] = useState<GoalNutrients[]>([]);

    const updateGoalNutrients = async () => {
        try {
            const docRef = doc(userInfoCollectionRef, "nutrients");
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const data = docSnap.data() as GoalNutrients;
                setGoalNutrients([{ ...data, id: docSnap.id }]);
            } else {
                console.log("No such document!");
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        onSnapshot(userInfoCollectionRef, (_snapshot) => {
            updateGoalNutrients();
        });
    }, [])

    const updateCurrentNutrients = async () => {
        try {
            const data = await getDocs(foodDaysCollectionRef);
            const ids = data.docs.map((doc) => doc.id);
            
            const matchingDoc = data.docs.find((doc) => doc.id === getCurrentDate(false));
            if (matchingDoc) {
                
                setCurrentNutrients(matchingDoc.data() as GoalNutrients[]);

            }

        } catch (err) {
            console.error(err);
        }
    }

    const getHelloText = (): string => {
        const date = new Date();
        const hours = date.getHours();

        if (hours >= 0 && hours < 12) {
            return t('good-morning');
        } else if (hours >= 12 && hours < 18) {
            return t('good-afternoon');
        } else {
            return t('good-evening');
        }
    }

    return (
        <SafeAreaView style={tw``}>

            <ScrollView style={tw`h-full w-full`}>

                <View style={tw`flex flex-row justify-between mt-2 mx-1`}>

                    <View style={tw`flex flex-row`}>

                        {/* Profil ikona */}
                        <View style={tw`bg-white w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-200 ml-2`}>
                            <Ionicons name='person-outline' 
                                size={40}
                                color='#000000' 
                                style={tw``} 
                                onPress={() => navigation.navigate("Настройки-Страница")}
                            />
                        </View>

                        {/* Zdravei User */}
                        <View style={tw`flex flex-col ml-3`}>
                            <Text style={tw`text-lg text-gray-500`}>{getHelloText()} 👋</Text>
                            <Text style={tw`text-xl font-medium`}>{username}</Text>
                        </View>
                        
                    </View>

                    
                </View>

                <View style={tw`mt-4 mx-1`}>

                    <View style={tw`mx-1`}>

                        <HorizontalCalendar />

                    </View>
                    
                    <RenderGoals 
                    goalNutrients={goalNutrients}
                    currentNutrients={currentNutrients}
                    />
                    
                </View>

            </ScrollView>

            {/* Footer */}
            <CustomNavigationBar navigation={navigation}/>
            
        </SafeAreaView>
        
    )
}

export default Main