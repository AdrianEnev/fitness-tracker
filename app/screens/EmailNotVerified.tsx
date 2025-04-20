import { FIREBASE_AUTH } from '@config/firebaseConfig';
import { useContext, useEffect, useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { View, Text, Alert } from 'react-native';
import tw from 'twrnc';
import GlobalContext from '@config/GlobalContext';
import { useTranslation } from 'react-i18next';
import reauthenticateAndDelete from '@app/use/settings/remove/useDeleteAccount';

const EmailNotVerified = () => {
    
    const [countDown, setCountDown] = useState(60);
    const { setIsAccountDeleted, setProfilePicture, setSetupRan, setIsEmailVerified, setEmailVerifiedChanged, setAccountJustRegistered } = useContext(GlobalContext);

    // Check email verification status every second while this page is open
    useEffect(() => {
        const interval = setInterval(async () => {
            const user = FIREBASE_AUTH.currentUser;
            if (user) {
                await user.reload();
                if (user.emailVerified) {
                    setIsEmailVerified(true);
                    setEmailVerifiedChanged(true);
                    setAccountJustRegistered(false);
                }
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

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
            console.log('Cooldown period active. Please wait before resending the email.');
        }
    };

    const deleteAccountPrompt = () => {
        Alert.alert((t('delete-account')), '', [
            {
                text: t('cancel'),
                style: 'cancel',
            },
            {
                text: t('delete'),
                style: 'destructive',
                onPress: async () => {
                    // email not verified => account not verified => pass false for isVerified
                    const isVerified = false
                    const password = undefined;

                    await reauthenticateAndDelete(setSetupRan, setIsAccountDeleted, isVerified, password, setProfilePicture);                    
                }
            }
        ]);
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
                    {t('or')} <Text onPress={deleteAccountPrompt} style={tw`font-bold underline`}>{t('delete-account')}</Text>
                </Text>
            </View>
        </View>
    );
};

export default EmailNotVerified;