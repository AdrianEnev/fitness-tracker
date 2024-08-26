import AsyncStorage from "@react-native-async-storage/async-storage";

const getEmail = async () => {
    try {

        const email = await AsyncStorage.getItem(`email`);
        //console.log(email)
        return email;
    } catch (err) {
        console.error('Error retrieving email:', err);
        return null;
    }
};

export default getEmail;