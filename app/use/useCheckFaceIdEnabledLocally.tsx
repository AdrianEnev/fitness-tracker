import AsyncStorage from "@react-native-async-storage/async-storage"

const checkFaceIdEnabledLocally = async () => {
    const faceIdEnabled = await AsyncStorage.getItem('faceIdEnabled')

    if (faceIdEnabled == '') {
        AsyncStorage.setItem('faceIdEnabled', 'false')
    } else {
        return faceIdEnabled ? JSON.parse(faceIdEnabled) : null;
    }
}

export default checkFaceIdEnabledLocally