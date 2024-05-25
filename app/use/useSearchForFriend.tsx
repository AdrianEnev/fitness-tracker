import { collection, doc, getDocs, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebaseConfig";

const searchForFriend = async (search: string): Promise<{id: string, username: string}[]> => {
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocs = await getDocs(usersCollectionRef);
    const users: {id: string, username: string}[] = [];

    console.log(`Searching for: ${search}`);

    for (let userDoc of userDocs.docs) {
        const usernameDocRef = doc(FIRESTORE_DB, `users/${userDoc.id}/user_info/username`);
        const usernameDoc = await getDoc(usernameDocRef);

        if (usernameDoc.exists() && usernameDoc.data().username.toLowerCase().includes(search.toLowerCase())) {
            //console.log(`Match found for user: ${userDoc.id}`);
            console.log(`Suggestions found: ${usernameDoc.data().username}`);
            users.push({id: userDoc.id, username: usernameDoc.data().username});
            
        }else {
            //console.log(`No match found, going to next user...`);
        }
    }

    return users;
}

export default searchForFriend;