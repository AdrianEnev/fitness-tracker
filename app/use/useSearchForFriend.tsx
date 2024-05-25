import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebaseConfig";

const searchForFriend = async (search: string): Promise<any[]> => {
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocs = await getDocs(usersCollectionRef);
    const users: any[] = [];

    console.log(`Searching for: ${search}`);
    console.log(`Number of user documents: ${userDocs.docs.length}`);

    for (let userDoc of userDocs.docs) {
        console.log(`Checking user: ${userDoc.id}`);

        const usernameDocRef = doc(FIRESTORE_DB, `users/${userDoc.id}/user_info/username`);
        const usernameDoc = await getDoc(usernameDocRef);

        if (usernameDoc.exists()) {
            console.log(`Username document exists for user: ${userDoc.id}`);
            console.log(`Username in document: ${usernameDoc.data().username}`);

            if (usernameDoc.data().username === search) {
                console.log(`Match found for user: ${userDoc.id}`);
                users.push(userDoc.id);
            }
        } else {
            console.log(`Username document does not exist for user: ${userDoc.id}`);
        }
    }

    return users;
}

export default searchForFriend;