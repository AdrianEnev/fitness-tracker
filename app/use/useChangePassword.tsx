import { EmailAuthProvider, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { collection, doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { Alert } from "react-native";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";

const changePassword = (email: any, user: any, auth: any) => {

    // prompt the user to enter their old password
    // if the old password is correct, prompt the user to enter their new password
    // update the password with the new password

    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const userInfoCollectionRef = collection(userDocRef, 'user_info');

    Alert.prompt(
        'Смяна на парола',
        'Стара парола:',
        [
            {
                text: 'Отказ',
                style: 'cancel',
            },
            {
                text: 'Напред',
                style: 'default',
                onPress: async (oldPassword: string | undefined) => {

                    if (email && oldPassword && user) {

                        const credentials = EmailAuthProvider.credential(email, oldPassword);
                        
                        reauthenticateWithCredential(user, credentials).then(() => {
                            
                            Alert.prompt(
                                'Смяна на парола',
                                'Нова парола:',
                                [
                                    {
                                        text: 'Отказ',
                                        style: 'cancel',
                                    },
                                    {
                                        text: 'Готово',
                                        style: 'default',
                                        onPress: (newPassword: string | undefined) => {
                                            
                                            if (newPassword) {
        
                                                updatePassword(user, newPassword).then(() => {
                            
                                                    Alert.alert('Успешна смяна на парола');
                            
                                                }).catch((error) => {
                                                    console.log(error);
                                                });
        
                                            }
                                            
        
                                        },
                                    },
                                ],
                                'secure-text'
                            );
                            
                        }).catch(async (error) => {
                           
                            Alert.alert(
                                'Грешна парола!',
                                '' + oldPassword,
                                [
                                    {
                                        text: 'Изпрати имейл',
                                        style: 'default',
                                        onPress: () => {
                                            // send a password reset email
                                            sendPasswordResetEmail(auth, email).then(() => {
                                                Alert.alert('Пратен е имейл за смяна на парола');
                                            }).catch((error) => {
                                                console.log(error);
                                            });
                                        },
                                    },
                                    {
                                        text: 'Отказ',
                                        style: 'cancel',
                                    },
                                ]
                            );
                        });
                    }

                },
            },
        ],
        'secure-text'
    );

}
export default changePassword;