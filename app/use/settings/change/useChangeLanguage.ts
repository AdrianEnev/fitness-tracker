import { FIREBASE_AUTH } from "@config/firebaseConfig";

const changeLanguage = async (language: string) => {

    const userId = FIREBASE_AUTH.currentUser?.uid;
            
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/language?language=${language}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
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