import AsyncStorage from "@react-native-async-storage/async-storage"
import getEmail from "./useGetEmail";
import i18next from "i18next";

export const getLanguageLocally = async () => {
    const email = await getEmail()
    const language = await AsyncStorage.getItem(`language_${email}`);

    if (language === null) {

        console.log('Language document does not exist');
        return;
    }

    await i18next.changeLanguage(language);
}