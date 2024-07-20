import { FIREBASE_AUTH, FIREBASE_STORAGE, FIRESTORE_DB } from '../../firebaseConfig'
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { Alert } from 'react-native';

const changeUsername = async (user: any) => {

    // Vseki chovek koito ima iztriqt akaunt kato priqtel mu se preimenuva na Deleted user
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    getDocs(usersCollectionRef).then((snapshot) => {

        if (snapshot.empty) {
            return;
        }

        snapshot.docs.forEach((doc) => {
            const userId = doc.id;
            // get the friends list of each user
            const userFriendsCollectionRef = collection(FIRESTORE_DB, 'users', userId, 'user_info', 'friends', 'list');
            const q = query(userFriendsCollectionRef, where('id', '==', user.uid));
            getDocs(q).then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                    // if the deleted user is in their friends list, change the name
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

const deleteAccount = async (email: any, user: any) => {
        
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
                        reauthenticateAndDelete(password)
                    },
                },
            ],
            'secure-text'
        );


        const reauthenticateAndDelete = (password: string | undefined) => {

            if (email && password && user) {

                const credentials = EmailAuthProvider.credential(email, password);
                
                 // reauthenticate (needed in order to delete account)
                 reauthenticateWithCredential(user, credentials).then(async () => {
                    // user reauthenticated, delete account
                    if (user) {
                        deleteUser(user).then(() => {
                            // user deleted, sign out
                            FIREBASE_AUTH.signOut();
                        }).catch((error: any) => {
                            console.log(error);
                        });

                        await changeUsername(user);
                        await removeReceivedRequests(user);

                        // delete user from Firestore
                        const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
                        deleteDoc(userDocRef).catch((error) => {
                            console.log(error);
                        });

                        const storage = getStorage();
                        const desertRef = ref(storage, `users/${FIREBASE_AUTH.currentUser?.uid}/profile_picture`);

                        deleteObject(desertRef).then(() => {
                            console.log("File deleted successfully");
                        }).catch((error) => {
                            console.log("Uh-oh, an error occurred!"); 
                        });

                    
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }

        }

}

export default deleteAccount;