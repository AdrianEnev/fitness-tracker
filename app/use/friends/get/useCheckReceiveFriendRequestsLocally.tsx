import AsyncStorage from "@react-native-async-storage/async-storage"

const checkReceiveFriendRequestsLocally = async () => {
    const receiveFriendRequests = await AsyncStorage.getItem('receiveFriendRequests')

    if (receiveFriendRequests == '') {
        AsyncStorage.setItem('receiveFriendRequests', 'true')
    } else {
        return receiveFriendRequests ? JSON.parse(receiveFriendRequests) : null;
    }
}

export default checkReceiveFriendRequestsLocally