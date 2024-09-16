import AsyncStorage from "@react-native-async-storage/async-storage";

const getLocalLanguageSet = async () => {

    try {
        const localLanguage = await AsyncStorage.getItem('language');

        if (localLanguage) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}

export default getLocalLanguageSet;