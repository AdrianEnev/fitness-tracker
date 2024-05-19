import { ref, uploadBytesResumable } from "firebase/storage";
import { FIREBASE_STORAGE } from "../../firebaseConfig";

const uploadFile = async (file: Blob, path: string) => {
    const storageRef = ref(FIREBASE_STORAGE, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Handle progress
      }, 
      (error) => {
        // Handle error
      }, 
      () => {
        // Handle successful upload
      }
    );
  };

export default uploadFile;