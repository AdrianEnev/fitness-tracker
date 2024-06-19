import { addDoc, doc, getDoc, setDoc } from "firebase/firestore";

export const checkUserDocument = async (userDocRef: any, user: any, userInfoCollectionRef: any) => {
    try {
        const userDocSnapshot = await getDoc(userDocRef);
        if (!userDocSnapshot.exists()) {
            await setDoc(userDocRef, { userID: user.uid, lastLogin: new Date(), registrationDate: new Date() });

            addDoc(userInfoCollectionRef, {
                status: 'online',
            });
        } else {
            await setDoc(userDocRef, { userID: user.uid, lastLogin: new Date() }, { merge: true });
            setDoc(doc(userInfoCollectionRef, 'status'), { status: 'online' });
        }
    } catch (err) {
        console.error(err);
    }

};

export const checkLanguageDocument = async (userInfoCollectionRef: any) => {
    try {
        const languageDocRef = doc(userInfoCollectionRef, 'language');
        const languageDocSnapshot = await getDoc(languageDocRef);
        if (!languageDocSnapshot.exists()) {
            await setDoc(languageDocRef, { language: 'bg' });
        }
    } catch (err) {
        console.error(err);
    }
};

export const checkUserInfoCollection = async (userInfoCollectionRef: any) => {
    try {
        const nutrientsDocRef = doc(userInfoCollectionRef, 'nutrients');
        const docSnapshot = await getDoc(nutrientsDocRef);
        return docSnapshot.exists();
        // exists
    } catch (err) {
        console.error(err);
        return false;
    }
}
