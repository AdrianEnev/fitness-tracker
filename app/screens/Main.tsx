import { View, Text, Pressable, ScrollView, Image } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import tw from "twrnc";
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GoalNutrients } from '../../interfaces';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { useFocusEffect } from '@react-navigation/native';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';
import { SafeAreaView } from 'react-native-safe-area-context';
import getLanguage from '../use/useGetLanguage';
import getUsername from '../use/useGetUsername';
import getCurrentDate from '../use/useGetCurrentDate';
import getProfilePicture from '../use/useGetProfilePicture';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import getFriendRequests from '../use/useGetFriendRequestsRecieved';
import GlobalContext from '../../GlobalContext';
import HorizontalCalendar from '../components/HorizontalCalendar';
import WorkoutFoodButtons from '../components/WorkoutFoodButtons';
import Nutrients from '../components/NutrientsMain';
import BottomNavigationBar from '../components/BottomNavigationBar';
import ProfilePicture from '../components/ProfilePicture';

//bg-[#fd3e6b]

const Main = ({navigation}: any) => {

    //const [steps, setSteps] = useState(0);

    const { setGoalNutrients } = useContext(GlobalContext);

    const { t } = useTranslation();

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');
    const foodDaysCollectionRef = collection(userDocRef, 'food_days');

    const { username } = useContext(GlobalContext);

    const [currentFormattedDate, setCurrentFormattedDate] = useState<any>();
    const {friendRequestsNumber} = useContext(GlobalContext);

    useFocusEffect(
        React.useCallback(() => {

            const fetch = async () => {
                getLanguage(userInfoCollectionRef);
            }
            fetch();
            updateCurrentNutrients();

            const currentDate = getCurrentDate(false);
            const formattedDate = {
                dateString: currentDate,
                day: parseInt(currentDate.split('-')[0]),
                month: parseInt(currentDate.split('-')[1]),
                year: parseInt(currentDate.split('-')[2]),
                timestamp: Date.now()
            }

            setCurrentFormattedDate(formattedDate)
            
        }, [])
    );

    // izpolzvam GoalNutrients dori i da e za currentNutrients state-a zashtoto si pasva perfektno tuk
    let [currentNutrients, setCurrentNutrients] = useState<GoalNutrients[]>([]);

    const updateGoalNutrients = async () => {
        try {
            const docRef = doc(userInfoCollectionRef, "nutrients");
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const data = docSnap.data() as GoalNutrients;
                setGoalNutrients({ ...data, id: docSnap.id });
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
                        
                        <ProfilePicture navigation={navigation} page='Main'/>

                        {/* Zdravei User */}
                        <View style={tw`flex flex-col ml-3`}>
                            <Text style={tw`text-lg text-gray-500`}>{getHelloText()} 👋</Text>
                            <Text style={tw`text-xl font-medium`}>{username}</Text>
                        </View>
                            
                    </View>

                    <View>
                        <TouchableWithoutFeedback onPress={() => navigation.navigate("Настройки-Страница")} 
                                style={tw`bg-white w-16 h-16 rounded-full flex items-center justify-center border-2 border-gray-200 ml-2`}>
                            <View>
                                <Ionicons name='settings-outline' 
                                    size={40}
                                    color='#000000'
                                />
                                {friendRequestsNumber >= "1" && 
                                    <View style={tw`w-6 h-6 bg-red-500 rounded-full absolute top-[-18px] left-[-8px] flex justify-center items-center`}>
                                        <Text style={tw`text-white`}>{friendRequestsNumber}</Text>
                                    </View>
                                }
                            </View>
                        </TouchableWithoutFeedback>
                    </View>

                </View>

                {/* Celi */}
                <View style={tw`mx-1`}>
                    
                    <HorizontalCalendar navigation={navigation} />
                    <WorkoutFoodButtons navigation={navigation} />

                    <Nutrients 
                        currentNutrients={currentNutrients} 
                        navigation={navigation} 
                        formattedDate={currentFormattedDate} 
                        regularDate={getCurrentDate(true)} 
                    />
                    
                </View>

            </ScrollView>

            <BottomNavigationBar currentPage='Main' navigation={navigation}/>

        </SafeAreaView>
        
    )
}

export default Main