import { FIREBASE_AUTH } from '../../firebaseConfig'
import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import { Alert } from 'react-native';

const deleteAccount = (email: any, user: any) => {
        
        Alert.prompt(
            'Изтриване на акаунт',
            'Сигурен ли си, че изкаш да изтриеш акаунта си?',
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
                 reauthenticateWithCredential(user, credentials).then(() => {
                    // user reauthenticated, delete account
                    if (user) {
                        deleteUser(user).then(() => {
                            // user deleted, sign out
                            FIREBASE_AUTH.signOut();
                        }).catch((error: any) => {
                            console.log(error);
                        });
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }

        }

}

export default deleteAccount;