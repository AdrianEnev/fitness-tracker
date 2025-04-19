import changeUsername from "@app/use/settings/change/useChangeUsername";
import { Alert } from "react-native";

const promptChangeUsername = async (
    t: any, 
    username: string | null, 
    setChangingUsernameRunning: (value: boolean) => void, 
    setUsername: (value: string | null) => void,
    internetConnected: boolean
) => {

    if (!internetConnected) {
        alert(t('unstable-connection'))
        return
    }

    Alert.prompt(
        t('change-username'),
        t('change-username-prompt'),
        [
            {
                text: t('cancel'),
                style: 'destructive',
            },
            {
                text: t('change-short'),
                style: 'default',
                onPress: async (newUsername: string | undefined) => {

                    if (!username){
                        alert(t('error'))
                        return
                    };

                    const trimmedUsername = newUsername?.trim();
                    await changeUsername(username, String(trimmedUsername), setChangingUsernameRunning, t, setUsername); 
                
                },
            },
        ],
        'plain-text',
    );
}

export default promptChangeUsername;