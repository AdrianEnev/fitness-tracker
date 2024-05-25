import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { FIREBASE_AUTH, FIREBASE_STORAGE } from "../../firebaseConfig";

const getProfilePicture = async () => {
    
    const imagePath = `users/${FIREBASE_AUTH.currentUser?.uid}/profile_picture`;
    const imageRef = ref(FIREBASE_STORAGE, imagePath);

    try {

        const url = await getDownloadURL(imageRef);
        return url

    } catch (error) {
        //console.error("Error getting document:", error);
        return null;
  }
};

export default getProfilePicture;