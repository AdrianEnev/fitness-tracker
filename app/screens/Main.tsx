import { View, Text, Pressable, ScrollView, Image } from 'react-native'
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
import CustomNavigationBar from '../components/CustomNavigationBar';
import RenderGoals from '../components/RenderGoals';
import getLanguage from '../use/useGetLanguage';
import getUsername from '../use/useGetUsername';
import getCurrentDate from '../use/useGetCurrentDate';
import getProfilePicture from '../use/useGetProfilePicture';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const Main = ({navigation}: any) => {

    //const [steps, setSteps] = useState(0);

    const { t } = useTranslation();

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const foodDaysCollectionRef = collection(userDocRef, 'food_days');

    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');

    useFocusEffect(
        React.useCallback(() => {

            const fetch = async () => {
                await getLanguage(userInfoCollectionRef);

                const username = await getUsername(userInfoCollectionRef);
                setUsername(username);

                const profilePictureData = await getProfilePicture();
                if (profilePictureData && profilePictureData !== profilePicture) {
                    setProfilePicture(profilePictureData);
                }
            }
            fetch();
            updateCurrentNutrients();
            
        }, [])
    );

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
                        {profilePicture === '' ? (
                            <View style={tw`bg-white w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-200 ml-2`}>
                                <Ionicons name='person-outline' 
                                    size={40}
                                    color='#000000'  
                                    onPress={() => navigation.navigate("Настройки-Акаунт")}
                                />
                            </View>
                        ) : (
                            <Pressable onPress={() => navigation.navigate("Настройки-Акаунт")}>
                                <Image
                                    source={{ uri: profilePicture }}
                                    style={tw`w-16 h-16 rounded-full ml-2`}
                                />
                            </Pressable>
                        )}

                        {/* Zdravei User */}
                        <View style={tw`flex flex-col ml-3`}>
                            <Text style={tw`text-lg text-gray-500`}>{getHelloText()} 👋</Text>
                            <Text style={tw`text-xl font-medium`}>{username}</Text>
                        </View>
                            
                    </View>

                    <View>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate("Настройки-Страница")} 
                            style={tw`bg-white w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-200 ml-2`}>
                            <Ionicons name='settings-outline' 
                                size={40}
                                color='#000000'
                            />
                        </TouchableWithoutFeedback>
                    </View>

                </View>

                {/* Celi */}
                <View style={tw`mx-1`}>
                    
                    <RenderGoals 
                        goalNutrients={goalNutrients}
                        currentNutrients={currentNutrients}
                        navigation={navigation}
                    />
                    
                </View>

            </ScrollView>

            {/* Footer <CustomNavigationBar navigation={navigation}/>*/}
            
        </SafeAreaView>
        
    )
}

export default Main