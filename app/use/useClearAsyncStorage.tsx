import AsyncStorage from '@react-native-async-storage/async-storage';

const clearAsyncStorage = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error(error);
    }
}
export default clearAsyncStorage;