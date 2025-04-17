import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASE_AUTH } from '@config/firebaseConfig'
import { reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'
import getEmail from '@use/settings/get/useGetEmail';

// Function to reauthenticate the user and delete the account
const reauthenticateAndDelete = async (
    setProfilePicture: any, 
    setSetupRan: any, 
    setIsAccountDeleted: any, 
    isVerified: boolean,
    password?: string | undefined, 
) => {

    const email = await getEmail();
    const user = FIREBASE_AUTH.currentUser;

    if (!email || !user) {
        return
    }

    if (password && isVerified) {

        // Reauthenticate user before deleting account
        // Required by firebase
        const credentials = EmailAuthProvider.credential(email, password);
        reauthenticateWithCredential(user, credentials).then(async () => {
            if (user) {
                await deleteAccountDatabase(
                    user, 
                    email, 
                    setProfilePicture, 
                    setSetupRan, 
                    setIsAccountDeleted, 
                    isVerified
                );
            }
        }).catch((error) => {
            console.log(error);
        });
    }else{
        await deleteAccountDatabase(
            user, 
            email, 
            setProfilePicture, 
            setSetupRan, 
            setIsAccountDeleted, 
            isVerified
        );
    }
}

const deleteAccountDatabase = async (
    user: any, 
    email: string, 
    setProfilePicture: any, 
    setSetupRan: any, 
    setIsAccountDeleted: any, 
    isVerified: boolean
) => {

    if (!user) return
    
    try {
        const response = await fetch(`http:/172.20.10.5:3000/api/users/${user.uid}?isVerified=${isVerified}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })

        if (!response.ok) {
            console.error("error deleting account:", response);
            return null;
        }

        // Delete asyncstorage data for this user
        AsyncStorage.removeItem(`username_${email}`)
        AsyncStorage.removeItem(`email`)
        AsyncStorage.removeItem(`statistics_${email}`)
        AsyncStorage.removeItem(`workouts_${email}`)
        AsyncStorage.removeItem(`savedWorkouts`)
        AsyncStorage.removeItem(`goal_nutrients_${email}`)

        FIREBASE_AUTH.signOut();

        // Reset GlobalContext to default values
        setProfilePicture('');
        setSetupRan(false);
        setIsAccountDeleted(true)

        console.log('Account deleted from database');

    }catch (error) {
        console.error('Error deleting account:', error);
    }
}

export default reauthenticateAndDelete;