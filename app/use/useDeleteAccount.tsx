import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH, FIREBASE_STORAGE, FIRESTORE_DB } from '../../firebaseConfig'
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { Alert } from 'react-native';
import { useContext } from 'react';
import GlobalContext from '../../GlobalContext';
import getEmail from './useGetEmail';
import syncFood from '../syncData/useSyncFood';
import syncNutrients from '../syncData/useSyncNutrients';
import syncSavedWorkouts from '../syncData/useSyncSavedWorkouts';
import syncWorkouts from '../syncData/useSyncWorkouts';
import syncWorkoutsInFolders from '../syncData/useSyncWorkoutsInFolders';

const changeUsername = async (user: any) => {
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    getDocs(usersCollectionRef).then((snapshot) => {
        if (snapshot.empty) {
            return;
        }
        snapshot.docs.forEach((doc) => {
            const userId = doc.id;
            const userFriendsCollectionRef = collection(FIRESTORE_DB, 'users', userId, 'user_info', 'friends', 'list');
            const q = query(userFriendsCollectionRef, where('id', '==', user.uid));
            getDocs(q).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    const deletedUserName = "Deleted User" + Math.floor(Math.random() * 100000);
                    updateDoc(doc.ref, { username: deletedUserName });
                });
            });
        });
    });
}

const removeReceivedRequests = async (user: any) => {
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const snapshot = await getDocs(usersCollectionRef);
    console.log(`Found ${snapshot.size} users.`);
    await Promise.all(snapshot.docs.map(async (docSnapshot) => {
        const userId = docSnapshot.id;
        console.log(`Processing user with ID: ${userId}`);
        const ReceivedRequestsDocRef = doc(usersCollectionRef, userId, 'user_info', 'friendRequests', 'received', user.uid);
        const friendRequestDocSnapshot = await getDoc(ReceivedRequestsDocRef);
        if (friendRequestDocSnapshot.exists()) {
            console.log(`Found friend request for user with ID: ${user.uid}`);
            await deleteDoc(ReceivedRequestsDocRef);
        } else {
            console.log(`No friend request found for user with ID: ${user.uid}`);
        }
    }));
}


const deleteAccount = async (
    email: any, 
    user: any, 
    setProfilePicture: any, 
    setSetupRan: any, 
    setIsAccountDeleted: any,
    setIsSyncingInfoModalVisible: any
) => {
    
    Alert.prompt(
        'Изтриване на акаунт',
        'Въведи паролата за този акаунт, за да го изтриеш',
        [
            {
                text: 'Отказ',
                style: 'cancel',
            },
            {
                text: 'Изтриване',
                style: 'destructive',
                onPress: (password: string | undefined) => {
                    reauthenticateAndDelete(password, setProfilePicture, setSetupRan, setIsAccountDeleted);
                },
            },
        ],
        'secure-text'
    );

    const reauthenticateAndDelete = (password: string | undefined, setProfilePicture: any, setSetupRan: any, setIsAccountDeleted: any) => {
        if (email && password && user) {
            const credentials = EmailAuthProvider.credential(email, password);
            reauthenticateWithCredential(user, credentials).then(async () => {
                if (user) {

                    Alert.alert(
                        'Sync Information',
                        'Would you like to sync all workouts and foods to the database before deleting your account? This will allow you to later retreive them from another account.',
                        [ 
                            {
                                text: 'Sync and delete',
                                style: 'cancel',
                                onPress: async (password: string | undefined) => {
                                    setIsSyncingInfoModalVisible(true)
                                    await syncInformation()
                                    proceedDeletion();
                                },
                            },
                            {
                                text: 'Delete without syncing',
                                style: 'destructive',
                                onPress: () => {
                                    proceedDeletion();
                                }
                            },
                        ],
                    );

                    const syncInformation = async () => {
                        await syncFood()
                        await syncNutrients()
                        await syncSavedWorkouts()
                        await syncWorkouts()
                        syncWorkoutsInFolders()
                    }

                    const proceedDeletion = async () => {
                        deleteUser(user).then(() => {
                            FIREBASE_AUTH.signOut();
                            setIsAccountDeleted(true)
                        }).catch((error: any) => {
                            console.log(error);
                        });
    
                        await changeUsername(user);
                        await removeReceivedRequests(user);
    
                        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
                        deleteDoc(userDocRef).catch((error) => {
                            console.log(error);
                        });
    
                        const storage = getStorage();
                        const desertRef = ref(storage, `users/${FIREBASE_AUTH.currentUser?.uid}/profile_picture`);
    
                        deleteObject(desertRef).then(() => {
                            console.log("File deleted successfully");
                        }).catch((error) => {
                            if (error !== "[FirebaseError: Firebase Storage: Object 'users/undefined/profile_picture' does not exist. (storage/object-not-found)]"){
                                console.log(error)
                            }
                        });
    
                        const asyncStorageEmail = await getEmail()
    
                        AsyncStorage.removeItem(`username_${asyncStorageEmail}`)
                        AsyncStorage.removeItem(`email`)
                        AsyncStorage.removeItem(`statistics_${asyncStorageEmail}`)
                        AsyncStorage.removeItem(`workouts_${asyncStorageEmail}`)
                        AsyncStorage.removeItem(`savedWorkouts`)
                        AsyncStorage.removeItem(`goal_nutrients_${asyncStorageEmail}`)
    
                        // Reset GlobalContext to default values
                        setProfilePicture('');
                        setSetupRan(false);
                        
                    }
                    
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    }
}

export default deleteAccount;