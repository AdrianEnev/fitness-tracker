import { View, Text, SafeAreaView, Image, Pressable } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { FIREBASE_AUTH, FIREBASE_STORAGE, FIRESTORE_DB } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import BottomNavigationBar from '../components/BottomNavigationBar';
import removeFriend from '../use/useRemoveFriend';

const ViewFriendProfile = ({route, navigation}: any) => {

    const {friend_info} = route.params;

    const [profilePicture, setProfilePicture] = useState('');
    const [weightLifted, setWeightLifted] = useState(0);
    const [friendRegistrationDate, setFriendRegistrationDate] = useState<React.ReactNode | null>(null);

    const [workoutsFinished, setWorkoutsFinished] = useState(0);

    const getFriendProfilePicture = async () => {

        const imagePath = `users/${friend_info.id}/profile_picture`;
        const imageRef = ref(FIREBASE_STORAGE, imagePath);

        try {
            const url = await getDownloadURL(imageRef);
            setProfilePicture(url);

        } catch (error) {
            //console.error("Error getting document:", error);
            return null;
        }

    }

    const getFriendWeightLifted = async () => {
        
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, friend_info.id);
        const userInfoCollectionRef = collection(userDocRef, 'user_info')
        const userWeightLiftedDocRef = doc(userInfoCollectionRef, 'weight_lifted');

        const unsubscribe = onSnapshot(userWeightLiftedDocRef, (doc) => {
            setWeightLifted(doc.data()?.weight);
            setWorkoutsFinished(doc.data()?.finishedWorkouts || 0);
        });

        // Cleanup function
        return () => unsubscribe();
    }

    const getFriendRegistrationDate = async () => {
        const usersCollectionRef = collection(FIRESTORE_DB, 'users');
        const userDocRef = doc(usersCollectionRef, friend_info.id);
    
        try {
            const docSnapshot = await getDoc(userDocRef);
            if (docSnapshot.exists()) {

                let registrationDate = docSnapshot.data()?.registrationDate;
                let date = registrationDate.toDate();
                
                let formattedDate = date.toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });

                setFriendRegistrationDate(<Text style={tw`text-lg m-2`}>Регистриран: {formattedDate}</Text>);

            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.log("Error getting document:", error);
        }
    }

    useFocusEffect(() => {
        getFriendProfilePicture();
        getFriendWeightLifted();
        getFriendRegistrationDate();
    })

    const deleteFriend = async () => {
        removeFriend(friend_info);
        navigation.navigate('Приятели')
    }

    return (
        <SafeAreaView style={tw`w-full h-full`}>

            <View style={tw`flex flex-col items-center mb-5`}>

                <View style={tw`w-full`}>

                    <View style={tw`flex items-center`}>
                        {profilePicture === '' ? (
                            <Pressable 
                                style={tw`bg-white w-28 h-28 rounded-full flex items-center justify-center border-2 border-gray-200 ml-2`}
                                
                            >
                                <Ionicons name='person-outline' 
                                    size={40}
                                    color='#000000'  
                                />

                            </Pressable>
                        ) : (
                            <Pressable>
                                <Image
                                    source={{ uri: profilePicture }}
                                    style={tw`w-28 h-28 rounded-full ml-2`}
                                />
                            </Pressable>
                        )}
                    </View>

                </View>

                <View>
                    <Text style={tw`text-xl`}>{friend_info.username}</Text>
                </View>
            </View>

            
            <Text style={tw`text-lg m-2`}>Подвигната тежест: {weightLifted || 0} КГ</Text>
            <Text style={tw`text-lg m-2`}>Брой Тренировки: {workoutsFinished}</Text>
            {friendRegistrationDate}


            <BottomNavigationBar currentPage='ViewFriendProfile' navigation={navigation} removeFriend={deleteFriend}/>

        </SafeAreaView>
    )
}

export default ViewFriendProfile