import { doc, getDoc } from "firebase/firestore";

const getUsername = async (userInfoCollectionRef: any) => {
    try {
        const docSnapshot = await getDoc(doc(userInfoCollectionRef, 'username'));
        if (docSnapshot.exists()) {
            return docSnapshot.data().username;
        } else {
            console.log('Username document does not exist');
        }
    } catch (err) {
        console.error(err);
    }
}

export default getUsername;