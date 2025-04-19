import { EmailAuthProvider, getAuth, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword } from "firebase/auth";
import { Alert } from "react-native";

const promptChangePassword = (email: any, t: any, internetConnected: boolean) => {

    if (!internetConnected) {
        alert(t('unstable-connection'))
        return
    }

    const auth = getAuth();
    const user = auth.currentUser;

    Alert.prompt(
        t('change-password'),
        t('old-password'),
        [
            {
                text: t('cancel'),
                style: 'cancel',
            },
            {
                text: t('next'),
                style: 'default',
                onPress: async (oldPassword: string | undefined) => {

                    if (email && oldPassword && user) {

                        const credentials = EmailAuthProvider.credential(email, oldPassword);
                        
                        reauthenticateWithCredential(user, credentials).then(() => {
                            
                            Alert.prompt(
                                t('change-password'),
                                t('new-password'),
                                [
                                    {
                                        text: t('cancel'),
                                        style: 'cancel',
                                    },
                                    {
                                        text: t('done'),
                                        style: 'default',
                                        onPress: (newPassword: string | undefined) => {
                                            
                                            if (newPassword && oldPassword != newPassword) {
        
                                                updatePassword(user, newPassword).then(() => {
                            
                                                    alert(t('password-changed-successfuly'));
                            
                                                }).catch((error) => {
                                                    console.log(error);
                                                });
        
                                            }else if (oldPassword == newPassword) {
                                                alert(t('new-password-same-as-old'));
                                            }
                                            
        
                                        },
                                    },
                                ],
                                'secure-text'
                            );
                            
                        }).catch(async (error) => {
                           
                            Alert.alert(
                                t('wrong-password'),
                                '' + oldPassword,
                                [
                                    {
                                        text: t('send-passwrod-reset-email'),
                                        style: 'default',
                                        onPress: () => {
                                            // send a password reset email
                                            sendPasswordResetEmail(auth, email).then(() => {
                                                alert(t('password-reset-email-sent'));
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
export default promptChangePassword;