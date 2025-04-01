import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { useContext, useEffect, useState } from 'react';
import { deleteUser, sendEmailVerification } from 'firebase/auth';
import { View, Text, Alert } from 'react-native';
import tw from 'twrnc';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { deleteDoc, doc } from 'firebase/firestore';
import GlobalContext from '../../GlobalContext';
import { useTranslation } from 'react-i18next';

const EmailNotVerified = () => {
    
    const [countDown, setCountDown] = useState(60);

    const {setIsAccountDeleted} = useContext(GlobalContext);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (countDown !== 0) {
                setCountDown(countDown - 1);
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [countDown]);

    const resendEmail = () => {
        if (countDown === 0) {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                sendEmailVerification(user)
                    .then(() => {
                        console.log('Verification email sent.');
                        setCountDown(60);
                    })
                    .catch((error) => {
                        console.error('Error sending verification email:', error);
                    });
            }
        } else {
            console.log('Please wait');
        }
    };

    const deleteAccount = () => {

        Alert.prompt((t('delete-account')), (t('enter-password-to-delete-account')), [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: async (password) => {
                    deleteAccountDatabase();
                }
            }
        ]);
            
    }

    const deleteAccountDatabase = async () => {

        const user = FIREBASE_AUTH.currentUser;
        if (!user) return
        
        deleteUser(user).then(() => {
            FIREBASE_AUTH.signOut();
            setIsAccountDeleted(true)
        }).catch((error: any) => {
            console.log(error);
        });

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
        
    }

    const {t} = useTranslation();

    return (
        <View style={tw`flex-1 bg-white`}>
            <View style={tw`h-full justify-center`}>
                <Text style={tw`font-bold text-2xl text-center`}>{t('email-sent')}!</Text>
                <Text style={tw`font-medium text-lg text-center mt-2`}>
                    {t('click-on-email-link')} <Text style={tw`font-bold`}>{FIREBASE_AUTH.currentUser?.email}</Text>
                </Text>
                <Text style={tw`font-medium text-base text-center mt-2`}>
                    {t('didnt-receive-email')} <Text onPress={resendEmail} style={tw`font-bold underline`}>{t('send-again')}</Text> ({countDown})
                </Text>
                <Text style={tw`font-medium text-base text-center mt-2`}>
                    {t('or')} <Text onPress={deleteAccount} style={tw`font-bold underline`}>{t('delete-account')}</Text>
                </Text>
            </View>
        </View>
    );
};

export default EmailNotVerified;