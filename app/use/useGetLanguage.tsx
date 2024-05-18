import { doc, getDoc } from "firebase/firestore";
import i18next from "i18next";

const getLanguage = async (userInfoCollectionRef: any) => {
    try {
        const docSnapshot = await getDoc(doc(userInfoCollectionRef, 'language'));
        if (docSnapshot.exists()) {
            const language = docSnapshot.data().language;
            await i18next.changeLanguage(language);
           
        } else {

            // moje bi da napravq da izchaka 2 sek da probva pak ili neshto takova che ponqkoga ne go udpateva na vreme
            console.log('Language document does not exist');
        }
    } catch (err) {
        console.error(err);
    }
}

export default getLanguage;