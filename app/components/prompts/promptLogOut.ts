import { FIREBASE_AUTH } from "@config/firebaseConfig";
import { Alert } from "react-native";

const promptLogOut = (t: any, internetConnected: boolean) => {

    if (!internetConnected) {
        alert(t('unstable-connection'))
        return
    }

    // add confirmation alert before logging out
    Alert.alert(
        t('account-logout'),
        t('account-logout-prompt'),
            [
                {
                    text: t(('cancel')),
                    style: 'cancel',
                },
                {
                    text: t('next'),
                    style: 'destructive',
                    onPress: () => {
                        FIREBASE_AUTH.signOut();
                    },
                },
            ],
        );
    }

export default promptLogOut;