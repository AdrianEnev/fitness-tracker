import { FIREBASE_AUTH } from '../../firebaseConfig';
import { useEffect, useState } from 'react';
import { sendEmailVerification } from 'firebase/auth';
import { View, Text } from 'react-native';
import tw from 'twrnc';

const EmailNotVerified = () => {
    const [countDown, setCountDown] = useState(60);

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
        console.log('deleting account');
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            <View style={tw`h-full justify-center`}>
                <Text style={tw`font-bold text-2xl text-center`}>We have sent you an email!</Text>
                <Text style={tw`font-medium text-lg text-center mt-2`}>
                    Click on the email verification link sent to you on <Text style={tw`font-bold`}>{FIREBASE_AUTH.currentUser?.email}</Text>
                </Text>
                <Text style={tw`font-medium text-base text-center mt-2`}>
                    Didn't receive the email yet? <Text onPress={resendEmail} style={tw`font-bold underline`}>Send Again</Text> ({countDown})
                </Text>
                <Text style={tw`font-medium text-base text-center mt-2`}>
                    Or <Text onPress={deleteAccount} style={tw`font-bold underline`}>delete account</Text>
                </Text>
            </View>
        </View>
    );
};

export default EmailNotVerified;