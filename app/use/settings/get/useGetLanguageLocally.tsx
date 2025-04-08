import AsyncStorage from "@react-native-async-storage/async-storage"
import i18next from "i18next";

export const getLanguageLocally = async () => {
   
    const language = await AsyncStorage.getItem(`language`);

    if (language === null) {

        console.log('Language document does not exist');
        return;
    }

    await i18next.changeLanguage(language);
}