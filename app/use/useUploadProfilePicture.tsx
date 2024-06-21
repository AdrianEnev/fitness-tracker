import * as ImagePicker from 'expo-image-picker';
import uploadFile from '../use/useUploadFile'
import { useContext } from 'react';
import GlobalContext from '../../GlobalContext';
import { FIREBASE_AUTH } from '../../firebaseConfig';



const uriToBlob = async (uri: string): Promise<Blob> => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;
  };

// okazva se che ima po lesen nachin za updatevane na profilna direktno ot firebase akaunta na usera ama veche napravih toq nachin tui che taka shte sedi  
const uploadProfilePicture = async ({setProfilePicture}: any) => {

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    });
  
    if (!result.canceled) {

        const blob = await uriToBlob(result.assets[0].uri);
        await uploadFile(blob, `users/${FIREBASE_AUTH.currentUser?.uid}/profile_picture`);
        alert('Snimkata be kachena uspeshno!')

        setProfilePicture(result.assets[0].uri);

    }
};

export default uploadProfilePicture;