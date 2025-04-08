import AsyncStorage from "@react-native-async-storage/async-storage"

const checkForBiometricsLocally = async () => {
    const faceIdEnabled = await AsyncStorage.getItem('faceIdEnabled')

    if (faceIdEnabled == '') {
        return false
    }else{
        return faceIdEnabled ? JSON.parse(faceIdEnabled) : null;
    }
}
    

export default checkForBiometricsLocally