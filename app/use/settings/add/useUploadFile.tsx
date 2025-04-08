import { ref, uploadBytesResumable } from "firebase/storage";
import { FIREBASE_STORAGE } from "@config/firebaseConfig";

// Takes in blob image and path then uploads image to firebasde storage
const uploadFile = async (file: Blob, path: string) => {
    const storageRef = ref(FIREBASE_STORAGE, path);
    await uploadBytesResumable(storageRef, file);
};

export default uploadFile;