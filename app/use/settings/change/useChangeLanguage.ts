import { FIREBASE_AUTH } from "@config/firebaseConfig";

const changeLanguage = async (language: string) => {

    const userId = FIREBASE_AUTH.currentUser?.uid;
            
    try {
        const response = await fetch(`http://172.20.10.5:3000/api/users/${userId}/language?language=${language}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', 
            }
        });

        if (!response.ok) {
            console.error("Error changing language: error:", response.statusText);
            return null;
        }

        console.log('Language changed successfuly to:', language);
        
    } catch (error) {
        console.error("Error changing language: error:", error);
        return null;
    }

}

export default changeLanguage;